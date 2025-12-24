import mongoose from "mongoose";

const TimeEntrySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  date: { type: Date, required: true },
  startTime: { type: String, required: true }, // "09:00"
  endTime: { type: String, required: true },   // "17:00"
  hours: { type: Number, required: true },
  description: String,
  billable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("TimeEntry", TimeEntrySchema);
