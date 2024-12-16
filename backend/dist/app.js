"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
const RoomSchema = new mongoose_1.default.Schema({
    roomId: { type: String, required: true, unique: true },
    // textContent: { type: String, default: "" }
    htmlContent: { type: String, default: "" }
});
const Room = mongoose_1.default.model('Room', RoomSchema);
const mongoURI = "mongodb://localhost:27017/docshare";
mongoose_1.default.connect(mongoURI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log("Error connecting ", err));
mongoose_1.default.connection.once('open', () => {
    console.log("MongoDB connection established");
    io.on("connection", (socket) => {
        console.log("A user connected: ", socket.id);
        socket.on("join-room", (roomId) => __awaiter(void 0, void 0, void 0, function* () {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room: ${roomId}`);
            const room = yield Room.findOne({ roomId });
            if (!room) {
                yield Room.create({ roomId }); // creates a room if it doesn't exist
            }
            else {
                socket.emit('initialize-content', room.htmlContent); // sends the initial content to the user
            }
        }));
        socket.on("text-update", (_a) => __awaiter(void 0, [_a], void 0, function* ({ roomId, htmlContent, source }) {
            yield Room.findOneAndUpdate({ roomId }, { htmlContent });
            socket.to(roomId).emit("text-update", { htmlContent, source });
        }));
        // socket.on("format-update", ({ roomId, formatCommand, value }) => {
        //     socket.to(roomId).emit("format-update", { formatCommand, value });
        // })
        socket.on("disconnect", () => {
            console.log("A user disconnected: ", socket.id);
        });
    });
});
server.listen(8080, () => {
    console.log("Server is running on port 8080 + socket.io");
});
