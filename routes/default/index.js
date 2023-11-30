const router = require('express').Router();
const CategoryController = require('../../core/classes/category/category-controller');

// classes
const Content = require('../../core/classes/utils/content');
const Type = require('../../core/classes/utils/type');

// utils
const {restrictTo} = require("../../core/utils/middleware.utils");
const {getParamsOnRequest} = require("../../core/utils/helper.utils");

// purify the DOM
const DOMPurify = require('isomorphic-dompurify');

// custom template
const ProductsTemplate = require('./products-template');
const CartTemplate = require('./cart-template');
const OrderTemplate = require('./order-template');
const {ADMIN_URL, REGISTER_URL} = require("../../core/utils/config.utils");

router.get('*', (request, response, next) => {
    const [type, pageURL] = getParamsOnRequest(request, ['', '']);

    // static folder => skip the middleware
    if(type === "upload" || type.includes("favicon")) return;

    response.locals.params = {type, pageURL};
    next();
});

router.get('*', (request, response, next) => {
    let {type, pageURL} = response.locals.params;

    let subPageId = '';
    let categoryItem = null;

    // special page type (without "pages" in ex /pages/home)
    if(!pageURL){
        categoryItem = CategoryController.getSpecialCategoryItem();
        pageURL = type;
    }else{
        categoryItem = CategoryController.getCategoryItem(type);
    }

    // filter condition
    let filterCondition = {
        url: pageURL
    };

    // promise
    const promise = !categoryItem
        // categoryItem doesn't exist
        ? Promise.reject(new Error('Can not find a category item!'))

        // get the content
        : categoryItem.databaseModel.findOne(filterCondition);

    // add populate method
    const hasPageBuilderContent = categoryItem && promise && categoryItem.contentType === Type.types.POSTS;
    if(hasPageBuilderContent) promise.populate('content');

    // solve promise
    promise
        .then(async(result) => {
            /**
             * Page doesn't exist
             * */
            if(!result) return Promise.reject('Can not find!');

            /**
             * Page is private
             * Restrict role if post/page visibility is private
             * */
            if(result.visibility === 'private' && !restrictTo(response, 'admin')){
                return Promise.reject(`You do not have permission to access the private page!`);
            }

            // page title
            const title = pageURL ? pageURL[0].toUpperCase() + pageURL.slice(1) : 'Home';

            /**
             * Page with custom template in default category (Home, About, (Products/Account - Custom template))
             * */
            if(categoryItem.templates && categoryItem.isCustomTemplate(result.template)){
                // account template and not has user logged in => redirect 404
                if(result.template === 'account' && !response.locals.user) return Promise.reject('404 page ne');

                // products template
                if(result.template === 'products') result.products = await ProductsTemplate.getAllData();

                // cart page but not login
                if(result.template === 'cart' && !response.locals.user) return response.redirect('/' + REGISTER_URL);

                // cart page
                if(result.template === 'cart') result.cart = await CartTemplate.getCartData(response.locals.user);

                // order page
                if(result.template === 'order'){
                    try{
                        const data = JSON.parse(request.query.data);

                        // not has user
                        if(!response.locals.user) throw new Error(`You have to login to create an order!`);

                        result.orderData = await OrderTemplate.getOrderData(data);
                        console.log(result.orderData);
                    }catch(e){
                        throw e;
                    }
                }

                // render to frontend
                return response.render('default/templates/' + result.template, {
                    data: result,
                    title,
                });
            }

            /**
             * Page with page-builder content
             * */
            if(hasPageBuilderContent){
                const pageBuilderContent = result.content.content ? JSON.parse(result.content.content) : '';
                const html = await Content.getRenderHTML(pageBuilderContent);

                // render to frontend
                return response.render('default', {
                    data: result,
                    content: DOMPurify.sanitize(html),
                    title,
                });
            }

            /**
             * Page without page builder => custom html
             * */

            // check product type
            if(categoryItem.contentType === Type.types.PRODUCTS) result = await ProductsTemplate.getProductDetail(result);

            // render to frontend
            response.render('default/pages/' + categoryItem.type, {
                data: result,
                title,
                categoryItem,
                adminPath: ADMIN_URL
            });

        })
        .catch(err => {
            next(err);
        });
});

module.exports = router;