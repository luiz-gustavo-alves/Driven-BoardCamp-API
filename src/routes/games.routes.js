import { Router } from "express";
import { getGames, createGame } from "../controllers/games.controller.js";
import { schemaValidation } from "../middlewares/schemaValidation.js";
import { dataSanitization } from "../middlewares/dataSanitization.js";
import { gameSchema } from "../schemas/games.schema.js";

const gamesRouter = Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", schemaValidation(gameSchema), dataSanitization, createGame);

export default gamesRouter;