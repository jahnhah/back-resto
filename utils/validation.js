const Joi=require('joi')

const registerValidation=(data)=>{
    const registerSchema=Joi.object({
        nom: Joi.string().required(),
        email: Joi.string().email().required(),
        type: Joi.string().valid('admin','restaurant','utilisateur','livreur'),
        pwd: Joi.string().min(6).required()
    })
    return registerSchema.validate(data);
}

const loginValidation=(data)=>{
    const loginSchema=Joi.object({
        email: Joi.string().email().required(),
        pwd: Joi.string().required()
    })
    return loginSchema.validate(data);
}
module.exports.registerValidation=registerValidation
module.exports.loginValidation=loginValidation
