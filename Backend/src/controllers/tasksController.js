import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      createdBy: req.user.id
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
    const filter = {};
    
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
    const task = await Task.findById(req.params.id)
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
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
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
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    ).populate("assignee", "name email");
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
