import { Router } from "express";
import { getAllAutoBots } from "../controllers/autobots/getAllAutoBots";
import { sqlConnection } from "..";

const router = Router();

router.get("/autobots", getAllAutoBots);

router.get("/autobots/:id/posts", (req, res) => {
  const autobotId = req.params.id;
  sqlConnection.query(
    "SELECT * FROM Posts WHERE autobot_id = ?",
    [autobotId],
    (err, results) => {
      if (err) throw err;
      res.json(results);
    }
  );
});

router.get("/posts/:id/comments", (req, res) => {
  const postId = req.params.id;
  sqlConnection.query(
    "SELECT * FROM Comments WHERE post_id = ?",
    [postId],
    (err, results) => {
      if (err) throw err;
      res.json(results);
    }
  );
});

export default router;
