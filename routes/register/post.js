const User = require('../../core/categories/user');

// config
const {sendAuthTokenAndCookies} = require("../../core/utils/token.utils");
const {ADMIN_URL, REGISTER_URL} = require("../../core/utils/config.utils");
const {splitUrl} = require("../../core/utils/helper.utils");

const handlePostMethod = (request, response, next) => {
    const type = request.query.type;
    const resetUrlToken = request.query.token;
    const inputData = {request, response};
    let promise;

    switch(type){
        case 'sign-up':{
            const data = User.validateInputData(inputData);
            promise = User.add(data, request);
            break;
        }
        case 'sign-in':{
            promise = User.signIn(request);
            break;
        }
        case 'forget-password':{
            promise = User.forgetPassword(request);
            break;
        }
        case 'reset-password':{
            promise = User.resetPassword(request, resetUrlToken);
            break;
        }
        case 'verify': {
            promise = User.verifyEmail(resetUrlToken);
            break;
        }
    }

    promise
        .then(result => {
            // vars
            let redirectURL = '';

            switch(type){
                // redirect to sign-in page
                case "sign-in":{
                    // send token to client and save token in cookies
                    sendAuthTokenAndCookies(result, response);

                    // redirect
                    redirectURL = ADMIN_URL;
                    break;
                }

                // redirect to register page
                case "forget-password":{
                    // set notification
                    request.app.set('notification', {
                        type: 'success',
                        message: 'Please check your mail box to get the reset password URL!'
                    });
                    redirectURL = REGISTER_URL;
                    break;
                }
                case "sign-up":{
                    // set notification
                    request.app.set('notification', {
                        type: 'success',
                        message: 'Please check your mail box to get the verify email!'
                    });
                    redirectURL = REGISTER_URL;
                    break;
                }
                case "reset-password":{
                    redirectURL = REGISTER_URL;
                    break;
                }
                case "verify": {
                    // set notification
                    request.app.set('notification', {
                        type: 'success',
                        message: 'You have successfully verify email address. You can log in now!'
                    });
                    redirectURL = REGISTER_URL;
                    break;
                }
            }

            // redirect URL
            response.redirect(redirectURL);
        })
        .catch(err => {
            // set error message
            request.app.set('notification', {
                type: 'error',
                message: err.message
            });

            // vars
            let redirectURL = '';

            switch(type){
                case "sign-in":{
                    redirectURL = REGISTER_URL;
                    break;
                }

                case "sign-up":
                case "forget-password":{
                    redirectURL = splitUrl(request.originalUrl, 0, 1, '&');
                    break;
                }

                case"reset-password":{
                    redirectURL = splitUrl(request.originalUrl, 0, 2, '&');
                    break;
                }

                case "verify":{
                    // TODO when verify email, then verify email token has expired, if user logged-in redirect to account page(FE) to resend, else if user didn't log in redirect to register, (check token here to consider user had logged in before)

                    // set notification
                    request.app.set('notification', {
                        type: 'error',
                        message: 'Unfortunately, your verify email token is expired. Please try again!'
                    });
                    redirectURL = REGISTER_URL;
                    break;
                }

            }

            // redirect URL
            response.redirect(redirectURL);
        });
};

module.exports = handlePostMethod;