exports.authentication = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.role)){
            res.status(403).json({
                message:"not Allowed Access",
            })
        }
        next();
    }
}