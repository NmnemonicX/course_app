const express  = require('express');
const cors = require('cors');
const formData = require("express-form-data");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const http = require('http');
const socketIO = require('socket.io');

const Chatservice = require('./models/Chat.service');

const User = require('./models/Users')
const userService = require('./models/User.service');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const expressSession = require('express-session')

let bcrypt = require('bcrypt');

const indexRouter = require('./routers/index');
const usersRouter = require('./routers/users');
const advertisementRouter = require('./routers/advertisement');
const chatRouter = require('./routers/chat');


async function verify(email, password, done) {
    User.findOne({email: email})
        .then(
            user => {
                console.log('login...', user)
                if (user) {
                    bcrypt.compare(password,
                        user.passwordHash,
                        (err, isMatch) => {
                            if (err) throw err;

                            if (isMatch) {
                                return done(null, user);
                            } else {
                                return done(null, false, {message: "Пароль не подходит"});
                            }
                        })
                }
            }
        )
        .catch(err => {
            return done(null, false, {message: err});
        })
}

const options = {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: false,
}


passport.use('local', new LocalStrategy(options, verify)); //  Добавление стратегии для использования

// Конфигурирование Passport для сохранения пользователя в сессии
passport.serializeUser(function (user, cb) {
    cb(null, user.id)
})

passport.deserializeUser(async function (id, cb) {
    const user = await User.findById(id);
        cb(null, user)

})


const app = express();
const server = http.Server(app);
const io = socketIO(server);


app.use(bodyParser());
app.use(cors());

app.use('/public', express.static(__dirname + '/public'));

app.use(require('express-session')({
    secret: process.env.COOKIE_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
}))

app.use(passport.initialize(undefined))
app.use(passport.session(undefined))

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/advertisements', advertisementRouter);
app.use('/chat', chatRouter);



//тут сокет
io.on('connection', (socket) => {
    const {id} = socket;
    console.log(`Socket connected: ${id}`);

    // работа с комнатами  Чат это комната
    const {ChatId} = socket.handshake.query;
    console.log(`Socket roomName: ${ChatId}`);
    socket.join(ChatId);



    socket.on('getHistory', async (msg) => {
        msg.type = `room: ${ChatId} + gethistory`;
        const author = msg.author
        const receiver = msg.receiver
        console.log('receiver', msg.receiver);
        console.log('author', msg.author);
        const chat = await Chatservice.find({users:[author,receiver]})
        console.log('chat');
        console.log(chat);
        const history = await Chatservice.getHistory(chat._id)
        console.log('history');
        console.log(history);
        socket.to(chat._id).emit('chatHistory', history);
        socket.emit('chatHistory', history);
    });


    socket.on('sendMessage', async (msg) => {
        msg.type = 'newMessage ';
        console.log('receiver', msg.receiver);
        console.log('author', msg.author);
        console.log('text', msg.text);
        const Message = await Chatservice.sendMessage({author:msg.author, receiver:msg.receiver, text:msg.text})
        const chat = await Chatservice.find({users:[msg.author,msg.receiver]})

        if(!socket.rooms[chat._id]) {
            socket.join(chat._id);
        }
        socket.to(chat._id).emit('newMessage ', Message);
        socket.emit('newMessage ', Message);
    });


    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${id}`);
    })
})

const PORT = process.env.PORT||3000;
const UserDB = process.env.DB_USERNAME || 'root';
const PasswordDB = process.env.DB_PASSWORD || '12345';
const NameDB = process.env.DB_NAME || 'course_database';
const HostDB = process.env.DB_HOST || 'mongodb://localhost:27017/';

async function start() {
    try {
        await mongoose.connect(HostDB, {
            user: UserDB,
            pass: PasswordDB,
            dbName: NameDB,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });


        // app.listen(PORT, () => {
        //     console.log(`Server is running, go to http://localhost:${PORT}/`)
        // });
        server.listen(PORT, () => {
            console.log(`Server is running, go to http://localhost:${PORT}/`)
        });
    } catch (e) {
        console.log(e);
    }
}
start();



