import { after, beforeEach, describe, test } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";

import * as redemptions from "../../src/controllers/redemptionController"; // Assuming your original file is in a 'src' folder
import { Redemption, Staff } from "src/types";

// Helper to reset the mock data file
function resetMockData(data: string) {
  fs.writeFileSync(redemptions.REDEMPTIONS_FILE_PATH, data, { flag: "w" });
}

describe("Redemption Controller", async () => {
  // Sample mock data
  const MOCK_DATA = `team_name,redeemed_at\nTeam A,1664894634395\n`;

  //   Reset mock data before each test and initialize redemptions
  beforeEach(() => {
    resetMockData(MOCK_DATA);
    redemptions.initializeRedemptions();
  });

  after(() => {
    resetMockData("");
  });

  test("deserializeRedemptions", async (t) => {
    await t.test("should parse CSV data into Redemption objects", () => {
      const result = redemptions.deserializeRedemptions();
      assert.deepEqual(result, [
        {
          team_name: "Team A",
          redeemed_at: 1664894634395,
        },
      ]);
    });

    await t.test("should handle empty files", () => {
      resetMockData("");
      const result = redemptions.deserializeRedemptions();
      assert.deepStrictEqual(result, []);
    });
  });

  test("serializeRedemptions", async (t) => {
    await t.test("should write Redemption objects to CSV", () => {
      const records: Redemption[] = [
        { team_name: "Team B", redeemed_at: Date.now() },
      ];
      redemptions.serializeRedemptions(records);

      const fileContents = fs.readFileSync(
        redemptions.REDEMPTIONS_FILE_PATH,
        "utf8",
      );

      assert.strictEqual(
        fileContents,
        `team_name,redeemed_at\nTeam B,${records[0]?.redeemed_at}\n`,
      );
    });
  });

  test("isEligible", async (t) => {
    await t.test("should return true for teams that have not redeemed", () => {
      assert.strictEqual(redemptions.isEligible("Team X"), true);
    });

    await t.test("should return false for teams that have redeemed", () => {
      assert.strictEqual(redemptions.isEligible("Team A"), false);
    });
  });

  test("redeem", async (t) => {
    const staff: Staff = {
      staff_pass_id: "",
      team_name: "Team C",
      created_at: 0,
    };

    await t.test("should return true if successful", () => {
      const result = redemptions.redeem(staff);
      assert.strictEqual(result, true);
    });

    await t.test("should create a new redemption record if successful", () => {
      redemptions.redeem(staff);
      const redeemedRecord = redemptions.redemptionRecords.find(
        (r) => r.team_name === staff.team_name,
      );
      assert.ok(redeemedRecord);
    });
  });
});
