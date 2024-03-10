import { Router } from "express";
import path from "path";

const appRouter: Router = Router();

// GET /api/ping
appRouter.get("/", (_req, res) => {
  res.sendFile("index.html", { root: path.resolve(__dirname, "../views") });
});

export default appRouter;
