const ProductsCategory = require('../../core/categories/product');
const Media = require('../../core/categories/media');
const {stringToSlug} = require("../../core/utils/helper.utils");

const getAllData = () => {
    return new Promise((resolve, reject) => {

        ProductsCategory.getAllData()
            .then(data => {

                const result = data.map(async result => {
                    const name = result.name;
                    const description = result.description;
                    const url = result.url;
                    const categoryImage = await Media.getDataById(result.categoryImage);

                    // type
                    const type = result.type;
                    const productObject = type === 'simple' ? JSON.parse(result.simpleProductJSON) : JSON.parse(result.variableProductJSON);

                    // return object
                    const returnObject = {
                        name,
                        description,
                        url,
                        categoryImage,
                        nameSlug: stringToSlug(name)
                    };

                    // get price
                    switch(type){
                        case "simple":{
                            // vars
                            const price = productObject.price;
                            const salePrice = productObject.salePrice;
                            //
                            // const imagesId = productObject.imagesId;
                            // const imagesPromises = imagesId.map(id => Media.getDataById(id));
                            // const images = await Promise.all(imagesPromises);

                            // save to the return object
                            returnObject.price = price;
                            returnObject.salePrice = salePrice;
                            // returnObject.images = images;

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
                });

                resolve(Promise.all(result));
            })
            .catch(err => {
                console.log(err);
                resolve([]);
            });

    });
};

module.exports = {
    getAllData
};