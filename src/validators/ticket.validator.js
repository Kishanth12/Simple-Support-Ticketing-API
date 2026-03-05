import { body, param, query } from "express-validator";
import { handleValidationErrors } from "./auth.validator.js";

const VALID_STATUSES = ["Open", "In Progress", "Resolved"];
const VALID_PRIORITIES = ["Low", "Medium", "High"];

const createTicketRules = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),

  body("description")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),

  body("priority")
    .optional()
    .isIn(VALID_PRIORITIES)
    .withMessage(`Priority must be one of: ${VALID_PRIORITIES.join(", ")}`),

  body("status")
    .not()
    .exists()
    .withMessage("Status cannot be set on ticket creation — defaults to Open"),

  handleValidationErrors,
];

const updateTicketRules = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),

  body("description")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),

  body("priority")
    .optional()
    .isIn(VALID_PRIORITIES)
    .withMessage(`Priority must be one of: ${VALID_PRIORITIES.join(", ")}`),

  body("status")
    .optional()
    .isIn(VALID_STATUSES)
    .withMessage(`Status must be one of: ${VALID_STATUSES.join(", ")}`),

  body().custom((_, { req }) => {
    const allowed = ["title", "description", "priority", "status"];
    const provided = Object.keys(req.body).filter((k) => allowed.includes(k));
    if (provided.length === 0) {
      throw new Error(
        "At least one field (title, description, priority, status) must be provided",
      );
    }
    return true;
  }),

  handleValidationErrors,
];

const filterTicketRules = [
  query("status")
    .optional()
    .isIn(VALID_STATUSES)
    .withMessage(`Status filter must be one of: ${VALID_STATUSES.join(", ")}`),

  query("priority")
    .optional()
    .isIn(VALID_PRIORITIES)
    .withMessage(
      `Priority filter must be one of: ${VALID_PRIORITIES.join(", ")}`,
    ),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer")
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100")
    .toInt(),

  handleValidationErrors,
];

const mongoIdRule = [
  param("id").isMongoId().withMessage("Invalid ticket ID format"),

  handleValidationErrors,
];

export { createTicketRules, updateTicketRules, filterTicketRules, mongoIdRule };
