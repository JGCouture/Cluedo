// server.js
import express from "express";
import { Server } from 'socket.io';
import cors from 'cors';
import http from 'http';
import crypto from 'crypto';

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"],
    },
});

server.listen(4000, () => {
    console.log("Server is running");
});


io.on('connection', (socket) => {
    socket.on("send_message", (message, room) => {
        socket.broadcast.emit("receive_message", message, room);
    });
});

io.on('connection', (socket) => {
    socket.on("send_start", (message) => {
        socket.broadcast.emit("receive_start", message);
    });
});

let characters = ["scarlet", "plum", "white", "green", "peacock", "mustard"];
let selected_characters = []
const a = [0,1,2,3,4,5]
const b = [0,1,2,3,4,5,6,7,8]
let random_weapons
let random_places 

function shuffle (arr){
    return arr.sort(() => Math.random() - 0.5)
}

random_weapons = shuffle(a)
random_places = shuffle(b)


io.on('connection', (socket) => {
    socket.on("character_map", (message) => {
        // selected_characters.push(message.on_map[1]);
     
        socket.broadcast.emit("receive_map", message);

        const index = characters.indexOf(message.on_map[1]);

        if (index !== -1) { // If the element is found
            // Remove the element at the found index
            characters.splice(index, 1);
        }

        socket.emit("send_backend", { "message_back": [characters,random_weapons, random_places]});

    });

});



io.on('connection', (socket) => {
    socket.on("send_move", (message) => {
        socket.broadcast.emit("receive_move", message);
    });
});


io.on('connection', (socket) => {
    socket.on("send_suggestion", (message) => {
        socket.broadcast.emit("receive_suggestion", message);
    });
});


io.on('connection', (socket) => {
    socket.on("send_noteCheck", (message) => {
        socket.broadcast.emit("receive_noteCheck", message);
    });
});


io.on('connection', (socket) => {
    socket.on("send_location_check", (message) => {
        socket.broadcast.emit("receive_location_check", message);
    });
});





