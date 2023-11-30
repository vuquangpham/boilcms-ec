const errorHandler = (error, request, response, next) => {
    console.log(error);

    // Error handling middleware functionality
    response.render('error', {
        title: '404 Not Found'
    });
};

module.exports = errorHandler;