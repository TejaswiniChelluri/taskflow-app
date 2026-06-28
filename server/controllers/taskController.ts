import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import Task, { ITask } from "../models/Task.ts";
import { getIsMongoConnected } from "../config/db.ts";

// Path to file-based fallback storage
const DATA_DIR = path.join(process.cwd(), "server", "data");
const DATA_FILE = path.join(DATA_DIR, "tasks.json");

// Helper to ensure data directory and file exist
function ensureLocalStore(): ITask[] {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    // Generate initial seed tasks for rich out-of-the-box demo experience
    const now = new Date();
    const seedTasks = [
      {
        id: "task-1",
        title: "Configure MongoDB Atlas Connection",
        description: "Configure the MONGO_URI variable in the Secrets Panel in AI Studio to connect your personal database cluster.",
        priority: "High",
        status: "Pending",
        category: "Work",
        dueDate: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: "task-2",
        title: "Explore TaskFlow Statistics & Charts",
        description: "Check the visual task breakdown, percentage completeness rings, and bento dashboard widgets.",
        priority: "Medium",
        status: "In Progress",
        category: "Personal",
        dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "task-3",
        title: "Review TaskFlow Full-Stack Documentation",
        description: "Read the generated professional README.md with detailed architectural flows and REST endpoint specifications.",
        priority: "Low",
        status: "Completed",
        category: "Study",
        dueDate: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: now.toISOString(),
      },
    ];

    fs.writeFileSync(DATA_FILE, JSON.stringify(seedTasks, null, 2), "utf-8");
    return seedTasks as any[];
  }

  try {
    const content = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    console.error("Error reading JSON fallback storage:", err);
    return [];
  }
}

function saveLocalStore(tasks: any[]): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), "utf-8");
}

// Map Priority string to scalar weight for sorting
const PRIORITY_WEIGHTS = {
  High: 3,
  Medium: 2,
  Low: 1,
};

/**
 * GET /api/tasks
 * Supports search, status/priority/category filters, and custom sorting.
 */
export async function getTasks(req: Request, res: Response): Promise<void> {
  try {
    const isMongo = getIsMongoConnected();
    let rawTasks: any[] = [];

    if (isMongo) {
      rawTasks = await Task.find({}).lean();
    } else {
      rawTasks = ensureLocalStore();
    }

    // Apply filtering and sorting in application layer for uniformity
    const { search, status, priority, category, sortBy } = req.query;

    let filteredTasks = [...rawTasks];

    // 1. Live Search (Title, Description, Category)
    if (search) {
      const q = String(search).toLowerCase();
      filteredTasks = filteredTasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    // 2. Status Filter
    if (status && status !== "All") {
      filteredTasks = filteredTasks.filter((t) => t.status === status);
    }

    // 3. Priority Filter
    if (priority && priority !== "All") {
      filteredTasks = filteredTasks.filter((t) => t.priority === priority);
    }

    // 4. Category Filter
    if (category && category !== "All" && category !== "All Categories") {
      filteredTasks = filteredTasks.filter((t) => t.category === category);
    }

    // 5. Sorting
    if (sortBy) {
      switch (sortBy) {
        case "Newest First":
          filteredTasks.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
        case "Oldest First":
          filteredTasks.sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          break;
        case "Priority":
          filteredTasks.sort((a, b) => {
            const wa = PRIORITY_WEIGHTS[a.priority as keyof typeof PRIORITY_WEIGHTS] || 0;
            const wb = PRIORITY_WEIGHTS[b.priority as keyof typeof PRIORITY_WEIGHTS] || 0;
            if (wb !== wa) return wb - wa; // High to Low
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Then newest first
          });
          break;
        case "Due Date":
          filteredTasks.sort((a, b) => {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          });
          break;
        case "Alphabetical":
          filteredTasks.sort((a, b) => a.title.localeCompare(b.title));
          break;
        default:
          filteredTasks.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    } else {
      // Default newest first
      filteredTasks.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    res.status(200).json({
      success: true,
      mode: isMongo ? "mongodb" : "local-file",
      count: filteredTasks.length,
      tasks: filteredTasks,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server Error fetching tasks",
      error: error.message,
    });
  }
}

/**
 * GET /api/tasks/:id
 */
export async function getTaskById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  try {
    const isMongo = getIsMongoConnected();

    if (isMongo) {
      const task = await Task.findById(id);
      if (!task) {
        res.status(404).json({ success: false, message: "Task not found" });
        return;
      }
      res.status(200).json({ success: true, task });
    } else {
      const tasks = ensureLocalStore();
      const task = tasks.find((t: any) => t._id === id || t.id === id);
      if (!task) {
        res.status(404).json({ success: false, message: "Task not found" });
        return;
      }
      res.status(200).json({ success: true, task });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server Error retrieving task",
      error: error.message,
    });
  }
}

/**
 * POST /api/tasks
 */
export async function createTask(req: Request, res: Response): Promise<void> {
  const { title, description, priority, status, category, dueDate } = req.body;

  try {
    const isMongo = getIsMongoConnected();
    const taskData = {
      title,
      description,
      priority: priority || "Medium",
      status: status || "Pending",
      category: category || "Personal",
      dueDate: new Date(dueDate),
    };

    if (isMongo) {
      const newTask = new Task(taskData);
      const savedTask = await newTask.save();
      res.status(201).json({ success: true, task: savedTask });
    } else {
      const tasks = ensureLocalStore();
      const newId = "task-" + Date.now();
      const now = new Date().toISOString();
      const savedTask = {
        _id: newId,
        id: newId,
        ...taskData,
        dueDate: new Date(dueDate).toISOString(),
        createdAt: now,
        updatedAt: now,
      };

      tasks.push(savedTask as any);
      saveLocalStore(tasks);

      res.status(201).json({ success: true, task: savedTask });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server Error creating task",
      error: error.message,
    });
  }
}

/**
 * PUT /api/tasks/:id
 */
export async function updateTask(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { title, description, priority, status, category, dueDate } = req.body;

  try {
    const isMongo = getIsMongoConnected();
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (priority !== undefined) updateData.priority = priority;
    if (status !== undefined) updateData.status = status;
    if (category !== undefined) updateData.category = category;
    if (dueDate !== undefined) updateData.dueDate = new Date(dueDate);

    if (isMongo) {
      const updatedTask = await Task.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedTask) {
        res.status(404).json({ success: false, message: "Task not found" });
        return;
      }
      res.status(200).json({ success: true, task: updatedTask });
    } else {
      const tasks = ensureLocalStore();
      const idx = tasks.findIndex((t: any) => t._id === id || t.id === id);

      if (idx === -1) {
        res.status(404).json({ success: false, message: "Task not found" });
        return;
      }

      const existing = tasks[idx];
      const now = new Date().toISOString();
      const updatedTask = {
        ...existing,
        ...updateData,
        dueDate: dueDate ? new Date(dueDate).toISOString() : existing.dueDate,
        updatedAt: now,
      };

      tasks[idx] = updatedTask;
      saveLocalStore(tasks);

      res.status(200).json({ success: true, task: updatedTask });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server Error updating task",
      error: error.message,
    });
  }
}

/**
 * DELETE /api/tasks/:id
 */
export async function deleteTask(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const isMongo = getIsMongoConnected();

    if (isMongo) {
      const deletedTask = await Task.findByIdAndDelete(id);
      if (!deletedTask) {
        res.status(404).json({ success: false, message: "Task not found" });
        return;
      }
      res.status(200).json({ success: true, message: "Task deleted successfully" });
    } else {
      const tasks = ensureLocalStore();
      const idx = tasks.findIndex((t: any) => t._id === id || t.id === id);

      if (idx === -1) {
        res.status(404).json({ success: false, message: "Task not found" });
        return;
      }

      tasks.splice(idx, 1);
      saveLocalStore(tasks);

      res.status(200).json({ success: true, message: "Task deleted successfully" });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server Error deleting task",
      error: error.message,
    });
  }
}
