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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqlConnection = void 0;
const express_1 = __importDefault(require("express"));
const config_1 = require("./config/config");
require("dotenv/config");
const node_cron_1 = __importDefault(require("node-cron"));
const routes_1 = __importDefault(require("./routes"));
const axios_1 = __importDefault(require("axios"));
const promise_1 = __importDefault(require("mysql2/promise"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const app = (0, express_1.default)();
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: "Too many requests from this IP, please try again later.",
});
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/", routes_1.default);
app.use(limiter);
const port = config_1.appConfig.port;
exports.sqlConnection = promise_1.default.createPool({
    host: "localhost",
    user: "root",
    password: "password",
    database: "autobot_db",
});
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.sqlConnection.getConnection().then((res) => {
            app.listen(port, () => {
                console.log("Listening on port:", port);
            });
        });
    }
    catch (error) { }
});
const createAutobots = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (let i = 0; i < 500; i++) {
            // Fetch a random user
            const userId = Math.floor(Math.random() * 10) + 1;
            const userRes = yield axios_1.default.get(`https://jsonplaceholder.typicode.com/users/${userId}`);
            const autobotName = userRes.data.name;
            // Insert the autobot and wait for the result
            const [autobotResults] = yield exports.sqlConnection.execute("INSERT INTO Autobots (name) VALUES (?)", [autobotName]);
            const autobotId = autobotResults.insertId;
            // Create Posts
            for (let j = 0; j < 10; j++) {
                const postId = Math.floor(Math.random() * 100) + 1; // Adjust range as needed
                const postRes = yield axios_1.default.get(`https://jsonplaceholder.typicode.com/posts/${postId}`);
                const postTitle = postRes.data.title;
                const postBody = postRes.data.body;
                // Insert the post and wait for the result
                const [postResults] = yield exports.sqlConnection.execute("INSERT INTO Posts (title, body, autobot_id) VALUES (?, ?, ?)", [postTitle, postBody, autobotId]);
                const postIdInserted = postResults.insertId;
                // Create Comments
                for (let k = 0; k < 10; k++) {
                    const commentId = Math.floor(Math.random() * 500) + 1; // Adjust range as needed
                    const commentRes = yield axios_1.default.get(`https://jsonplaceholder.typicode.com/comments/${commentId}`);
                    const commentBody = commentRes.data.body;
                    // Insert the comment and wait for the result
                    yield exports.sqlConnection.execute("INSERT INTO Comments (body, post_id) VALUES (?, ?)", [commentBody, postIdInserted]);
                }
            }
        }
    }
    catch (error) {
        console.error("Error during autobot creation process:", error);
    }
});
node_cron_1.default.schedule("* * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        createAutobots();
    }
    catch (error) {
        console.error("Error running the scheduled task:", error);
    }
}));
start();
