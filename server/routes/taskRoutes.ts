import { Router } from "express";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.ts";
import { taskValidationRules, validateRequest } from "../middleware/validator.ts";

const router = Router();

// Retrieve all tasks (supports query param filters/sorting)
router.get("/", getTasks);

// Retrieve a single task by ID
router.get("/:id", getTaskById);

// Create a new task
router.post("/", taskValidationRules, validateRequest, createTask);

// Update a task by ID
router.put("/:id", taskValidationRules, validateRequest, updateTask);

// Delete a task by ID
router.delete("/:id", deleteTask);

export default router;
