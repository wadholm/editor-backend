require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const visual = false;
const { graphqlHTTP } = require('express-graphql');
const {
    GraphQLSchema
} = require("graphql");

const RootQueryType = require("./graphql/root.js");

// const database = require("./db/dbusers.js");
const usersModel = require("./models/users.js");

// eslint-disable-next-line no-unused-vars
const { devUrl, prodUrl, token } = require("./variables");

const ENDPOINT = devUrl;

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
const codes = require('./routes/codes');

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

// const schema = new GraphQLSchema({
//     query: new GraphQLObjectType({
//         name: "HelloWorld",
//         fields: () => ({
//             message: {
//                 type: GraphQLString,
//                 resolve: () => "Hello World"
//             }
//         })
//     })
// });

const schema = new GraphQLSchema({
    query: RootQueryType
});

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: visual,
}));


app.post('/sendmail', (req, res) => {
    let registerUrl = `http://localhost:3000/?register=${req.body.recipient}`;
    // let registerUrl = `${ENDPOINT}/~mack20/editor/?register=${req.body.recipient}`;

    const msg = {
        to: req.body.recipient, // Change to your recipient
        from: 'malin.wadholm@gmail.com', // Change to your verified sender
        subject: `Invitation! ${req.body.sender} has shared a document with you`,
        text: (
            `${req.body.sender} has invited you to edit a document. ` +
            `If you don't have an account you must register first.` +
            `Register here`
        ),
        html: (
            `<body style="
            background=#FFFFFF;
            font-family: Helvetica Neue, sans-serif;
            width: 90%;
            color:rgb(40, 40, 40);
            margin: auto;">`+
            `<div style="
            border-radius: 2%;
            width: 75%;
            box-shadow: 0 8px 16px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%);
            margin: 2em auto;">` +
            `<div style="padding: 2em;">` +
            `<h2>Hello! </h2>`+
            `<p>${req.body.sender} has invited you to edit a document. </p>` +
            `<p>If you don't have an account you must register first. </p>`+
            `<p>
            <a href="${registerUrl}" style="
            text-decoration: none;
            color: white;
            background-color: #2d7cfc;
            border-radius: 5px;
            border: none;
            color: white;
            padding: 0.8em 1.8em;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            cursor: pointer;
            font-size: 1em;">Register here</a>` +
            `</p>`+
            `</div></div>`+
            `<p style="text-align: right; padding-top: 1em;">Editor © Malin Wadholm 2021</p>`+
            `</body>`
        ),
    };

    sgMail
        .send(msg)
        .then(() => {
            console.info('Email sent');
        })
        .catch((error) => {
            console.error(error);
        });
    res.send('Successfully sent email!');
});

app.use('/', index);
app.use('/docs', docs);
app.use('/prevdocs', prevdocs);
app.use('/users', users);
app.use('/auth', auth);
app.use('/codes', codes);

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
