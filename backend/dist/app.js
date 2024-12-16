"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const mongodb_1 = require("mongodb");
const mongo_adapter_1 = require("@socket.io/mongo-adapter");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
const mongoClient = new mongodb_1.MongoClient("mongodb://localhost:27017");
mongoClient.connect().then(() => {
    const db = mongoClient.db("docshare");
    const collection = db.collection("socket.io-adapter-events");
    io.adapter((0, mongo_adapter_1.createAdapter)(collection));
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("Error connecting to MongoDB: ", err);
});
io.on("connection", (socket) => {
    console.log("A user connected: ", socket.id);
    socket.on("join-room", (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room: ${roomId}`);
    });
    socket.on("text-update", ({ roomId, textContent, source }) => {
        io.to(roomId).emit("text-update", { textContent, source });
    });
    socket.on("disconnect", () => {
        console.log("A user disconnected: ", socket.id);
    });
});
server.listen(8080, () => {
    console.log("Server is running on port 8080 + socket.io");
});
