"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../database");
const router = (0, express_1.Router)();
router.get("/autobots", database_1.getAllAutoBots);
router.get("/autobots/:id/posts", database_1.getAllPosts);
router.get("/posts/:id/comments", database_1.getAllComments);
exports.default = router;
