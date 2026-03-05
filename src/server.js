import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import { swaggerDocs } from "./config/swagger.js";

dotenv.config();
connectDb();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
swaggerDocs(app, port);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
