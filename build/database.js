"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllComments = exports.getAllPosts = exports.getAllAutoBots = void 0;
const _1 = require(".");
const getAllAutoBots = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield _1.sqlConnection.getConnection();
        const [results] = yield connection.query(`SELECT * FROM Autobots`);
        console.log("results", results);
        res.json(results);
    }
    catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).send("Error fetching autobots"); // Handle error gracefully
    }
});
exports.getAllAutoBots = getAllAutoBots;
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const autobotId = req.params.id;
    try {
        // Acquire connection from pool
        const connection = yield _1.sqlConnection.getConnection();
        const [results] = yield connection.query("SELECT * FROM Posts WHERE autobot_id = ?", [autobotId]);
        // Release connection back to pool
        res.json(results);
    }
    catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).send("Error fetching posts");
    }
});
exports.getAllPosts = getAllPosts;
const getAllComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.id;
        const connection = yield _1.sqlConnection.getConnection();
        const [results] = yield connection.query("SELECT * FROM Comments WHERE post_id = ?", [postId]);
        res.json(results);
    }
    catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).send("Error fetching comments");
    }
});
exports.getAllComments = getAllComments;
