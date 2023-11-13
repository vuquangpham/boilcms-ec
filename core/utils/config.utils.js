const path = require('path');

// URL
const ADMIN_URL = 'boiler-admin';
const REGISTER_URL = 'register';
const RESET_PASSWORD_URL = 'reset-password';
const VERIFY_EMAIL_URL = 'verify'

// directory
const CORE_DIRECTORY = path.join(process.cwd(), 'core');
const PUBLIC_DIRECTORY = path.join(process.cwd(), 'public');
const CUSTOM_TEMPLATES_DIRECTORY = path.join(process.cwd(), 'views', 'default', 'templates');

module.exports = {
    ADMIN_URL, REGISTER_URL, RESET_PASSWORD_URL, VERIFY_EMAIL_URL, CORE_DIRECTORY, PUBLIC_DIRECTORY, CUSTOM_TEMPLATES_DIRECTORY
};