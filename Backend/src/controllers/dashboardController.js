import Task from "../models/Task.js";
import Project from "../models/Project.js";

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get task counts by status
    const taskStats = await Task.aggregate([
      {
        $match: {
          $or: [{ assignee: userId }, { createdBy: userId }]
        }
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get total projects
    const projectCount = await Project.countDocuments({
      $or: [{ owner: userId }, { members: userId }]
    });
    
    // Get recent tasks
    const recentTasks = await Task.find({
      $or: [{ assignee: userId }, { createdBy: userId }]
    })
      .populate("assignee", "name email")
      .populate("project", "name")
      .sort({ updatedAt: -1 })
      .limit(10);
    
    // Get upcoming deadlines
    const upcomingDeadlines = await Task.find({
      $or: [{ assignee: userId }, { createdBy: userId }],
      dueDate: { $gte: new Date(), $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      status: { $ne: "done" }
    })
      .populate("assignee", "name email")
      .populate("project", "name")
      .sort({ dueDate: 1 })
      .limit(5);
    
    // Format stats
    const stats = {
      todo: taskStats.find(s => s._id === "todo")?.count || 0,
      inProgress: taskStats.find(s => s._id === "inProgress")?.count || 0,
      done: taskStats.find(s => s._id === "done")?.count || 0,
      projects: projectCount
    };
    
    res.json({
      stats,
      recentTasks,
      upcomingDeadlines
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getActivityFeed = async (req, res) => {
  try {
    const recentActivity = await Task.find({
      $or: [{ assignee: req.user.id }, { createdBy: req.user.id }]
    })
      .populate("assignee", "name")
      .populate("createdBy", "name")
      .sort({ updatedAt: -1 })
      .limit(20);
    
    res.json(recentActivity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
