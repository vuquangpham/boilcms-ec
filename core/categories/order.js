const Category = require('../classes/category/category');
const Type = require('../classes/utils/type');
const Variation = require('../database/product/variation.model');
const {getProductViaVariation} = require("../utils/helper.utils");

// category
const UserCategory = require('./user');

class Order extends Category{
    constructor(config){
        super(config);
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
        console.log('add', data);
        const variations = data.variations;
        const quantities = data.quantities;
        let totalPrice = 0;
        let savedPrice = 0;

        return new Promise(async(resolve, reject) => {

            // user doesn't exist
            if(!data.user){
                return reject(new Error(`The user doesn't exist!`));
            }

            const user = await UserCategory.databaseModel.findById(data.user._id).populate('cart');

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
                        const removeVariationPromise = variation.remove();

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

                    // update variation
                    const variationUpdatePromise = Variation.findOneAndUpdate({_id: id}, {quantity: validatedQuantity});

                    // update quantity in product
                    const productAfterUpdatingInventory = this.updateProductQuantity(product, variation, quantity);

                    // remove from the cart of user
                    user.cart.splice(variationIndex, 1);

                    // save product
                    const saveProductPromise = productAfterUpdatingInventory.save();

                    // update the new information
                    await Promise.all([variationUpdatePromise, saveProductPromise]);

                    // return new variation after updated
                    return Variation.findById(id);
                });

                // save variations
                const newVariations = await Promise.all(variationPromises);

                // save user promise;
                const savedUser = await user.save();

                // calculating shipping fee

                return undefined;
                // add to the order schema
                const instance = new this.databaseModel({
                    user: user,
                    variations: newVariations
                });

            }catch(e){
                console.log(e);
                reject(e);
            }
        });
    }

    async validateInputData(inputData){
        const request = inputData.request;
        const response = inputData.response;

        // vars
        const variations = typeof request.body.variations === 'string' ? [request.body.variations] : request.body.variations;
        const fullName = request.body.name;
        const phoneNumber = request.body.phoneNumber;
        const provinceId = request.body.province;
        const districtId = request.body.district;
        const wardCode = request.body.ward;
        const prettyAddress = request.body['pretty-address'];
        const address = request.body.address;
        const description = request.body.description;
        const payment = request.body.payment;
        const couponCode = request.body['coupon-code'];
        const user = response.locals.user;
        let quantities = [];

        try{
            // get quantities
            const variationPromises = variations.map(variationId => Variation.findById(variationId));
            const result = await Promise.all(variationPromises);
            quantities = result.map(r => r.quantity);

        }catch(e){
            console.log(e);
        }
        return {
            variations,
            quantities,
            user,
            fullName,
            phoneNumber,
            provinceId,
            districtId,
            wardCode,
            prettyAddress,
            address,
            description,
            payment,
            couponCode
        };
    }
}

module.exports = new Order({
    name: 'Orders',
    url: '/orders',
    type: 'orders',
    contentType: Type.types.ORDERS,
    order: 99
});