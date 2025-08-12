import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", async (req, res) => {
  const state = mongoose.connection.readyState;
  let mongoosePing = false;
  let ok = state === 1;

  if (ok) {
    try {
      await mongoose.connection.db?.admin().ping();
      mongoosePing = true;
    } catch (error) {
      mongoosePing = false;
      ok = false;
    }
  }
  const payload = {
    state: ok ? "ok" : "error",
    mongostate: state,
    mongoosePing,
    uptimeSeconds: process.uptime(),
    timeStamp: new Date().toISOString(),
  };
  res.status(ok ? 200 : 500).json(payload);
});

export default router;
