const ProductsCategory = require('../../core/categories/product');
const Media = require('../../core/categories/media');
const {stringToSlug} = require("../../core/utils/helper.utils");

const getPreviewProduct = async(product) => {
    const name = product.name;
    const description = product.description;
    const url = product.url;
    const categoryImage = await Media.getDataById(product.categoryImage);

    // type
    const type = product.type;
    const productObject = type === 'simple' ? JSON.parse(product.simpleProductJSON) : JSON.parse(product.variableProductJSON);

    // return object
    const returnObject = {
        name,
        description,
        url,
        categoryImage,
    };

    // get price
    switch(type){
        case "simple":{
            // vars
            const price = productObject.price;
            const salePrice = productObject.salePrice;

            // save to the return object
            returnObject.price = price;
            returnObject.salePrice = salePrice;

            break;
        }

        case "variable":{
            const attributes = productObject.attributes;
            const variations = productObject.variations;

            // get the first variation that has inventory
            const variation = variations.find(v => v.inventory > 0);

            // vars
            const price = variation.price;
            const salePrice = variation.salePrice;

            // save to the return object
            returnObject.price = price;
            returnObject.salePrice = salePrice;
            returnObject.selectedAttributes = variation.selectedAttributes;
            returnObject.attributes = attributes;
            break;
        }

        default:{
        }
    }

    return returnObject;
};

const getAllData = () => {
    return new Promise((resolve, reject) => {

        ProductsCategory.getAllData()
            .then(data => {
                const result = data.map(getPreviewProduct);
                resolve(Promise.all(result));
            })
            .catch(err => {
                console.log(err);
                resolve([]);
            });

    });
};

const getProductDetail = async(product) => {
    // category image
    const categoryImage = await Media.getDataById(product.categoryImage);

    // type
    const type = product.type;
    const productObject = type === 'simple' ? JSON.parse(product.simpleProductJSON) : JSON.parse(product.variableProductJSON);

    // return object
    const returnObject = {
        id: product._id,
        name: product.name,
        description: product.description,
        url: product.url,
        categoryImage,
        type,
    };

    // get price
    switch(type){
        case "simple":{
            const returnObj = {};

            // vars
            const inventory = productObject.inventory;
            const price = productObject.price;
            const salePrice = productObject.salePrice;

            const imagesId = productObject.imagesId;
            const imagesPromises = imagesId.map(id => Media.getDataById(id));
            const images = await Promise.all(imagesPromises);

            // save to the return object
            returnObj.inventory = inventory;
            returnObj.price = price;
            returnObj.salePrice = salePrice;
            returnObj.images = images;

            // assign to return object
            returnObject.products = [returnObj];
            break;
        }

        case "variable":{
            // vars
            const attributes = productObject.attributes;
            const variations = productObject.variations;

            returnObject.availableVariations = [];

            // loop through the variations
            const productPromises = variations.map(async variation => {
                const returnObj = {};

                // vars
                const inventory = variation.inventory;
                const price = variation.price;
                const salePrice = variation.salePrice;

                const imagesId = variation.imagesId;
                const imagesPromises = imagesId.map(id => Media.getDataById(id));
                const images = await Promise.all(imagesPromises);

                // save to the return object
                returnObj.inventory = inventory;
                returnObj.price = price;
                returnObj.salePrice = salePrice;

                returnObj.selectedAttributes = variation.selectedAttributes;
                returnObj.images = images;

                returnObject.availableVariations.push(variation.selectedAttributes);

                return returnObj;
            });

            // assign to return object
            returnObject.products = await Promise.all(productPromises);
            returnObject.attributes = attributes;

            break;
        }
    }

    try{
        // related products
        const rawRelatedProducts = await ProductsCategory.databaseModel.find({
            categories: product.categories,
            _id: {
                $not: {
                    $eq: product._id
                }
            }
        });
        returnObject.relatedProducts = await Promise.all(rawRelatedProducts.map(getPreviewProduct));
    }catch(e){
        console.log(e);
        returnObject.relatedProducts = [];
    }

    return returnObject;
};

module.exports = {
    getAllData,
    getProductDetail
};