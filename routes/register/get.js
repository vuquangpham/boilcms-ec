// dependencies
const path = require("path");

// config
const {ADMIN_URL, REGISTER_URL} = require("../../core/utils/config.utils");
const {sendEmptyToken} = require("../../core/utils/token.utils");
const {capitalizeString} = require("../../core/utils/helper.utils");

const Content = require("../../core/classes/utils/content");
const AccountType = require('../../core/classes/utils/account-type');

const handleGetMethod = (request, response, next) => {
    // vars
    const type = response.locals.accountType.name;
    const token = response.locals.token;
    const resetUrlToken = request.query.token;

    // check if user logged and user want to log-out
    const logOutAction = AccountType.getActionType('log-out');
    if(token && type === logOutAction.name){
        sendEmptyToken(response);
        return response.redirect(`/${REGISTER_URL}`);
    }

    // when user logged, can not redirect to register
    else if(token) return response.redirect(`/${ADMIN_URL}`);

    // capitalize pageTitle
    const pageTitle = capitalizeString(type, '-');

    // error message
    const notification = request.app.get('notification');

    // clear the notification after showing
    if(notification) request.app.set('notification', undefined);

    // render html
    const directory = path.join(process.cwd(), 'views', 'register', 'type', `${type}` + '.ejs');
    Content.getHTML((directory), {type: type, resetUrlToken: resetUrlToken})
        .then(html => {
            response.render('register/index', {
                content: html,
                title: pageTitle,
                notification: notification
            });
        })
        .catch(err => {
            next(err);
        });

};

module.exports = handleGetMethod;