const mongoose = require("mongoose");

/**
 * Connect to the database
 * @return {Promise}
 * */
const connectDatabase = () => {
    const dbURL = process.env.DB_URI
        .replace('<username>', process.env.DB_USERNAME)
        .replace('<password>', process.env.DB_PASSWORD)
        .replace('<dbname>', process.env.DB_NAME);

    return new Promise((resolve, reject) => {
        mongoose
            .connect(dbURL)
            .then(response => {
                resolve(response);
            })
            .catch(err => {
                reject(err);
            });
    });
};

module.exports = {
    connectDatabase
};