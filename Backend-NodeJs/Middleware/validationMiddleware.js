const ThrowMessage = require("../utils/ThrowMessage");

exports.validationMiddleware = (schema)=>{
    return (req,res,next)=>{
        const validationResult = schema.validate(req.body ,{abortEarly:false,allowUnknown: true,});
        if(validationResult.error){
            next(new ThrowMessage(422,validationResult.error.details[0].message));
        }else{
            next();
        }
    }
}