import express, { Express } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';

const app: Express = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on("connection", (socket: Socket) => {
    console.log("A user connected: ", socket.id);

    socket.on("text-update", (data: string) => {
        console.log("Received text update: ", data);
        socket.broadcast.emit("text-update", data);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected: ", socket.id);
    });
})

server.listen(8080, () => {
    console.log("Server is running on port 8080 + socket.io");
});