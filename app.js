require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require('body-parser');
// const docsModel = require("./models/docs.js");
const usersModel = require("./models/users.js");
// eslint-disable-next-line no-unused-vars
const { devUrl, prodUrl, token } = require("./variables");

const ENDPOINT = prodUrl;

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server, {
    cors: {
        // origin: "https://www.student.bth.se",
        origin: ENDPOINT,
        methods: ["GET", "POST"]
    }
});

const index = require("./routes/index");
const docs = require('./routes/docs');
const prevdocs = require('./routes/prevdocs');
const users = require('./routes/users');
const auth = require('./routes/auth');

const port = process.env.PORT || 1337;

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined'));
}

app.use(cors({
    origin: ENDPOINT,
    credentials: true
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    next();
});

app.use('/', index);
app.use('/docs', docs);
app.use('/prevdocs', prevdocs);
app.use('/users', users);
app.use('/auth', auth);

io.on('connection', socket => {
    let prevID;

    socket.on('create', room => {
        socket.leave(prevID);
        socket.join(room);
        prevID = room;
    });

    let throttleTimer;

    socket.on("update", data => {
        socket.to(data._id).emit("update", data);
        if (data._id !== "") {
            clearTimeout(throttleTimer);
            throttleTimer = setTimeout(function() {
                console.log(data);
                usersModel.updateFromSocket(data);
            }, 2000);
        }
    });
});

server.listen(port, () => {
    console.info(`Server is listening on port ${port}.`);
});

module.exports = server;
