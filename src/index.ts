import express from "express";
import cors from "cors";
import { salesRouter } from "./routes/salesRouter";
import { usersRouter } from "./routes/usersRouter";

const app = express();
const port = process.env.PORT || 8080;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use("/api", salesRouter);
app.use("/api", usersRouter);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
