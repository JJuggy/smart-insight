import { Router } from "express";
import { getAllAutoBots } from "../controllers/autobots/getAllAutoBots";

const autoBotsRouter = Router();

autoBotsRouter.get("/", getAllAutoBots);

export default autoBotsRouter;


