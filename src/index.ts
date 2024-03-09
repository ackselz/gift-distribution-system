import * as fs from "fs";
import * as path from "path";
import express from "express";
import * as bodyParser from "body-parser";
import { parse, stringify } from "csv/sync";
import { Redemption, Staff } from "./types";

const PORT = 3000;
const STAFF_ID_TO_TEAM_MAPPING_FILE = "data/staff-id-to-team-mapping.csv";
const REDEMPTIONS_FILE = "data/redemptions.csv";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`\n----- Listening on port ${PORT} -----\n`);
});

function getStaffTeamMapping(): Staff[] {
  let records: Staff[] = [];
  try {
    const data = fs.readFileSync(
      path.resolve(__dirname, STAFF_ID_TO_TEAM_MAPPING_FILE),
      "utf8",
    );
    records = parse(data, {
      bom: true, //  https://csv.js.org/parse/options/bom/
      cast: (value, context) => {
        // https://csv.js.org/parse/options/cast/
        if (context.header) return value;
        if (context.column === "created_at") return Number(value);
        return String(value);
      },
      columns: true, // https://csv.js.org/parse/options/columns/
    });
  } catch (error) {
    console.error("Error reading staff id to team mapping file");
    console.error(error);
  }
  return records;
}

function getRedemptions(): Redemption[] {
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
  return records;
}

function serializeRedemptions(records: Redemption[]): void {
  console.log("\n----- SERIALIZING REDEMPTIONS -----\n");
  console.log(records);
  const data = stringify(records, {
    header: true,
  });
  fs.writeFileSync(path.resolve(__dirname, REDEMPTIONS_FILE), data, {
    flag: "w",
  });
}

const staffRecords: Staff[] = getStaffTeamMapping();
const redemptionRecords: Redemption[] = getRedemptions();

function getStaff(staff_pass_id: string): Staff | undefined {
  return staffRecords.find((record) => record.staff_pass_id === staff_pass_id);
}

function isEligible(team_name: string): boolean {
  return !redemptionRecords.find((record) => record.team_name === team_name);
}

function redeem(staff: Staff): boolean {
  if (!isEligible(staff.team_name)) {
    console.error("Team is not eligible for redemption");
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

// GET /ping
app.get("/ping", async (_req, res) => {
  res.status(200).send("pong");
});

// GET /staffs/:staff_pass_id
app.get("/staffs/:staff_pass_id", async (req, res) => {
  const { staff_pass_id } = req.params;
  if (staff_pass_id === undefined) {
    return res.status(400).json({ error: "staff_pass_id is required" });
  }
  const staff = getStaff(staff_pass_id);
  if (!staff) {
    return res.status(404).json({ error: "Staff not found" });
  }
  return res.status(200).json(staff);
});

// POST /redeem
app.post("/redeem", async (req, res) => {
  try {
    const { staff_pass_id } = req.body;
    if (staff_pass_id === undefined) {
      return res.status(400).json({ error: "staff_pass_id is required" });
    }
    const staff = getStaff(staff_pass_id);
    if (!staff) {
      return res.status(404).json({ error: "Staff not found" });
    }
    const success = redeem(staff);
    if (!success) {
      return res.status(409).json({
        error: "Redemption failed. Team is not eligible for redemption",
      });
    }
    return res.status(200).json({ message: "Redemption successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
