import express from "express";
import * as bodyParser from "body-parser";
import router from "./routes";

const PORT = 3000;

const app = express();

// Middleware to parse request body in Express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to log requests and response status
app.use((req, res, next) => {
  console.log(`\n> ${req.method} ${req.path}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  res.on("finish", () => {
    console.log(`> ${res.statusCode} ${res.statusMessage}`);
  });
  next();
});

app.listen(PORT, () => {
  console.log(`\n> Listening on port ${PORT}`);
});

app.use("/api", router);
