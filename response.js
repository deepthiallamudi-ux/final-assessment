const sendResponse = (res, statusCode, msg, data) => {
    return res.status(statusCode).json({
        success: true,  
        message: msg,
        data: data
    });
};

const sendErrorResponse = (res, statusCode, msg) => {
    return res.status(statusCode).json({
        success: false,
        message: msg
    });
};

module.exports = {sendResponse, sendErrorResponse};