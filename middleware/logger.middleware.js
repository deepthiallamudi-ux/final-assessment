const fs = require("fs");
const path = require("path");

const loggerMiddleware = (req, res, next) => {
    const method = req.method;
    const url = req.originalUrl;
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${method} ${url}\n`;
    const logFilePath = path.join(__dirname, "..", "logs", "logs.txt");
    
    fs.appendFile(logFilePath, logMessage, (err) => {
        if(err) console.error('Failed to write log:', err);
    });
    next();
};

module.exports = loggerMiddleware;