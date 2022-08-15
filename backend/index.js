const express = require('express');
const app = express();
const mongoose = require('mongoose');
app.listen(3000);
// const io = require('socket.io')(expressServer, {
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"]
//       }
// });
const uri = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.4';

mongoose.connect(
	uri,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	},
	() => {
		console.log('db connected');
	}
);


const PlayerSchema = new mongoose.Schema({
    currentWordIndex : {
        type: Number,
        default : 0
    },
    socketID : {type : String},
    isPartyLeader : {type : Boolean,default : false},
    WPM : {type : Number, default: -1},
    nickName : {type : String}
});

const GameSchema = new mongoose.Schema({
    words : [{type : String}],
    isOpen : {type : Boolean,default : true},
    isOver : {type : Boolean,default : false},
    players : [PlayerSchema],
    startTime : {type : Number}
});

const Game = mongoose.model('Game',GameSchema);

// io.on('connection',  (socket) => {
// 	console.log('connected to a user');
// 	socket.on('disconnect', () => {
// 		console.log('user disconnected');
// 	});

// 	socket.on('message', async (msg) => {
// 		let game = new Game();

//         game.words.push(msg);

//         console.log(game);

//         game = await game.save();

//         console.log(game)
// 	});
// });

const wordsArray = [];
let word = [];


fetch('https://api.quotable.io/random?minLength=250&maxLength=280').then(
            response => response.json()
        ).then(data => {

            data.content.split('').map((item) => {
                word.push({
                    text:item,
                    isActive: false,
                    isWrong:false
                });
                if(item == ' '){
                    wordsArray.push(word);
                    word = [];
                }
                
            })
        }).catch(err => {
            console.log(err);
        });


app.get('/', (req,res) => {
    console.log('get req is made');
    res.send('is this working');
})