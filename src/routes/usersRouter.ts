import express, { Request, Response } from "express";
import * as users from "../data/users.json";

export const usersRouter = express.Router();

usersRouter.use(express.json());

usersRouter.get("/users/:id", async (_req: Request, res: Response) => {
  try {
    const user = users.users.filter((user) => user.id === _req.params.id);
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});
