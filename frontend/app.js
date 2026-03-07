import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import next from "next";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./backend/src/routes/auth.js";
import postRoutes from "./backend/src/routes/posts.js";
import commentRoutes from "./backend/src/routes/comments.js";

dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || 5000;

// Initialize Express
const app = express();

// Create HTTP server
const httpServer = http.createServer(app);

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  },
});

// Attach io to app
app.set("io", io);

// Socket connection
io.on("connection", (socket) => {
  console.log(`⚡ Socket connected: ${socket.id}`);

  socket.on("join:user", (userId) => {
    if (userId) {
      socket.join(`user:${userId}`);
      console.log(`👤 User ${userId} joined room`);
    }
  });

  socket.on("disconnect", () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

// Initialize Next.js
const nextServer = next({ dev });
const handle = nextServer.getRequestHandler();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Inkfinity API is running.",
  });
});

// API 404
app.all("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error." });
});

// Next.js page handling
app.all("*", (req, res) => {
  return handle(req, res);
});

// MongoDB connection + server start
mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB");

    await nextServer.prepare();

    httpServer.listen(PORT, () => {
      console.log(`🚀 Inkfinity Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });