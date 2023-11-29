const AccountType = require('../classes/utils/account-type');
const Method = require('../classes/utils/method');
const jwt = require("jsonwebtoken");
const User = require('../categories/user');
const {ADMIN_URL, REGISTER_URL, ROLES, ROLES_IN_ARRAY} = require("./config.utils");

/**
 * middleware for all routing
 * */
const globalMiddleware = (request, response, next) => {
    // project name
    response.locals.projectName = 'BoilCMS';

    // queries
    const method = request.query.method;
    const getJSON = request.query.getJSON;
    const accountType = request.query.type;

    // get token
    const token = request.cookies.jwt;

    // assign variables to locals
    response.locals.method = Method.getValidatedMethod(method);
    response.locals.getJSON = getJSON;
    response.locals.token = token;

    // roles
    response.locals.roles = ROLES;
    response.locals.rolesInArray = ROLES_IN_ARRAY;

    // path
    response.locals.adminPath = ADMIN_URL;
    response.locals.registerPath = REGISTER_URL;

    // get account type
    response.locals.accountType = AccountType.getActionType(accountType);

    next();
};

/**
 * Check user authentication
 * */
const authenticateUser = (request, response, next) => {
    let token = request.cookies.jwt;

    // Check token exists
    if(!token){
        response.locals.user = undefined;
        return next();
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if(err){
            console.error(err);
            return next(err);
        }
        User.getDataById({_id: decoded.id})
            .then(currentUser => {
                if(!currentUser || currentUser.hasAlreadyChangedPassword(decoded.iat)){
                    response.locals.user = undefined;
                }else{
                    response.locals.user = currentUser;
                }
                next();
            })
            .catch(err => {
                response.locals.user = undefined;
                next();

            });
    });
};

/**
 * Restrict user access based on their roles and their state
 * @param response
 * @param roles {Array | String} - An array of role allowed to access
 * @return {Boolean} - True if the user has permission, False if not.
 * */
const restrictTo = (response, ...roles) => {
    const user = response.locals.user;

    // use doesn't exist
    if(!user) return false;

    // user state is not active
    if(user.state !== 'active') return false;

    // valid roles
    return !!roles.find(r => r === user.role);
};

module.exports = {
    globalMiddleware, authenticateUser, restrictTo
};