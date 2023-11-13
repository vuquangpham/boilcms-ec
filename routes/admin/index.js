// dependencies
const router = require('express').Router();

// config
const {REGISTER_URL} = require('./../../core/utils/config.utils');
const {sendEmptyToken} = require("../../core/utils/token.utils");
const {restrictTo} = require("../../core/utils/middleware.utils");

// core modules
const CategoryController = require('../../core/classes/category/category-controller');

const Action = require('../../core/classes/utils/action');

// handle actions
const {getParamsOnRequest} = require("../../core/utils/helper.utils");
const handleGetMethod = require('./GET');
const handlePostMethod = require('./POST');

// handle upload action
const upload = require('../../core/utils/upload.utils');
const {ADMIN_URL} = require("../../core/utils/config.utils");

/**
 * Middleware for authenticate user
 * */
router.all('*', (request, response, next) => {

    // the token doesn't exist
    if(!response.locals.token) return response.redirect(`/${REGISTER_URL}`);

    // do not have permission
    if(!restrictTo(response, 'admin')){
        request.app.set('notification', {
            type: 'error',
            message: `You do not have permission to access the site. Please contact the administrator to get more detail!`
        });

        sendEmptyToken(response);

        return response.redirect(`/${REGISTER_URL}`);
    }

    // call the next middleware
    next();
});

/**
 * Middleware for registering variables
 * */
router.all('*', (request, response, next) => {

    // params, default point to the dashboard page
    const [type] = getParamsOnRequest(request, ['default']);

    // queries
    const action = request.query.action;

    // categories
    response.locals.categories = CategoryController.instances;
    response.locals.categoryItem = CategoryController.getCategoryItem(type);
    response.locals.action = Action.getActionType(action);
    response.locals.params = {type};

    next();
});


/**
 * Dynamic page with file type
 * */
router.all('*', upload.single('image'), (request, response, next) => {
    const method = response.locals.method;
    const categoryItem = response.locals.categoryItem;

    // validate the role or the category item to reach the category
    if(!categoryItem || !restrictTo(response, ...categoryItem.acceptedRoles)) return response.redirect('/' + ADMIN_URL);


    switch(method.name){
        case 'get':{
            handleGetMethod(request, response, next);
            break;
        }
        case 'post':{
            handlePostMethod(request, response, next);
        }
    }
});

module.exports = router;