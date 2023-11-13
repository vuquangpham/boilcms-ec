const errorHandler = (error, req, res) => {
    console.log(error);
    // Error handling middleware functionality
    res.render('404', {
        title: '404 Not Found'
    });
};

module.exports = errorHandler;