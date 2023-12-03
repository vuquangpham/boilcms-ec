const Orders = require('../../core/categories/order');
const MediaCategory = require('../../core/categories/media');
const {getProductViaVariation} = require("../../core/utils/helper.utils");

const getAccountData = async(user) => {

    try{
        // variations in order data
        const orders = await Orders.databaseModel.find({user: user}).populate('variations');

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

            const variations = await Promise.all(variationPromises);
            order.variations = variations;
            console.log('variatiomns', variations);

            return order;
        });
        const ordersData = await Promise.all(orderPromises);

        return {
            orders: ordersData
        };
        // user information

    }catch(e){
        console.log(e);
    }
};

module.exports = {getAccountData};