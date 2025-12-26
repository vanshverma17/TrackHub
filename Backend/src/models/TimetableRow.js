import mongoose from "mongoose";

const TimetableRowSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  weekStart: { type: Date, required: true },
  time: { type: String, default: "" },
  activity: { type: String, default: "" },
  // Map of YYYY-MM-DD -> boolean
  dates: { type: Map, of: Boolean, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

TimetableRowSchema.index({ user: 1, weekStart: 1, createdAt: 1 });

TimetableRowSchema.pre("save", function () {
  this.updatedAt = Date.now();
});

export default mongoose.model("TimetableRow", TimetableRowSchema);
