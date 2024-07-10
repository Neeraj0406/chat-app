import Joi from 'joi';

const loginValidation = Joi.object({
    username: Joi.string().required().messages({
        'any.required': 'Username is required',
        'string.empty': 'Username is required',
    }),
    password: Joi.string().required().messages({
        'any.required': 'Password is required',
        "string.empty": "Password is required"
    })
});

const registerValidation = Joi.object({
    name: Joi.string().required().messages({
        'any.required': 'Name is required',
        'string.empty': 'Name is required',
    }),
    username: Joi.string().required().messages({
        'any.required': 'Username is required',
        'string.empty': 'Username is required',
    }),
    password: Joi.string().required().messages({
        'any.required': 'Password is required',
        "string.empty": "Password is required"
    }),
    bio: Joi.string().max(300).optional().messages({
        'string.max': 'Bio should be less than 300 characters',
    }),
    avatar : Joi.object({
        public_id : Joi.string().required().messages({
            "any.required" : "Please provid"
        })
    })

})

export { loginValidation, registerValidation };
