const path = require('path');

// URL
const ADMIN_URL = 'boiler-admin';
const REGISTER_URL = 'register';
const RESET_PASSWORD_URL = 'reset-password';
const VERIFY_EMAIL_URL = 'verify';

// roles
const ROLES = {
    ADMIN: {
        name: 'Admin'
    },
    USER: {
        name: 'User'
    },
    EDITOR: {
        name: 'Editor'
    }
};
const ROLES_IN_ARRAY = Object.keys(ROLES).map(r => r.toLowerCase());

// directory
const CORE_DIRECTORY = path.join(process.cwd(), 'core');
const PUBLIC_DIRECTORY = path.join(process.cwd(), 'public');
const CUSTOM_TEMPLATES_DIRECTORY = path.join(process.cwd(), 'views', 'default', 'templates');

module.exports = {
    // urls
    ADMIN_URL, REGISTER_URL, RESET_PASSWORD_URL, VERIFY_EMAIL_URL,

    // directory
    CORE_DIRECTORY, PUBLIC_DIRECTORY, CUSTOM_TEMPLATES_DIRECTORY,

    // roles
    ROLES,
    ROLES_IN_ARRAY
};