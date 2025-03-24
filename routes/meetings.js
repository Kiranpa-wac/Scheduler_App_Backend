const express = require("express");
const router = express.Router();
const Meeting = require("../models/Meetings");

router.get("/", async (req, res) => {
  try {
    const meetings = await Meeting.find().toArray();
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/room/:roomId", async (req, res) => {
  try {
    console.log("Fetching meetings for room:", req.params.roomId);
    const meetings = await Meeting.find({ roomId: req.params.roomId });
    res.json(meetings);
  } catch (error) {
    console.error("Error in GET /room/:roomId:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/room/:roomId", async (req, res) => {
  try {
    const { title, organiser, project, start, end } = req.body;
    const roomId = req.params.roomId;
    const meeting = new Meeting({ title, organiser, project, start, end, roomId });
    const savedMeeting = await meeting.save();
    res.status(201).json(savedMeeting);
  } catch (error) {

    if (error.name === "ValidationError") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedMeeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedMeeting)
      return res.status(404).json({ error: "Meeting not found" });
    res.json(updatedMeeting);
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedMeeting = await Meeting.findByIdAndDelete(req.params.id);
    if (!deletedMeeting)
      return res.status(404).json({ error: "Meeting not found" });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
