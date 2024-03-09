import express from "express";
import * as bodyParser from "body-parser";
import router from "./routes";

const PORT = 3000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`\n> Listening on port ${PORT}`);
});

app.use((req, res, next) => {
  console.log(`\n> ${req.method} ${req.path}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  res.on("finish", () => {
    console.log(`> ${res.statusCode} ${res.statusMessage}`);
  });
  next();
});

app.use("/api", router);
