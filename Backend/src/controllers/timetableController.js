import TimetableRow from "../models/TimetableRow.js";

const parseWeekStart = (weekStart) => {
  if (!weekStart) return null;
  const d = new Date(weekStart);
  if (Number.isNaN(d.getTime())) return null;
  // Normalize to start-of-day UTC-ish (avoid time drift)
  d.setHours(0, 0, 0, 0);
  return d;
};

export const getTimetableRows = async (req, res) => {
  try {
    const weekStart = parseWeekStart(req.query.weekStart);
    if (!weekStart) {
      return res.status(400).json({ error: "weekStart is required (YYYY-MM-DD)" });
    }

    const rows = await TimetableRow.find({ user: req.user.id, weekStart })
      .sort({ createdAt: 1 });

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createTimetableRow = async (req, res) => {
  try {
    const weekStart = parseWeekStart(req.body.weekStart);
    if (!weekStart) {
      return res.status(400).json({ error: "weekStart is required (YYYY-MM-DD)" });
    }

    const row = await TimetableRow.create({
      user: req.user.id,
      weekStart,
      time: req.body.time || "",
      activity: req.body.activity || "",
      dates: req.body.dates || {}
    });

    res.status(201).json(row);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTimetableRow = async (req, res) => {
  try {
    const patch = {};
    if (req.body.time !== undefined) patch.time = req.body.time;
    if (req.body.activity !== undefined) patch.activity = req.body.activity;
    if (req.body.dates !== undefined) patch.dates = req.body.dates;
    patch.updatedAt = Date.now();

    const row = await TimetableRow.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      patch,
      { new: true }
    );

    if (!row) return res.status(404).json({ error: "Row not found" });
    res.json(row);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTimetableRow = async (req, res) => {
  try {
    const deleted = await TimetableRow.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deleted) return res.status(404).json({ error: "Row not found" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
