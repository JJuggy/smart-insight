import { Request, Response, NextFunction } from "express";
import { sqlConnection } from "../..";

export const getAllAutoBots = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    sqlConnection.query("SELECT * FROM Autobots", (err, results) => {
      if (err) throw err;
      res.send({
        data: results,
      });
    });
  } catch (error) {
    next(error);
  }
};
