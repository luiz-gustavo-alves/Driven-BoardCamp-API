import Joi from "joi";

export const gameSchema = Joi.object({

    name: Joi.string().max(256).required(),
    image: Joi.string().max(4096).required(),
    stockTotal: Joi.number().integer().greater(0).max(999999).required(),
    pricePerDay: Joi.number().integer().greater(0).max(999999).required()
});