import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!req.body?.project) {
      return res.status(400).json({ error: "Project is required" });
    }

    const task = await Task.create({
      ...req.body,
      createdBy: req.user.id,
      updatedAt: Date.now(),
      completed: req.body?.status === "done"
    });
    const populated = await Task.findById(task._id)
      .populate("assignee", "name email")
      .populate("project", "name");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const { project, status, assignee, search } = req.query;
    const filter = { createdBy: req.user.id };
    
    if (project) filter.project = project;
    if (status) filter.status = status;
    if (assignee) filter.assignee = assignee;
    if (search) {
      filter.$or = [
        { title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") }
      ];
    }
    
    const tasks = await Task.find(filter)
      .populate("assignee", "name email")
      .populate("project", "name")
      .sort({ createdAt: -1 });
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, createdBy: req.user.id })
      .populate("assignee", "name email")
      .populate("project", "name");
    
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const patch = {
      ...req.body,
      updatedAt: Date.now(),
      ...(req.body?.status
        ? { completed: req.body.status === "done" }
        : {})
    };

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      patch,
      { new: true }
    ).populate("assignee", "name email");
    
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const moveTask = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      { status, updatedAt: Date.now(), completed: status === "done" },
      { new: true }
    ).populate("assignee", "name email");

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!deleted) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
