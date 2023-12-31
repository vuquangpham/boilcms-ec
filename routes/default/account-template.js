const Orders = require('../../core/categories/order');
const MediaCategory = require('../../core/categories/media');
const {getProductViaVariation} = require("../../core/utils/helper.utils");

const getAccountData = async(user) => {

    try{
        // variations in order data
        const orders = await Orders.databaseModel.find({user: user});

        // get orders
        const orderPromises = orders.map(async(order, index) => {
            const variationPromises = order.variations.map(async v => {
                // get product
                const [product, productVariation] = await getProductViaVariation(v);

                // get image
                const image = await MediaCategory.getDataById(product.categoryImage);

                // add name for product
                return {
                    ...v,
                    image,
                    productName: product.name,
                };
            });

            order.variations = await Promise.all(variationPromises);

            return order;
        });
        const ordersData = await Promise.all(orderPromises);

        return {
            orders: ordersData,
            user
        };

    }catch(e){
        console.log(e);
    }
};

module.exports = {getAccountData};