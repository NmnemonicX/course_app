const express  = require('express');
const cors = require('cors');
const formData = require("express-form-data");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');


const indexRouter = require('./routers/index');
const usersRouter = require('./routers/users');
const advertisementRouter = require('./routers/advertisement');
const chatRouter = require('./routers/chat');


const app = express();

app.use(bodyParser());
app.use(cors());


app.use('/', indexRouter);
app.use('/users', usersRouter);
//app.use('/public', express.static(__dirname + '/public'));
app.use('/advertisements', advertisementRouter);
app.use('/chat', chatRouter);







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



