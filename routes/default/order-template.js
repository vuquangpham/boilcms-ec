const Media = require('../../core/categories/media');
const Variation = require("../../core/database/product/variation.model");
const {getProductViaVariation} = require("../../core/utils/helper.utils");

const getOrderData = async(data) => {
    try{
        const variationPromises = data.map(async vId => {
            return Variation.findById(vId);
        });

        // get variations
        const variations = await Promise.all(variationPromises);
        const productsPromises = variations.map(v => {
            return getProductViaVariation(v);
        });
        const products = await Promise.all(productsPromises);

        const returnedData = variations.map(async(variation, index) => {
            const [product, productVariation] = products[index];

            // image
            const categoryImage = await Media.getDataById(product.categoryImage);

            return {
                // variation data
                variationId: variation._id.toString(),
                productId: variation.productId,
                productType: variation.productType,
                variationIndex: variation.variationIndex,
                quantity: variation.quantity,

                // product data
                name: product.name,
                price: productVariation.price,
                salePrice: productVariation.salePrice,
                selectedAttributes: productVariation.selectedAttributes ?? [],
                categoryImage: categoryImage
            };
        });

        return await Promise.all(returnedData);
    }catch(e){
        return e;
    }
};

module.exports = {getOrderData};