const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const {getProtocolAndDomain} = require('./helper.utils');
const {REGISTER_URL} = require("./config.utils");

// Configure mailgen by setting a theme and your product info
const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        // Appears in header & footer of e-mails
        name: 'BoilCMS',
        link: 'https://github.com/vuquangpham',
        // Optional product logo
        logo: 'https://avatars.githubusercontent.com/u/30406982?v=4'
    }
});


/**
 * Mail transporter for sending email with nodemailer
 * */
const mailTransporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
    },
});


/**
 * Default mail information
 * */
const defaultInformation = {
    from: process.env.EMAIL_ADDRESS,
    to: '',
    subject: 'BoilCMS Subject',
    text: ''
};


/**
 * Sending email
 * @param information {Object}
 * @return {Promise}
 * */
const sendEmail = (information) => {
    const validateInformation = {...defaultInformation, ...information};
    return mailTransporter.sendMail(validateInformation);
};


/**
 * Send forgot password mail
 * @param information {Object}
 * @return {Promise}
 * */
const sendForgotPasswordEmail = (information) => {
    const userName = information.user.name;
    const resetPasswordURL = information.resetPasswordURL;
    const expiredURL = information.expiredURL;
    const email = {
        body: {
            name: userName,
            intro: 'We heard that you lost your password. Sorry about that!\n',
            action: {
                instructions: 'But don’t worry! You can use the following button to reset your password:',
                button: {
                    color: '#22bc66', // Optional action button color
                    text: 'Reset your password',
                    link: resetPasswordURL
                }
            },
            outro: 'If you don’t use this link within 10 minutes, it will expire. To get a new password reset link, visit: ' + expiredURL
        }
    };

    const content = mailGenerator.generate(email);
    return sendEmail({
        to: information.user.email,
        subject: '[BoilCMS] Reset your password',
        html: content
    });
};


/**
 * Send validate email address
 * @param information {Object}
 * @return {Promise}
 * */
const sendValidateEmail = (information) => {
    const userName = information.user.name;
    const confirmationEmailURL = information.confirmationEmailURL;
    const email = {
        body: {
            name: userName,
            intro: 'Welcome to our site. This is just a quick email to say that we\'ve received your account information.\n',
            action: {
                instructions: 'You have 10 minutes to confirm your email address by clicking the button below',
                button: {
                    color: '#22bc66', // Optional action button color
                    text: 'Confirm your email',
                    link: confirmationEmailURL
                }
            },
            outro: 'If you don’t use this link within 10 minutes, it will expire. To get a new confirmation link, please visit the account settings!'
        }
    };

    const content = mailGenerator.generate(email);
    return sendEmail({
        to: information.user.email,
        subject: '[BoilCMS] Confirm your email',
        html: content
    });
};

module.exports = {sendEmail, sendForgotPasswordEmail, sendValidateEmail};