import express, { Request, Response } from "express";
import * as usersData from "../data/users.json";

export const usersRouter = express.Router();

usersRouter.use(express.json());

usersRouter.get("/users/:id", async (_req: Request, res: Response) => {
  try {
    const user = usersData.users.filter((user) => user.id === _req.params.id);
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

usersRouter.post("/users/register", async (_req: Request, res: Response) => {
  try {
    const user = usersData.users.filter((user) => user.id === _req.params.id);
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

usersRouter.post("/users/login", async (_req: Request, res: Response) => {
  try {
    console.log("/users/login" + JSON.stringify(_req.body));
    console.log("username" + JSON.stringify(_req.body.username));
    console.log("password" + JSON.stringify(_req.body.password));
    const username = _req.body.username;
    const password = _req.body.password;
    const users = usersData.users.filter((user) => user.email === username);
    if (users.length > 0) {
      res.status(200).send(users[0]);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});
