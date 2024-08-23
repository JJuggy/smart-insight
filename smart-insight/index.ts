import express, { Application } from "express";
import { appConfig } from "./config/config";
import "dotenv/config";
import cron from "node-cron";
import router from "./routes";
import axios from "axios";
import mysql from "mysql2/promise";
import cors from "cors";
import rateLimit from "express-rate-limit";

const app: Application = express();
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: "Too many requests from this IP, please try again later.",
});
app.use(express.json());
app.use(cors());
app.use("/", router);

app.use(limiter);
const port = appConfig.port;
export const sqlConnection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "autobot_db",
});

const start = async () => {
  try {
    await sqlConnection.getConnection().then((res) => {
      app.listen(port, () => {
        console.log("Listening on port:", port);
      });
    });
  } catch (error) {}
};

const createAutobots = async () => {
  try {
    for (let i = 0; i < 500; i++) {
      // Fetch a random user
      const userId = Math.floor(Math.random() * 10) + 1;
      const userRes = await axios.get(
        `https://jsonplaceholder.typicode.com/users/${userId}`
      );
      const autobotName: string = userRes.data.name;

      // Insert the autobot and wait for the result
      const [autobotResults]: any = await sqlConnection.execute(
        "INSERT INTO Autobots (name) VALUES (?)",
        [autobotName]
      );
      const autobotId: number = autobotResults.insertId;

      // Create Posts
      for (let j = 0; j < 10; j++) {
        const postId = Math.floor(Math.random() * 100) + 1; // Adjust range as needed
        const postRes = await axios.get(
          `https://jsonplaceholder.typicode.com/posts/${postId}`
        );
        const postTitle: string = postRes.data.title;
        const postBody: string = postRes.data.body;

        // Insert the post and wait for the result
        const [postResults]: any = await sqlConnection.execute(
          "INSERT INTO Posts (title, body, autobot_id) VALUES (?, ?, ?)",
          [postTitle, postBody, autobotId]
        );
        const postIdInserted: number = postResults.insertId;

        // Create Comments
        for (let k = 0; k < 10; k++) {
          const commentId = Math.floor(Math.random() * 500) + 1; // Adjust range as needed
          const commentRes = await axios.get(
            `https://jsonplaceholder.typicode.com/comments/${commentId}`
          );
          const commentBody: string = commentRes.data.body;

          // Insert the comment and wait for the result
          await sqlConnection.execute(
            "INSERT INTO Comments (body, post_id) VALUES (?, ?)",
            [commentBody, postIdInserted]
          );
        }
      }
    }
  } catch (error) {
    console.error("Error during autobot creation process:", error);
  }
};

cron.schedule("* * * * *", async () => {
  try {
    createAutobots();
  } catch (error) {
    console.error("Error running the scheduled task:", error);
  }
});
start();
