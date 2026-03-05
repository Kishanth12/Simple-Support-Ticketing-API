import express from "express";
import {
  createTicketRules,
  filterTicketRules,
  mongoIdRule,
  updateTicketRules,
} from "../validators/ticket.validator.js";
import {
  createTicket,
  deleteTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
} from "../controllers/ticket.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Support ticket management
 *
 * components:
 *   schemas:
 *     Ticket:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64f1a2b3c4d5e6f7a8b9c0d1
 *         title:
 *           type: string
 *           example: Cannot login to dashboard
 *         description:
 *           type: string
 *           example: Getting a 403 error
 *         priority:
 *           type: string
 *           enum: [Low, Medium, High]
 *         status:
 *           type: string
 *           enum: [Open, In Progress, Resolved]
 *         statusBadge:
 *           type: string
 *           example: 🟢 Open
 *         createdBy:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             email:
 *               type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */

router.use(protectRoute);

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Get all tickets
 *     tags: [Tickets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - { in: query, name: status, schema: { type: string, enum: [Open, In Progress, Resolved] } }
 *       - { in: query, name: priority, schema: { type: string, enum: [Low, Medium, High] } }
 *       - { in: query, name: search, schema: { type: string } }
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 10 } }
 *       - { in: query, name: sortBy, schema: { type: string, default: createdAt } }
 *       - { in: query, name: order, schema: { type: string, enum: [asc, desc], default: desc } }
 *     responses:
 *       200:
 *         description: List of tickets with pagination
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Invalid query params
 *
 *   post:
 *     summary: Create a ticket (status defaults to Open)
 *     tags: [Tickets]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Ticket title
 *               description:
 *                 type: string
 *                 example: Ticket description
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *                 default: Low
 *     responses:
 *       201:
 *         description: Ticket created
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation failed
 */
router.get("/", filterTicketRules, getAllTickets);
router.post("/", createTicketRules, createTicket);

/**
 * @swagger
 * /tickets/{id}:
 *   get:
 *     summary: Get a ticket by ID
 *     tags: [Tickets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string }, example: 64f1a2b3c4d5e6f7a8b9c0d1 }
 *     responses:
 *       200:
 *         description: Ticket found
 *       400:
 *         description: Invalid ID format
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Ticket not found
 *
 *   put:
 *     summary: Update a ticket
 *     tags: [Tickets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string }, example: 64f1a2b3c4d5e6f7a8b9c0d1 }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *               status:
 *                 type: string
 *                 enum: [Open, In Progress, Resolved]
 *     responses:
 *       200:
 *         description: Ticket updated
 *       400:
 *         description: Invalid ID format
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Ticket not found
 *       422:
 *         description: Validation failed
 *
 *   delete:
 *     summary: Delete a ticket
 *     tags: [Tickets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string }, example: 64f1a2b3c4d5e6f7a8b9c0d1 }
 *     responses:
 *       200:
 *         description: Ticket deleted
 *       400:
 *         description: Invalid ID format
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Ticket not found
 */
router.get("/:id", mongoIdRule, getTicketById);
router.put("/:id", [...mongoIdRule, ...updateTicketRules], updateTicket);
router.delete("/:id", mongoIdRule, deleteTicket);

export default router;
