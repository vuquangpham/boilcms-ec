const Category = require('../classes/category/category');
const Type = require("../classes/utils/type");

const Order = require('./order');

class Default extends Category{
    constructor(config){
        super(config);
    }

    async getAllData(){

        try{
            // get chart data in year 2023
            const ordersInYear = await Order.databaseModel.find({
                publish: {
                    $gte: new Date(new Date().getFullYear(), 0, 1),
                    $lte: new Date()
                }
            });

            // get chart data in month
            const ordersInMonth = await Order.databaseModel.find({
                publish: {
                    $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    $lte: new Date()
                }
            });

            // const pending orders
            const pendingOrders = await Order.databaseModel.find({
                $and: [
                    {
                        status: {
                            $not: {
                                $eq: 'success'
                            }
                        }
                    }, {
                        status: {
                            $not: {
                                $eq: 'failed'
                            }
                        }
                    }
                ]
            });

            return {
                ordersInYear,
                ordersInMonth,
                pendingOrders
            };

        }catch(e){
            console.log(e);

            return {
                ordersInYear: [],
                ordersInMonth: [],
                pendingOrders: []
            };
        }
    }
}

module.exports = new Default({
    name: 'Dashboard',
    url: '/',
    type: 'default',
    contentType: Type.types.DEFAULT,
});