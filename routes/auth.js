/* eslint-disable no-unused-vars */
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
var express = require('express');
var router = express.Router();

const users = require("../models/users.js");
const auth = require("../models/auth.js");

router.post('/login',
    (req, res) => auth.login(req, res));

router.post('/register',
    (req, res) => users.addUser(req, res));


module.exports = router;
