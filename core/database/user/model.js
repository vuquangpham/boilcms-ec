const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const {generateSHA256Token} = require("../../utils/token.utils");
const {modifyDate} = require("../../utils/helper.utils");
const User = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        validate: {
            validator: value => value.length > 3,
            message: 'Name must to be a minimum 3 character'
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail]
    },

    // password
    password: {
        type: String,
        required: true,
        // Hide password from getting user
        select: false,
        validate: {
            validator: value => {
                const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)[0-9a-zA-Z\W]{8,}$/;
                return passwordRegex.test(value);
            },
            message: 'The password must be a minimum of 8 characters and include at least 1 lowercase letter, 1 uppercase letter, 1 digit, and 1 special character'
        }
    },
    confirmPassword: {
        type: String,
        required: function (){
            return this.isModified('password')
        },
        validate: {
            // this is only work on create and save
            validator: function(el){
                return el === this.password;
            },
        }
    },

    // date time
    changePasswordAt: Date,
    registerAt: {
        default: () => Date.now(),
        type: Date
    },

    registerAtFormatted: {
        type: String,
    },

    // for resetting password
    resetPasswordToken: {
        type: String,
        select: false
    },
    resetPasswordTokenExpired: Date,

    // for verify email
    verifyEmailToken: {
        type: String,
        select: false
    },

    verifyEmailTokenExpired: Date,

    // user role
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },

    // user state
    state: {
        type: String,
        enum: ['active', 'suspend'],
        default: 'active'
    },
    isEmailValidate: {
        type: Boolean,
        default: false
    },

    // cart
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Variation',
    }]
});

// validate input between two processes adding from form and saving to database
User.pre('save', async function(next){

    // formatted date
    this.registerAtFormatted = modifyDate(this.registerAt);

    // if password don't modify, go next middleware
    if(!this.isModified('password')) return next();

    // Hash password with const is 12
    this.password = await bcrypt.hash(this.password, 12);

    // Remove confirm password to save in database
    this.confirmPassword = undefined;

    this.changePasswordAt = Date.now() - 1000;
    next();
});

/**
 * Compare password hashed in database and password from request
 * */
User.methods.comparePassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
};

/**
 * Check if the password changed after the token generated
 * @param JWTTimeStamp {Number}
 * @return boolean
 * */
User.methods.hasAlreadyChangedPassword = function(JWTTimeStamp){
    if(this.changePasswordAt){

        // JWTTimeStamp is the time when the token was created, and passwordChangedTime is the time when the password was last updated
        const passwordChangedTime = parseInt(this.changePasswordAt.getTime() / 1000, 10);
        return JWTTimeStamp < passwordChangedTime;
    }
    return false;
};

/**
 *
 * */
User.methods.createPasswordResetToken = function(){
    // create reset token
    const token = crypto.randomBytes(32).toString('hex');

    // hash reset token and save in database
    this.resetPasswordToken = generateSHA256Token(token);

    // create resetPasswordTokenExpired 10 minutes
    this.resetPasswordTokenExpired = Date.now() + 10 * 60 * 1000;

    return token;
};

User.methods.createVerifyEmailToken = function(){
    // create reset token
    const token = crypto.randomBytes(32).toString('hex');

    // hash reset token and save in database
    this.verifyEmailToken = generateSHA256Token(token);

    // create verifyEmailTokenExpired in 10 minutes
    this.verifyEmailTokenExpired = Date.now() + 10 * 60 * 1000;

    return token;

};

module.exports = User;