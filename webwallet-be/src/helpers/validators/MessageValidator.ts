
import Joi from 'joi';

export const validateMessageInput = (data: any) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        message: Joi.string().required(),
        timestamp: Joi.date().optional()
    });

    return schema.validate(data);
};