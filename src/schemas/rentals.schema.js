import Joi from "joi";

export const rentalSchema = Joi.object({

    customerId: Joi.number().integer().positive().required(),
    gameId: Joi.number().integer().positive().required(),
    daysRented: Joi.number().integer().positive().max(9999).required()
});