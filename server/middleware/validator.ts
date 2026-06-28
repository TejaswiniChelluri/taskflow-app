import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

// Validation rules for Task CRUD operations
export const taskValidationRules = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title must be under 100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long"),

  body("priority")
    .optional()
    .isIn(["High", "Medium", "Low"])
    .withMessage("Priority must be High, Medium, or Low"),

  body("status")
    .optional()
    .isIn(["Pending", "In Progress", "Completed"])
    .withMessage("Status must be Pending, In Progress, or Completed"),

  body("category")
    .optional()
    .isIn(["Work", "Personal", "Study", "Shopping", "Health"])
    .withMessage("Category must be Work, Personal, Study, Shopping, or Health"),

  body("dueDate")
    .notEmpty()
    .withMessage("Due date is required")
    .custom((value) => {
      const inputDate = new Date(value);
      if (isNaN(inputDate.getTime())) {
        throw new Error("Invalid date format");
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      inputDate.setHours(0, 0, 0, 0);
      if (inputDate < today) {
        throw new Error("Due date cannot be in the past");
      }
      return true;
    }),
];

// Middleware to capture and return validation errors
export function validateRequest(req: Request, res: Response, next: NextFunction): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: errors.array().map((err) => ({
        field: err.type === "field" ? err.path : "field",
        message: err.msg,
      })),
    });
    return;
  }
  next();
}
