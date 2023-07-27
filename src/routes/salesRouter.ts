import express, { Request, Response } from "express";
import * as saleItems from "../data/saleItems.json";

export const salesRouter = express.Router();

salesRouter.use(express.json());

salesRouter.get("/sales", async (_req: Request, res: Response) => {
  try {
    res.status(200).send(saleItems.saleItems);
  } catch (error) {
    res.status(500).send(error);
  }
});
