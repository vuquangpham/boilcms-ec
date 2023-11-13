const jwt = require("jsonwebtoken");
const crypto = require("crypto");

/**
 * Create JWT token
 * @param id {string}
 * @return {Object}
 * */
const signToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRED_IN
    });
};

/**
 * Sign JWT token for user, save token in cookie
 * @param user {object}
 * @param res
 * */
const sendAuthTokenAndCookies = (user, res) => {
    let token = signToken(user._id);

    const cookiesOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    res.cookie('jwt', token, cookiesOptions);
};

/**
 * Sending an empty token has a short lifespan of a few seconds when it is issued for authentication
 * @param res
 * */
const sendEmptyToken = (res) => {
    res.cookie('jwt', '', {
        maxAge: 5 * 1000,
        httpOnly: true
    });
};


/**
 * Generate sha-256 token
 * @param token {String}
 * @return {String}
 * */
const generateSHA256Token = (token = "") => crypto.createHash('sha256').update(token).digest('hex');

module.exports = {
    signToken, sendAuthTokenAndCookies, sendEmptyToken, generateSHA256Token
};