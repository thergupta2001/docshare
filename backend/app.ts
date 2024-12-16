import express, { Express } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { MongoClient } from 'mongodb';
import { createAdapter } from '@socket.io/mongo-adapter';

const app: Express = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const mongoClient = new MongoClient("mongodb://localhost:27017");
mongoClient.connect().then(() => {
    const db = mongoClient.db("docshare");
    const collection = db.collection("socket.io-adapter-events");
    io.adapter(createAdapter(collection));
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("Error connecting to MongoDB: ", err);
});

io.on("connection", (socket: Socket) => {
    console.log("A user connected: ", socket.id);

    socket.on("join-room", (roomId: string) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room: ${roomId}`);
    });

    socket.on("text-update", ({ roomId, textContent, source }) => {
        io.to(roomId).emit("text-update", { textContent, source });
    })

    socket.on("disconnect", () => {
        console.log("A user disconnected: ", socket.id);
    });
})

server.listen(8080, () => {
    console.log("Server is running on port 8080 + socket.io");
});