import { tap } from "node:test/reporters";
import { run } from "node:test";
import process from "node:process";

run({
  files: [
    "./test/controllers/staffController.test.ts",
    "./test/controllers/staffController.test.ts",
  ],
})
  .compose(tap)
  .pipe(process.stdout);
