import express from "express";

console.log("hello world");

const app = express();
const PORT = 3000; // Or any port you prefer

// GET /lookup?staffPassId=<id>
app.get("/ping", async (_req, res) => {
  res.status(200).send("pong");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
