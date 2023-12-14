// dependencies
const router = require('express').Router();

// config
const {REGISTER_URL} = require('./../../core/utils/config.utils');
const {sendEmptyToken} = require("../../core/utils/token.utils");
const {restrictTo} = require("../../core/utils/middleware.utils");

// core modules
const CategoryController = require('../../core/classes/category/category-controller');

const Action = require('../../core/classes/utils/action');
const Method = require('../../core/classes/utils/method');
const Types = require('../../core/classes/utils/type');

// handle actions
const {getParamsOnRequest} = require("../../core/utils/helper.utils");
const handleGetMethod = require('./GET');
const handlePostMethod = require('./POST');

// handle upload action
const upload = require('../../core/utils/upload.utils');
const {ADMIN_URL, ROLES} = require("../../core/utils/config.utils");

/**
 * Middleware for authenticate user
 * */
router.all('*', (request, response, next) => {
    // params, default point to the dashboard page
    const [type] = getParamsOnRequest(request, ['default']);
    const categoryItem = CategoryController.getCategoryItem(type);
    const hasJSON = response.locals.getJSON;
    const method = response.locals.method;

    // queries
    const action = request.query.action;

    // assign to response
    response.locals.categoryItem = categoryItem;
    response.locals.action = Action.getActionType(action);
    response.locals.params = {type};

    // category item doesn't exist
    if(!categoryItem){

        // error
        if(hasJSON) return response.json(500);

        // return to the default category
        return response.redirect('/' + ADMIN_URL);
    }

    // category that support permission without login
    if(categoryItem.sendRequestWithoutLogin && method === Method.methods.POST) return next();

    // not have token
    if(!response.locals.token) return response.redirect('/' + REGISTER_URL);

    // have token but account admin have been deleted
    if(response.locals.token && !response.locals.user) {
        sendEmptyToken(response);
        return response.redirect(`/${REGISTER_URL}`);
    }

    // check roles, role = user => redirect to admin
    // todo @vupham fix here now, @vupham you fix it too slow
    const user = response.locals.user;

    // order type, exception
    if(user.role === ROLES.USER.name && method === Method.methods.GET && categoryItem.contentType === Types.types.ORDERS) return next();

    // not order type
    if(user.role === ROLES.USER.name && method === Method.methods.GET) return response.redirect('/');

    // do not have permission
    if(!restrictTo(response, ...categoryItem.acceptedRoles)){

        // find the category item that has permission
        const categoryHasPermission = CategoryController.instances.find(c => restrictTo(response, ...c.acceptedRoles));
        if(categoryHasPermission){
            return response.redirect(categoryHasPermission.url);
        }

        // no category
        request.app.set('notification', {
            type: 'error',
            message: `You do not have permission to access the site. Please contact the administrator to get more detail!`
        });

        // clear the token
        sendEmptyToken(response);
        return response.redirect(`/${REGISTER_URL}`);
    }

    // call the next middleware with permission
    next();
});


/**
 * Dynamic page with file type
 * */
router.all('*', upload.single('image'), (request, response, next) => {
    const method = response.locals.method;

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