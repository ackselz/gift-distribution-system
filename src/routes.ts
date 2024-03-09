import { Router } from "express";
import { getStaff } from "./controllers/staffController";
import { redeem } from "./controllers/redemptionController";

const router: Router = Router();

// GET /ping
router.get("/ping", async (_req, res) => {
  res.status(200).send("pong");
});

// GET /staffs/:staff_pass_id
router.get("/staffs/:staff_pass_id", async (req, res) => {
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
router.post("/redeem", async (req, res) => {
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

export default router;
