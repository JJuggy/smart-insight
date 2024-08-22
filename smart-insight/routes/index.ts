import { Router } from "express";
import { getAllAutoBots, getAllComments, getAllPosts } from "../database";

const router = Router();

router.get("/autobots", getAllAutoBots);

router.get("/autobots/:id/posts", getAllPosts);

router.get("/posts/:id/comments", getAllComments);

export default router;
