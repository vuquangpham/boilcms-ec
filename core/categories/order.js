const Category = require('../classes/category/category');
const ProductCategory = require('../categories/product');
const MediaCategory = require('../categories/media');
const Type = require('../classes/utils/type');
const Variation = require('../database/product/variation.model');
const {getProductViaVariation, generateOrderID} = require("../utils/helper.utils");

// category
const UserCategory = require('./user');

class Order extends Category{
    constructor(config){
        super(config);
    }

    calculateShippingFee(options){
        const shippingObject = {
            "service_type_id": 2,
            "from_district_id": 3695, // Thu Duc
            "coupon": null,
            "length": 30,
            "width": 30,
            "height": 30,

            // override
            ...options
        };

        return new Promise((resolve, reject) => {
            fetch(process.env.GHN_SHIPPING_URL, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "token": process.env.GHN_TOKEN,
                    "shop_id": process.env.GHN_SHOP_ID
                },
                body: JSON.stringify(shippingObject)
            })
                .then(res => res.json())
                .then(result => {
                    if(result.code !== 200) throw new Error('Server is busy right now!');
                    resolve(result);
                })
                .catch(e => reject(e));
        });
    }

    updateProductQuantity(product, variation, quantity){
        // update the quantity in product
        const productType = variation.productType;
        const isSimpleProduct = productType === 'simple';

        // get object
        const jsonText = isSimpleProduct ? product.simpleProductJSON : product.variableProductJSON;
        const productObject = JSON.parse(jsonText);

        if(isSimpleProduct){
            productObject.inventory -= quantity;
            product.simpleProductJSON = JSON.stringify(productObject);
        }else{
            productObject.variations[variation.variationIndex].inventory -= quantity;
            product.variableProductJSON = JSON.stringify(productObject);
        }

        return product;
    }

    add(data){
        const variations = data.variations;
        const quantities = data.quantities;

        // vars
        let totalPrice = 0;
        let savedPrice = 0;

        const weightPerProduct = 60; // gam
        let totalWeight = 0;

        return new Promise(async(resolve, reject) => {

            // user doesn't exist
            if(!data.user){
                return reject(new Error(`The user doesn't exist!`));
            }

            const user = await UserCategory.databaseModel.findById(data.user._id).populate('cart');

            // generate order id from username, run again if orderID existed in database
            let orderID, existingOrderID;
            do{
                orderID = generateOrderID(data.user.name);
                existingOrderID = await this.databaseModel.findOne({orderID});
            }while(existingOrderID);

            try{
                const variationPromises = variations.map(async(id, index) => {

                    // get product based on variation
                    const variation = await Variation.findById(id);
                    const quantity = quantities[index];
                    const [product, productVariation] = await getProductViaVariation(variation);

                    // cart in user
                    const variationIndex = user.cart.findIndex(c => c._id.toString() === id);

                    // product variation doesn't exist => maybe deleted
                    if(!productVariation){
                        // update cart, remove the variation in cart
                        cart.splice(variationIndex, 1);

                        // remove cart in database
                        const removeVariationPromise = Variation.findOneAndRemove({_id: variation._id});

                        // save cart
                        const saveUserPromise = user.save();

                        // waiting for saving in database
                        await Promise.all([removeVariationPromise, saveUserPromise]);

                        // reject
                        throw new Error(`The product in cart item has been deleted!`);
                    }

                    // valid quantity
                    const availableQuantity = productVariation.inventory;
                    const validatedQuantity = Math.min(availableQuantity, quantity);

                    // calculate price
                    const price = productVariation.price;
                    const salePrice = productVariation.salePrice;
                    const hasSalePrice = !!salePrice;
                    const finalPrice = hasSalePrice ? salePrice : price;
                    savedPrice += hasSalePrice ? (parseFloat(price - salePrice) * validatedQuantity) : 0;
                    totalPrice += finalPrice * validatedQuantity;

                    // calculate weigth
                    totalWeight += weightPerProduct * validatedQuantity;

                    // update quantity in product
                    const productAfterUpdatingInventory = this.updateProductQuantity(product, variation, quantity);

                    // remove from the cart of user
                    user.cart.splice(variationIndex, 1);

                    // remove variation
                    const removeVariationPromise = Variation.findOneAndRemove({_id: variation._id});

                    // save product
                    const saveProductPromise = productAfterUpdatingInventory.save();

                    // update the new information
                    await Promise.all([saveProductPromise, removeVariationPromise]);

                    return {
                        productId: variation.productId,
                        quantity: validatedQuantity,
                        price,
                        salePrice,
                        selectedAttributes: productVariation.selectedAttributes || []
                    };
                });

                // save variations
                const newVariations = await Promise.all(variationPromises);

                // save user promise;
                await user.save();

                // calculate shipping fee
                const shippingObject = {
                    insurance_value: totalPrice,
                    weight: totalWeight,
                    "to_district_id": parseInt(data.districtId),
                    "to_ward_code": data.wardCode,
                };
                const shippingFeeObj = await this.calculateShippingFee(shippingObject);
                const shippingFee = shippingFeeObj.data.total;

                // calculate total price
                totalPrice = totalPrice + shippingFee;

                // add to the order schema
                const instance = new this.databaseModel({
                    user: user,
                    orderID: orderID,
                    variations: newVariations,

                    fullName: data.fullName,
                    phoneNumber: data.phoneNumber,

                    provinceId: data.provinceId,
                    districtId: data.districtId,
                    wardCode: data.wardCode,

                    address: data.prettyAddress,
                    description: data.description,
                    shippingFee: shippingFee,

                    paymentMethod: data.paymentMethod,
                    couponCode: data.couponCode,

                    savedPrice: savedPrice,
                    totalPrice: totalPrice
                });

                instance.save().then(result => resolve(result)).catch(e => reject(e));

            }catch(e){
                console.log(e);
                reject(e);
            }
        });
    }

    async validateInputData(inputData, action = 'add'){
        const request = inputData.request;
        const response = inputData.response;

        // vars
        const fullName = request.body.name;
        const phoneNumber = request.body.phoneNumber;
        const provinceId = request.body.province;
        const districtId = request.body.district;
        const wardCode = request.body.ward;
        const prettyAddress = request.body['pretty-address'];
        const address = request.body.address;
        const description = request.body.description;
        const paymentMethod = request.body.payment;
        const couponCode = request.body['coupon-code'];

        let quantities = [];

        const returnObj = {
            fullName,
            phoneNumber,
            provinceId,
            districtId,
            wardCode,
            prettyAddress,
            address,
            description,
            paymentMethod,
            couponCode
        };

        if(action === 'edit') {
            returnObj.status = request.body.status;
            returnObj.isPaid = request.body.isPaid;
        }

        if(action === 'add') {
            const variations = typeof request.body.variations === 'string' ? [request.body.variations] : request.body.variations;

            try{
                // get quantities
                const variationPromises = variations.map(variationId => Variation.findById(variationId));
                const result = await Promise.all(variationPromises);
                quantities = result.map(r => r.quantity);

            }catch(e){
                console.log(e);
            }

            returnObj.user = response.locals.user;
            returnObj.variations = variations;
            returnObj.quantities = quantities;
        }

        return returnObj
    }

    /**
     * Get all data from order
     * @return {Promise}
     * */
    getAllData(){
        return new Promise((resolve, reject) => {
            this.databaseModel.find().populate('user')
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
    getDataById(id){
        return new Promise((resolve, reject) => {
            this.databaseModel.findById(id).populate('user')
                .then(async data => {
                    if(data.variations.length > 0){
                        for (const variation of data.variations) {
                            let variationProduct = await ProductCategory.getDataById(variation.productId)
                            let variationMedia = await MediaCategory.getDataById(variationProduct.categoryImage)
                            variation.productName = variationProduct.name;
                            variation.image = variationMedia
                        }
                    }

                    resolve(data);
                })
                .catch(async err => {
                    reject(err);
                });
        });
    }
}

module.exports = new Order({
    name: 'Orders',
    url: '/orders',
    type: 'orders',
    contentType: Type.types.ORDERS,
    order: 99
});