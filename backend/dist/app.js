"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
io.on("connection", (socket) => {
    console.log("A user connected: ", socket.id);
    socket.on("text-update", (data) => {
        console.log("Received text update: ", data);
        socket.broadcast.emit("text-update", data);
    });
    socket.on("disconnect", () => {
        console.log("A user disconnected: ", socket.id);
    });
    socket.off("text-update", () => {
        console.log("A user left: ", socket.id);
    });
});
server.listen(8080, () => {
    console.log("Server is running on port 8080 + socket.io");
});
