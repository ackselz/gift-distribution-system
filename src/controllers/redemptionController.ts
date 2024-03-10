import fs from "fs";
import { parse, stringify } from "csv/sync";
import { Redemption, Staff } from "src/types";
import path from "path";

export const REDEMPTIONS_FILE_PATH =
  process.env.NODE_ENV === "test"
    ? path.resolve(__dirname, "../../test/data/redemptions.csv")
    : path.resolve(__dirname, "../data/redemptions.csv");

/**
 * Deserializes redemptions data from a CSV file.
 * @returns An array of Redemption objects.
 */
export function deserializeRedemptions(): Redemption[] {
  console.log("\n> Deserializing redemptions... ");
  let records: Redemption[] = [];
  try {
    const data = fs.readFileSync(REDEMPTIONS_FILE_PATH, "utf8");
    records = parse(data, {
      bom: true,
      cast: (value, context) => {
        if (context.header) return value;
        if (context.column === "redeemed_at") return Number(value);
        return String(value);
      },
      columns: true,
    });
  } catch (error) {
    // @ts-expect-error temporary workaround - NodeJS error types are not available
    if (error.code === "ENOENT") {
      return records;
    } else {
      console.error("Error reading redemptions file");
      console.error(error);
    }
  }
  console.log(`> Deserialized ${records.length} redemptions`);
  return records;
}

/**
 * Serializes an array of Redemption records and writes them to a CSV file.
 * @param records - The array of Redemption records to serialize.
 */
export function serializeRedemptions(records: Redemption[]): void {
  console.log("\n> Serializing Redemptions...");
  try {
    const data = stringify(records, {
      header: true,
    });
    fs.writeFileSync(REDEMPTIONS_FILE_PATH, data, {
      flag: "w", // overwrite the file
    });
  } catch (error) {
    console.error("Error writing redemptions file");
    console.error(error);
  }
  console.log(`> Serialized ${records.length} redemptions`);
}

/**
 * Checks if a team is eligible for redemption.
 * @param team_name - The name of the team to check eligibility for.
 * @returns A boolean value indicating if the team is eligible for redemption.
 */
export function isEligible(team_name: string): boolean {
  console.log(team_name, redemptionRecords);
  return !redemptionRecords.find((record) => record.team_name === team_name);
}

/**
 * Processes a redemption request from a staff member.
 * @param staff - The staff member performing the redemption.
 * @returns A boolean indicating whether the redemption was successful.
 */
export function redeem(staff: Staff): boolean {
  if (!isEligible(staff.team_name)) {
    return false;
  }

  try {
    const newRedemptionRecord: Redemption = {
      team_name: staff.team_name,
      redeemed_at: Date.now(),
    };
    redemptionRecords.push(newRedemptionRecord); // Update in-memory records
    serializeRedemptions(redemptionRecords); // Update file records
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export function initializeRedemptions(): void {
  redemptionRecords = deserializeRedemptions();
}

// Initialize redemption records
export let redemptionRecords: Redemption[] = deserializeRedemptions();
