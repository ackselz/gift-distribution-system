import * as fs from "fs";
import * as path from "path";
import { parse, stringify } from "csv/sync";
import { Redemption, Staff } from "src/types";

const REDEMPTIONS_FILE = "data/redemptions.csv";

export function deserializeRedemptions(): Redemption[] {
  console.log("\n> Deserializing redemptions... ");
  let records: Redemption[] = [];
  try {
    const data = fs.readFileSync(
      path.resolve(__dirname, REDEMPTIONS_FILE),
      "utf8",
    );
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

export function serializeRedemptions(records: Redemption[]): void {
  console.log("\n> Serializing Redemptions...");
  const data = stringify(records, {
    header: true,
  });
  fs.writeFileSync(path.resolve(__dirname, REDEMPTIONS_FILE), data, {
    flag: "w",
  });
  console.log(`> Serialized ${records.length} redemptions`);
}

export function isEligible(team_name: string): boolean {
  return !redemptionRecords.find((record) => record.team_name === team_name);
}

export function redeem(staff: Staff): boolean {
  if (!isEligible(staff.team_name)) {
    return false;
  }

  try {
    const newRedemptionRecord: Redemption = {
      team_name: staff.team_name,
      redeemed_at: Date.now(),
    };
    redemptionRecords.push(newRedemptionRecord);
    serializeRedemptions(redemptionRecords);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export const redemptionRecords: Redemption[] = deserializeRedemptions();
