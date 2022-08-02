const express = require('express');
const app = express();
const socketio = require('socket.io');
const mongoose = require('mongoose');

const expressServer = app.listen(3001);
const io = socketio(expressServer);


io.on('connection', (socket) =>{
    console.log('connected to a user');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    })
    
    socket.on('message',(msg) => {
        console.log(msg)
    })
})