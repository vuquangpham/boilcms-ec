const Variation = require('../../core/database/product/variation.model');
const ProductCategory = require('../../core/categories/product');
const Media = require("../../core/categories/media");

const getCartData = async(user) => {
    const cartIds = user.cart || [];

    // empty cart
    if(cartIds.length === 0) return [];

    const promises = cartIds.map(async id => Variation.findById(id.toString()));

    try{
        const cart = await Promise.all(promises);

        const cartPromises = cart.map(async(cartItem, index) => {
            const productId = cartItem.productId;
            const productType = cartItem.productType;
            const variationIndex = cartItem.variationIndex;
            const product = await ProductCategory.getDataById(productId);
            const isSimpleProduct = productType === 'simple';

            // get object
            const jsonText = isSimpleProduct ? product.simpleProductJSON : product.variableProductJSON;
            const productObject = JSON.parse(jsonText);
            const productVariation = isSimpleProduct ? productObject : productObject.variations[variationIndex];

            // not has variation, maybe deleted => remove the order
            if(!productVariation){
                // remove the cart item
                user.cart.splice(index, 1);

                // save the cart
                await user.save();

                return null;
            }

            // get category image URL
            const imageId = product.categoryImage;
            const image = await Media.getDataById(imageId);

            return {
                id: cartItem._id.toString(),
                productId: productId,
                productType,

                quantity: cartItem.quantity,
                variationQuantity: productVariation.inventory,
                variationIndex: variationIndex,

                url: '/' + ProductCategory.type + '/' + product.url,
                name: product.name,
                price: productVariation.price,
                salePrice: productVariation.salePrice,
                categoryImage: image,
                selectedAttributes: isSimpleProduct ? [] : productVariation.selectedAttributes
            };
        });

        return await Promise.all(cartPromises);
    }catch(e){
        return [];
    }
};

module.exports = {getCartData};