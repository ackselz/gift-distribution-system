import { beforeEach, describe, test } from "node:test";
import assert from "node:assert/strict";

import * as staffController from "../../src/controllers/staffController"; // Assuming your original file is in a 'src' folder

describe("Staff Controller", () => {
  const FIRST_TEST_RECORD = {
    staff_pass_id: "STAFF_H123804820G",
    team_name: "BASS",
    created_at: 1623772799000,
  };

  beforeEach(() => {
    staffController.initializeStaffs();
  });

  test("deserializeStaffs", async (t) => {
    await t.test("should parse CSV data into Staff objects", () => {
      const result = staffController.deserializeStaffs();
      assert.strictEqual(result.length, 3);
      assert.deepStrictEqual(result[0], FIRST_TEST_RECORD);
    });
  });

  test("getStaff", async (t) => {
    await t.test("should return a Staff object if staff exists", () => {
      const result = staffController.getStaff(FIRST_TEST_RECORD.staff_pass_id);
      assert.deepStrictEqual(result, FIRST_TEST_RECORD);
    });

    await t.test("should return undefined if staff does not exist", () => {
      const result = staffController.getStaff("I_DO_NOT_EXIST");
      assert.strictEqual(result, undefined);
    });
  });
});
