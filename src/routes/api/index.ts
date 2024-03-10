import { Router } from "express";
import { getStaff } from "../../controllers/staffController";
import { redeem } from "../../controllers/redemptionController";

const apiRouter: Router = Router();

// GET /api/ping
apiRouter.get("/ping", async (_req, res) => {
  res.status(200).send("pong");
});

// GET /api/staffs/:staff_pass_id
apiRouter.get("/staffs/:staff_pass_id", async (req, res) => {
  try {
    const { staff_pass_id } = req.params;
    if (staff_pass_id === undefined) {
      return res.status(400).send("staff_pass_id is required");
    }
    const staff = getStaff(staff_pass_id);
    if (!staff) {
      return res.status(404).send("Staff not found");
    }
    return res.status(200).json(staff);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
});

// POST /api/redeem
apiRouter.post("/redeem", async (req, res) => {
  try {
    const { staff_pass_id } = req.body;
    if (staff_pass_id === undefined) {
      return res.status(400).send("staff_pass_id is required");
    }
    const staff = getStaff(staff_pass_id);
    if (!staff) {
      return res.status(404).send("Staff not found");
    }
    const success = redeem(staff);
    if (!success) {
      return res
        .status(409)
        .send("Redemption failed. Team has already redeemed");
    }
    return res.status(201).send("Redemption successful");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
});

export default apiRouter;
