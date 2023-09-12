import express, { Request, Response } from "express";
import * as saleItems from "../data/saleItems.json";

export const salesRouter = express.Router();

salesRouter.use(express.json());

salesRouter.post("/sales/sync", async (_req: Request, res: Response) => {
  try {
    res.status(200).send(saleItems.saleItems);
  } catch (error) {
    res.status(500).send(error);
  }
});

salesRouter.post("/sales/delete", async (_req: Request, res: Response) => {
  try {
    res.status(200).send({});
  } catch (error) {
    res.status(500).send(error);
  }
});

salesRouter.post("/sales/create", async (_req: Request, res: Response) => {
  try {
    console.log("create sale" + JSON.stringify(_req.body));
    res.status(200).send(_req.body);
  } catch (error) {
    res.status(500).send(error);
  }
});
