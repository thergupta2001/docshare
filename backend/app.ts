import express, { Express } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import mongoose from 'mongoose';

const app: Express = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const RoomSchema = new mongoose.Schema({
    roomId: { type: String, required: true, unique: true },
    // textContent: { type: String, default: "" }
    htmlContent: { type: String, default: "" }
})
const Room = mongoose.model('Room', RoomSchema);

const mongoURI = "mongodb://localhost:27017/docshare";
mongoose.connect(mongoURI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log("Error connecting ", err));

mongoose.connection.once('open', () => {
    console.log("MongoDB connection established");
    io.on("connection", (socket: Socket) => {
        console.log("A user connected: ", socket.id);

        socket.on("join-room", async (roomId: string) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room: ${roomId}`);

            const room = await Room.findOne({ roomId });
            if (!room) {
                await Room.create({ roomId }); // creates a room if it doesn't exist
            } else {
                socket.emit('initialize-content', room.htmlContent); // sends the initial content to the user
            }
        });

        socket.on("text-update", async ({ roomId, htmlContent, source }) => {
            await Room.findOneAndUpdate({ roomId }, { htmlContent });
            socket.to(roomId).emit("text-update", { htmlContent, source });
        })

        // socket.on("format-update", ({ roomId, formatCommand, value }) => {
        //     socket.to(roomId).emit("format-update", { formatCommand, value });
        // })

        socket.on("disconnect", () => {
            console.log("A user disconnected: ", socket.id);
        });
    })
});

server.listen(8080, () => {
    console.log("Server is running on port 8080 + socket.io");
});