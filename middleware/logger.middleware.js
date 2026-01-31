const fs=require("fs");
const path=require("path");

const loggerMiddleware=(req,res,next)=>{
const method=req.method;
const url=req.originalUrl;
const timestamp=new Date().toISOString();
const logMessage=`[${timestamp}] ${method} ${url}\n`;
const logFilePath=path.join(__dirname,"..","logs","log.txt");

fs.appendFile(logFilePath,logMessage,(err)=>{
    next();
});
};

module.exports=(loggerMiddleware);