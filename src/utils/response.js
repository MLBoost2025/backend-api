exports.successResponse = (res, data, message = 'Success', statusCode = 200) => {
    res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

exports.errorResponse = (res, message = 'Server Error', statusCode = 500, error = null) => {
    const response = {
        success: false,
        message
    };
    if (error && process.env.NODE_ENV !== 'production') {
        response.error = error;
    }
    res.status(statusCode).json(response);
};
