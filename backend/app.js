import path from "path";
import http from "http";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

connectDB(); // Connect to MongoDB

const app = express();
import { Server } from "socket.io";
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
      },
});


// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser middleware
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

let connectedUsers = [];

io.on("connection", (socket) => {
    connectedUsers.push(socket.id);

  console.log("Connected Users: ", connectedUsers);

  socket.on("disconnect", () => {
    const newConnectedUsers = connectedUsers.filter((peerSocketId) => {
        return peerSocketId !== socket.id;
    });
  
      connectedUsers = newConnectedUsers;

      console.log("new users after disconnection", connectedUsers);
  });
});

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
