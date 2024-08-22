import { Request, Response } from "express";
import { sqlConnection } from ".";

export const getAllAutoBots = async (req: Request, res: Response) => {
  try {
    const connection = await sqlConnection.getConnection();
    const [results] = await connection.query(`SELECT * FROM Autobots`);
    console.log("results", results);
    res.json(results);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).send("Error fetching autobots"); // Handle error gracefully
  }
};
export const getAllPosts = async (req: Request, res: Response) => {
  const autobotId = req.params.id;
  try {
    // Acquire connection from pool
    const connection = await sqlConnection.getConnection();
    const [results] = await connection.query(
      "SELECT * FROM Posts WHERE autobot_id = ?",
      [autobotId]
    );
    // Release connection back to pool
    res.json(results);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).send("Error fetching posts");
  }
};
export const getAllComments = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const connection = await sqlConnection.getConnection();
    const [results] = await connection.query(
      "SELECT * FROM Comments WHERE post_id = ?",
      [postId]
    );

    res.json(results);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).send("Error fetching comments");
  }
};
