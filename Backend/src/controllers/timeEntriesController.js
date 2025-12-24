import TimeEntry from "../models/TimeEntry.js";

export const createTimeEntry = async (req, res) => {
  try {
    const entry = await TimeEntry.create({
      ...req.body,
      user: req.user.id
    });
    const populated = await TimeEntry.findById(entry._id)
      .populate("project", "name")
      .populate("task", "title");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTimeEntries = async (req, res) => {
  try {
    const { startDate, endDate, project } = req.query;
    const filter = { user: req.user.id };
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    if (project) filter.project = project;
    
    const entries = await TimeEntry.find(filter)
      .populate("project", "name")
      .populate("task", "title")
      .sort({ date: -1, startTime: -1 });
    
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTimeEntry = async (req, res) => {
  try {
    const entry = await TimeEntry.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    ).populate("project", "name").populate("task", "title");
    
    if (!entry) {
      return res.status(404).json({ error: "Time entry not found" });
    }
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTimeEntry = async (req, res) => {
  try {
    await TimeEntry.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTimeStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = { user: req.user.id };
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    
    const stats = await TimeEntry.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalHours: { $sum: "$hours" },
          billableHours: {
            $sum: { $cond: ["$billable", "$hours", 0] }
          },
          entries: { $sum: 1 }
        }
      }
    ]);
    
    res.json(stats[0] || { totalHours: 0, billableHours: 0, entries: 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
