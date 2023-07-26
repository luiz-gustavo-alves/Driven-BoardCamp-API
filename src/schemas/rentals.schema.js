import Joi from "joi";

export const RentalSchema = Joi.object({

    customerId: Joi.integer().positive().required(),
    gameId: Joi.integer().positive().required(),
    daysRented: Joi.integer().positive().max(9999).required()
});