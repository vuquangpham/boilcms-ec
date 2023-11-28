const Type = require("../classes/utils/type");
const Category = require("../classes/category/category");
const {generateSHA256Token, sendAuthTokenAndCookies} = require("../utils/token.utils");
const {sendForgotPasswordEmail, validateEmail} = require("../utils/email.utils");
const {getProtocolAndDomain} = require("../utils/helper.utils");
const {REGISTER_URL, RESET_PASSWORD_URL} = require("../utils/config.utils");
const Variation = require("../database/product/variation.model");
const ProductCategory = require('./product');

class User extends Category{
    constructor(config){
        super(config);
    }

    /**
     * Validate input user
     * */

    validateInputData(inputData, action = 'add'){
        const request = inputData.request;
        const response = inputData.response;

        // add product to cart
        const userId = request.body.id;
        const productId = request.body['product-id'];
        const variationIndex = request.body['variation-index'];
        const quantity = request.body.quantity;
        const productType = request.body.type;
        const actionType = request.body.actionType || 'add'; // set or add

        // has product id
        if(productId){

            return {
                userId: userId,
                productId: productId,
                variationIndex: variationIndex,
                quantity: quantity,
                productType: productType,
                actionType: actionType,
            };

        }

        // input
        const name = request.body.name;
        const email = request.body.email;
        const currentPassword = request.body.currentPassword;
        const password = request.body.password;
        const confirmPassword = request.body.confirmPassword;
        const role = request.body.role;
        const state = request.body.state;

        const returnObject = {
            name,
            email,
            currentPassword,
            password,
            confirmPassword,
            role,
            state
        };

        if(action === 'edit') returnObject.response = response;

        return returnObject;
    }

    /**
     * Add new user
     * @param data {object}
     * @param request
     * @return {promise}
     * */
    add(data, request){
        const instance = new this.databaseModel(data);

        return new Promise((resolve, reject) => {
            instance.save()
                .then(async result => {
                    await validateEmail(instance, result, request);

                    resolve(result);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    /**
     * Find user by 1 input of user such as: id, email
     * @param id {string}
     * @return {Promise}
     * */
    find(id){
        return new Promise((resolve, reject) => {
            this.databaseModel.findOne({_id: id}).select('+password')
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    /**
     * Sign in user
     * @return {promise}
     * */
    signIn(request){
        const {email, password} = request.body;
        return new Promise(async(resolve, reject) => {
            try{
                const user = await this.databaseModel.findOne({email}).select('+password');

                // user doesn't exist
                if(!user) throw new Error(`Account hasn't been existed yet. You can create the new one with that information!`);

                // comparing the password characters
                const comparePassword = await user.comparePassword(password, user.password);
                if(!comparePassword) throw new Error(`The password is not correct. Please try again!`);

                // found the user
                resolve(user);

            }catch(error){
                reject(error);
            }
        });
    }

    /**
     * Forget password
     * */
    forgetPassword(request){
        const {email} = request.body;

        return new Promise(async(resolve, reject) => {
            try{
                const user = await this.databaseModel.findOne({email});

                // email doesn't exist
                if(!user) throw new Error('Email not found');

                // generate the random reset token and save reset token to data
                const resetToken = user.createPasswordResetToken();
                await user.save({validateBeforeSave: false});

                const resetPasswordURL = getProtocolAndDomain(request) + `${REGISTER_URL}?type=${RESET_PASSWORD_URL}&token=${resetToken}`;
                const expiredURL = getProtocolAndDomain(request) + `${REGISTER_URL}?type=forget-password`;
                sendForgotPasswordEmail({
                    user,
                    resetPasswordURL,
                    expiredURL,
                    request
                }).then(data => {
                    console.log(data);
                });

                resolve(resetToken);

            }catch(error){
                reject(error);

            }
        });
    }

    /**
     * Reset password
     * */
    resetPassword(request, token = ''){
        return new Promise(async(resolve, reject) => {
            try{

                // hash token from query
                const hashedToken = generateSHA256Token(token);

                // check token is valid and dont expired
                const user = await this.databaseModel.findOne({
                    resetPasswordToken: hashedToken,
                    resetPasswordTokenExpired: {$gte: Date.now()}
                });

                // user doesn't exist or reset token has expired
                if(!user) throw new Error(`The reset token has expired. Please check it again!`);

                // check password
                if(request.body.password !== request.body.confirmPassword) throw new Error(`Password don't match`);

                // get new password and confirm password
                user.password = request.body.password;
                user.confirmPassword = request.body.confirmPassword;
                user.resetPasswordToken = undefined;
                user.resetPasswordTokenExpired = undefined;

                await user.save();

                resolve();
            }catch(error){
                reject(error);
            }
        });
    }

    /**
     * Update cart
     * */
    updateCart(data){
        return new Promise(async(resolve, reject) => {

            try{
                // vars
                const userId = data.userId;
                const productId = data.productId;
                const variationIndex = parseInt(data.variationIndex);
                const productType = data.productType;
                const actionType = data.actionType;
                const quantity = parseInt(data.quantity);

                // variation
                let variation = null;

                // get the user
                const user = await this.databaseModel.findById(userId).populate('cart');

                // check if exists => update quantity
                const cartItemIndex = user.cart.findIndex(cartItem => {
                    return cartItem.productId.toString() === productId && cartItem.variationIndex === variationIndex;
                });

                if(cartItemIndex !== -1){
                    variation = user.cart[cartItemIndex];

                    // get the product variation
                    const product = await ProductCategory.getDataById(productId);
                    const isSimpleProduct = productType === 'simple';

                    // get object
                    const jsonText = isSimpleProduct ? product.simpleProductJSON : product.variableProductJSON;
                    const productObject = JSON.parse(jsonText);
                    const productVariation = isSimpleProduct ? productObject : productObject.variations[variationIndex];

                    // not has variation, maybe deleted => remove the order
                    if(!productVariation){
                        // remove the cart item
                        user.cart.splice(cartItemIndex, 1);

                        // save the cart
                        await user.save();

                        // send error message
                        // todo @all
                        return reject(new Error('The variation has been deleted!'));
                    }

                    switch(actionType){
                        case "add":{
                            // set quantity
                            variation.quantity += quantity;

                            // set min quantity
                            variation.quantity = Math.min(variation.quantity, productVariation.inventory);
                            break;
                        }
                        case "set":{
                            // set quantity
                            variation.quantity = quantity;

                            // set min quantity
                            variation.quantity = Math.min(variation.quantity, productVariation.inventory);
                        }
                    }


                }else{
                    // not exists => create new
                    variation = new Variation(data);
                    user.cart.push(variation);
                }

                // update
                const result = await Promise.all([variation.save(), user.save()]);
                resolve();

            }catch(e){
                console.log(e);
                reject(e);
            }

        });
    }

    /**
     * Update user data
     * */
    update(id, data){

        // add product to cart action
        if(data.productId){
            return this.updateCart(data);
        }

        return new Promise(async(resolve, reject) => {
            try{
                // update password
                if(data.password !== undefined){
                    await this.updatePassword(id, data);
                    return resolve(this.getDataById({_id: id}));
                }

                // update user data
                const dataInput = {
                    name: data.name,
                    email: data.email,
                    role: data.role,
                    state: data.state
                };

                this.databaseModel.findOneAndUpdate({_id: id}, dataInput)
                    .then(_ => resolve(this.getDataById({_id: id})))
                    .catch(err => reject(err));

            }catch(err){
                reject(err);
            }
        });
    }

    /**
     * Update password
     * */
    updatePassword(id, data){

        const response = data.response;

        return new Promise(async(resolve, reject) => {
            try{
                // find user
                const user = await this.databaseModel.findById(id).select('+password');

                // compare password in database with password from input
                const comparePassword = await user.comparePassword(data.currentPassword, user.password);
                if(!comparePassword) throw (new Error('The password is not correct'));

                // check password
                if(data.password !== data.confirmPassword) throw new Error(`Password don't match`);

                // save new password
                user.password = data.password;
                user.confirmPassword = data.confirmPassword;

                await user.save();

                // send new token and save in cookies
                sendAuthTokenAndCookies(user, response);

                resolve();
            }catch(error){
                reject(error);
            }
        });
    }

    /**
     * Validate email
     * */
    verifyEmail(token = ''){
        return new Promise(async(resolve, reject) => {

            try{
                // hash token from query
                const hashedToken = generateSHA256Token(token);

                // check token is valid and dont expired
                const user = await this.databaseModel.findOne({
                    verifyEmailToken: hashedToken,
                    verifyEmailTokenExpired: {$gte: Date.now()}
                });

                // token doesn't exist or reset token has expired
                if(!user) throw new Error(`The validate email token has expired. Please check it again!`);

                // update user
                user.verifyEmailToken = undefined;
                user.verifyEmailTokenExpired = undefined;
                user.isEmailValidate = true;

                await user.save({validateBeforeSave: false});

                resolve();
            }catch(error){
                reject(error);
            }
        });
    }

}

module.exports = new User({
    name: 'User',
    url: '/user',
    type: 'user',
    contentType: Type.types.USER,
    children: [
        {
            name: 'Admin',
            url: '?filter=admin'
        }, {
            name: 'User',
            url: '?filter=user'
        }
    ],
});