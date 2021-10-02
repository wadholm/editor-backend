const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const passport = require("passport");
const session = require("express-session");
// const cookieSession = require("cookie-session");
const docsModel = require("./models/docs.js");

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server, {
    cors: {
        // origin: "https://www.student.bth.se",
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const index = require("./routes/index");
const docs = require('./routes/docs');
const users = require('./routes/users');
const auth = require('./routes/auth');

const port = process.env.PORT || 1337;

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined'));
}

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser("secretcode"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        secret: "secretcode",
        resave: true,
        saveUninitialized: true,
        cookie: { secure: false }
    })
);

app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);


app.use((req, res, next) => {
    next();
});

// app.post('/auth/login',
//     passport.authenticate('local'),
//     function(req, res) {
//         if (!req.user) {
//             res.send("No User Exists");
//         } else {
//             console.log(req.user);
//             res.send("Succesfully Authenticated");
//         }
//         // If this function gets called, authentication was successful.
//         // `req.user` contains the authenticated user.
//     //   res.redirect('/users/' + req.user.username);
//     });

app.post('/auth/login',
    (req, res, next) => {
        passport.authenticate("local", (err, user) => {
            if (err) {
                throw err;
            }
            if (!user) {
                res.send("No User Exists");
            } else {
                req.login(user, (err) => {
                    if (err) {
                        throw err;
                    }
                    res.send("Succesfully Authenticated");
                });
            }
        })(req, res, next);
    });

app.get("/auth/user", (req, res) => {
    res.send(req.user);
});

app.use('/', index);
app.use('/docs', docs);
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
                docsModel.updateFromSocket(data);
            }, 2000);
        }
    });
});

server.listen(port, () => {
    console.info(`Server is listening on port ${port}.`);
});

module.exports = server;
