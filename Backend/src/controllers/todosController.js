import Todo from "../models/todo.js";

export const createTodo = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const title = req.body?.title ?? req.body?.text;
    const dueDate = req.body?.dueDate ?? req.body?.date;

    if (!title || String(title).trim().length === 0) {
      return res.status(400).json({ error: "Title is required" });
    }

    const todo = await Todo.create({
      ...req.body,
      title,
      ...(dueDate ? { dueDate } : {}),
      user: req.user.id
    });
    res.status(201).json(todo);
  } catch (error) {
    console.error("createTodo error:", error);
    if (error?.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation error",
        details: Object.values(error.errors || {}).map((e) => e.message)
      });
    }
    res.status(500).json({
      error: error?.message || "Internal Server Error",
      ...(process.env.NODE_ENV !== "production"
        ? { name: error?.name, stack: error?.stack }
        : {})
    });
  }
};

export const getTodos = async (req, res) => {
  try {
    const { completed, category, search } = req.query;
    const filter = { user: req.user.id };
    
    if (completed !== undefined) filter.completed = completed === 'true';
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") }
      ];
    }
    
    const todos = await Todo.find(filter).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const patch = { ...req.body };
    if (patch.text !== undefined && patch.title === undefined) {
      patch.title = patch.text;
      delete patch.text;
    }
    if (patch.date !== undefined && patch.dueDate === undefined) {
      patch.dueDate = patch.date;
      delete patch.date;
    }

    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      patch,
      { new: true }
    );
    
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(todo);
  } catch (error) {
    console.error("updateTodo error:", error);
    if (error?.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation error",
        details: Object.values(error.errors || {}).map((e) => e.message)
      });
    }
    res.status(500).json({
      error: error?.message || "Internal Server Error",
      ...(process.env.NODE_ENV !== "production"
        ? { name: error?.name, stack: error?.stack }
        : {})
    });
  }
};

export const toggleComplete = async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    
    todo.completed = !todo.completed;
    await todo.save();
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
