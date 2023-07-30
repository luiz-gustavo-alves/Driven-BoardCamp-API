import { Router } from "express";
import { getRentals, createRental, finishRental, deleteRental } from "../controllers/rentals.controller.js";
import { schemaValidation } from "../middlewares/schemaValidation.js";
import { dataSanitization } from "../middlewares/dataSanitization.js";
import { rentalValidation } from "../middlewares/rentalValidation.js";
import { rentalSchema } from "../schemas/rentals.schema.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", schemaValidation(rentalSchema), dataSanitization, createRental);
rentalsRouter.post("/rentals/:id/return", rentalValidation, finishRental);
rentalsRouter.delete("/rentals/:id", rentalValidation, deleteRental);

export default rentalsRouter;