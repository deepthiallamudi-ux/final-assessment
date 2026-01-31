const store={}; 
const rateLimiter=(req,res,next)=>{
    const ip=req.ip||req.connection.remoteAddress||"unknown";
const now=Date.now();
if(!store[ip]){
    store[ip]={count:1,startTime:now};
    return next();  
}

const diff=now-store[ip].startTime;
if(diff>60000){
    store[ip].startTime=now;
    store[ip].count=1;
    return next();
}

store[ip].count++;

if(store[ip].count>5){
    return res.status(429).json({
        success:false,
        message:"Too many requests"});
}
return next();
};

export default(rateLimiter);