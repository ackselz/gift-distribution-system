import express from "express";
import * as bodyParser from "body-parser";
import router from "./routes";

const PORT = 3000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`\n----- Listening on port ${PORT} -----\n`);
});

app.use("/api", router);
