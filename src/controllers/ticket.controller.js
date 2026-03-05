import Ticket from "./../models/ticket.model.js";

const getAllTickets = async (req, res) => {
  try {
    const {
      status,
      priority,
      search,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) filter.title = { $regex: search, $options: "i" };

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;
    const sortDir = order === "asc" ? 1 : -1;

    const [tickets, total] = await Promise.all([
      Ticket.find(filter)
        .populate("createdBy", "name email")
        .sort({ [sortBy]: sortDir })
        .skip(skip)
        .limit(limitNum),
      Ticket.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: tickets,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve tickets",
      error: error.message,
    });
  }
};

const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate(
      "createdBy",
      "name email",
    );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: `Ticket with ID "${req.params.id}" not found`,
      });
    }

    return res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve ticket",
      error: error.message,
    });
  }
};

const createTicket = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    const ticket = await Ticket.create({
      title,
      description,
      priority,
      status: "Open",
      createdBy: req.user._id,
    });

    await ticket.populate("createdBy", "name email");

    return res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      data: ticket,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create ticket",
      error: error.message,
    });
  }
};

const updateTicket = async (req, res) => {
  try {
    const { title, description, priority, status } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (priority !== undefined) updates.priority = priority;
    if (status !== undefined) updates.status = status;

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { returnDocument: "after", runValidators: true },
    ).populate("createdBy", "name email");
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: `Ticket with ID "${req.params.id}" not found`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ticket updated successfully",
      data: ticket,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update ticket",
      error: error.message,
    });
  }
};

const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: `Ticket with ID "${req.params.id}" not found`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ticket deleted successfully",
      data: { id: ticket._id },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete ticket",
      error: error.message,
    });
  }
};

export {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
};
