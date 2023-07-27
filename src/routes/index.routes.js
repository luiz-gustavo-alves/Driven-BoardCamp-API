import { Router } from "express";
import customersRouter from './customers.routes.js';
import gamesRouter from "./games.routes.js";

const router = Router();

router.use(customersRouter);
router.use(gamesRouter);

export default router;