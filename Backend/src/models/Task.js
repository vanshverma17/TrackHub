import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  tag: String,
  tagColor: { type: String, default: "blue" },
  startDate: Date,
  dueDate: Date,
  status: { 
    type: String, 
    enum: ["todo", "inProgress", "done"], 
    default: "todo" 
  },
  priority: { 
    type: String, 
    enum: ["low", "medium", "high"], 
    default: "medium" 
  },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  completed: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

TaskSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  if (this.status === "done") this.completed = true;
});

export default mongoose.model("Task", TaskSchema);
