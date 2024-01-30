// src/index.js
import express, { Express, Request, Response } from "express";
import { mkdirSync } from "fs";
import dotenv from "dotenv";
import cors from "cors";

import routes from "./api/routes/index.route";
import { PORT, UPLOAD_PATH } from "./api/constants";

dotenv.config();

const app: Express = express();

app.use(cors());

// create upload directory for image uploads on server start
mkdirSync(UPLOAD_PATH, { recursive: true });

// health check
app.get("/status", (req: Request, res: Response) => {
  res.send("OK");
});

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
