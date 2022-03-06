const express  = require('express');
const cors = require('cors');
const formData = require("express-form-data");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

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

app.use(bodyParser());
app.use(cors());



app.use(require('express-session')({
    secret: process.env.COOKIE_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
}))

app.use(passport.initialize(undefined))
app.use(passport.session(undefined))

app.use('/', indexRouter);
app.use('/users', usersRouter);
//app.use('/public', express.static(__dirname + '/public'));
app.use('/advertisements', advertisementRouter);
app.use('/chat', chatRouter);



//тут сокет




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


        app.listen(PORT, () => {
            console.log(`Server is running, go to http://localhost:${PORT}/`)
        });
    } catch (e) {
        console.log(e);
    }
}
start();



