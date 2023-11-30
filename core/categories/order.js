const Category = require('../classes/category/category');
const Variation = require('../database/product/variation.model');
const Type = require('../classes/utils/type');
const {getProductViaVariation} = require("../utils/helper.utils");

const UserCategory = require('../categories/user');
const {response} = require("express");

class Order extends Category{
    constructor(config){
        super(config);
    }

    add(data){
        console.log('add', data);
        const variations = data.variations;
        const quantities = data.quantities;
        const user = data.user;

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

    validateInputData(inputData){
        const request = inputData.request;
        const response = inputData.response;

        // vars
        const variations = typeof request.body.variation === 'string' ? [request.body.variation] : request.body.variation;
        const quantities = typeof request.body.quantity === 'string' ? [request.body.quantity] : request.body.quantity.slice(0, variations.length);
        const user = response.locals.user;

        return {
            variations,
            quantities,
            user
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