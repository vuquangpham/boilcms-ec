const ComponentController = require("../../../core/classes/component/component-controller");
const Type = require('../../../core/classes/utils/type');

const handleGetAction = require('./get');
const handleAddAction = require('./add');
const handleEditAction = require('./edit');
const handleDeleteAction = require('./delete');

/**
 * Handle POST method
 * @param {Object} request
 * @param {Object} response
 * @param {NextFunction} next
 * @return {void}
 * */
const handlePostMethod = async(request, response, next) => {
    const categoryItem = response.locals.categoryItem;
    const action = response.locals.action;
    const hasJSON = response.locals.getJSON;

    // function for handling action
    let funcForHandlingAction = () => {
    };

    // handle component information
    const component = ComponentController.getComponentBasedOnName(request.body.componentName);

    switch(action.name){
        case 'get':{
            funcForHandlingAction = handleGetAction;
            break;
        }
        case 'add':{
            funcForHandlingAction = handleAddAction;
            break;
        }
        case 'edit':{
            funcForHandlingAction = handleEditAction;
            break;
        }
        case 'delete':{
            funcForHandlingAction = handleDeleteAction;
            break;
        }
    }
    const [promise, extraData] = await funcForHandlingAction(request, response);

    promise
        .then(result => {
            // return JSON
            if(component && hasJSON) return response.status(200).json({content: result, component: component});
            if(hasJSON) return response.status(200).json(result);

            // if post method don't have hasJSON or component, then return URL
            let URL = '';
            switch(action.name){
                case 'add' :{

                    // contact type
                    if(categoryItem.contentType === Type.types.CONTACT){
                        URL = '/' + categoryItem.type;
                        // set notification
                        request.app.set('notification', {
                            message: 'Chúng tôi đã nhận được phản hồi từ bạn. Vui lòng đợi.'
                        });
                        break;
                    }

                    // media type
                    if(categoryItem.contentType === Type.types.MEDIA || categoryItem.contentType === Type.types.USER){
                        URL = categoryItem.url;
                        break;
                    }

                    // order type
                    if(categoryItem.contentType === Type.types.ORDERS){
                        URL = '/account';
                        break;
                    }

                    URL = categoryItem.url + '&' + new URLSearchParams({
                        action: 'edit',
                        method: 'get',
                        id: result._id
                    });
                    break;
                }
                case 'edit':{
                    // return the current URL
                    URL = request.get('referer');
                    break;
                }
                case 'delete':{
                    URL = categoryItem.url + '&' + new URLSearchParams({
                        action: 'get',
                        method: 'get',
                    });
                    break;
                }
                default:{
                    URL = request.params.type;
                }
            }
            response.redirect(URL);
        })
        .catch(err => {
            console.log(err);
            if(hasJSON) return response.status(500).json({errorMessage: err.message});

            next(err);
        });
};

module.exports = handlePostMethod;