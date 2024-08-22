import express, { Application, Request, Response } from "express";
import { appConfig } from "./config/config";
import "dotenv/config";
import cron from "node-cron";
import router from "./routes";
import axios from "axios";
import mysql from "mysql2/promise";
const port = appConfig.port;

const app: Application = express();
app.use(express.json());

app.use("/", router);
const sqlConnection = mysql.createPool({
  host: appConfig.DB_HOST,
  user: appConfig.DB_USER,
  password: appConfig.DB_PASSWORD,
  database: appConfig.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Adjust this based on your needs
  queueLimit: 0,
});

const start = async () => {
  try {
    const connection = await sqlConnection.getConnection();
    console.log("Connected to MySQL database");
    app.listen(port, () => {
      console.log("Listening on port:", port);
    });
  } catch (error) {}
};

const createAutobots = async () => {
  for (let i = 0; i < 500; i++) {
    try {
      const res = await axios.get(
        "https://jsonplaceholder.typicode.com/users/1"
      );
      const autobotName: string = res.data.name;

      // Insert the autobot and wait for the result
      const [autobotResults]: any = await sqlConnection.execute(
        "INSERT INTO Autobots (name) VALUES (?)",
        [autobotName]
      );

      const autobotId: number = autobotResults.insertId;

      // Create Posts
      for (let j = 0; j < 10; j++) {
        const postRes = await axios.get(
          "https://jsonplaceholder.typicode.com/posts/1"
        );
        const postTitle: string = postRes.data.title;
        const postBody: string = postRes.data.body;

        // Insert the post and wait for the result
        const [postResults]: any = await sqlConnection.execute(
          "INSERT INTO Posts (title, body, autobot_id) VALUES (?, ?, ?)",
          [postTitle, postBody, autobotId]
        );

        const postId: number = postResults.insertId;

        // Create Comments
        for (let k = 0; k < 10; k++) {
          const commentRes = await axios.get(
            "https://jsonplaceholder.typicode.com/comments/1"
          );
          const commentBody: string = commentRes.data.body;

          // Insert the comment and wait for the result
          await sqlConnection.execute(
            "INSERT INTO Comments (body, post_id) VALUES (?, ?)",
            [commentBody, postId]
          );
        }
      }
    } catch (error) {
      console.error("Error during autobot creation process:", error);
      // Consider adding more sophisticated error handling here, such as rolling back transactions or retrying failed operations.
    }
  }
};

cron.schedule("0 * * * *", async () => {
  try {
    createAutobots();
  } catch (error) {
    console.error("Error running the scheduled task:", error);
  }
});
start();
