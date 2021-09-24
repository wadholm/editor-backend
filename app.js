const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require('body-parser');

const docsModel = require("./models/docs.js");

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server, {
    cors: {
        origin: "https://www.student.bth.se",
        // origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const index = require("./routes/index");
const docs = require('./routes/docs');

const port = process.env.PORT || 1337;

app.use(cors());

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    next();
});

app.use(express.json());

app.use('/', index);
app.use('/docs', docs);

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
                docsModel.updateFromSocket(data);
            }, 2000);
        }
    });
});

server.listen(port, () => {
    console.info(`Server is listening on port ${port}.`);
});

module.exports = server;
