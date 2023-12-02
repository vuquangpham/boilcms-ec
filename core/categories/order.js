const Category = require('../classes/category/category');
const Type = require('../classes/utils/type');
const Variation = require('../database/product/variation.model');
const {getProductViaVariation} = require("../utils/helper.utils");

class Order extends Category{
    constructor(config){
        super(config);
    }

    add(data){
        console.log('add', data);
        const variations = data.variations;
        const quantities = data.quantities;
        const user = data.user;

        return undefined;

        return new Promise(async(resolve, reject) => {

            // user doesn't exist
            if(!user){
                return reject(new Error(`The user doesn't exist!`));
            }

            try{
                const variationPromises = variations.map(async(id, index) => {

                    // get product based on variation
                    const variation = await Variation.findById(id);
                    const quantity = quantities[index];
                    const [_, productVariation] = await getProductViaVariation(variation);

                    // cart in user
                    const cart = user.cart;
                    const variationIndex = user.cart.find(c => c.toString() === id);

                    // product variation doesn't exist
                    if(!productVariation){
                        // update cart
                        cart.splice(variationIndex, 1);

                        // save cart
                        await user.save();

                        // reject
                        throw new Error(`The product in cart item has been deleted!`);
                    }

                    // valid quantity
                    const availableQuantity = productVariation.inventory;
                    const validatedQuantity = Math.min(availableQuantity, quantity);

                    // update variation
                    const variationUpdatePromise = Variation.findOneAndUpdate({_id: id}, {quantity: validatedQuantity});

                    // remove from the cart of user
                    // cart.splice(variationIndex, 1);

                    // save cart
                    const saveUserPromise = user.save();

                    // update the new information
                    await Promise.all([variationUpdatePromise, saveUserPromise]);

                    // return new variation after updated
                    return Variation.findById(id);
                });

                const newVariations = await Promise.all(variationPromises);

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