var express = require('express');
var router = express.Router();

const users = require("../models/users.js");

router.get('/',
    (req, res) => users.readAll(res)
);

router.delete('/',
    (req, res) => users.deleteOne(req, res)
);

// router.get('/:id',
//     (req, res) => users.readOne(req.params.id, res)
// );

// router.post('/',
//     (req, res) => users.addUser(req, res)
// );

// router.put('/',
//     (req, res) => users.updateUserPassword(req, res)
// );

// router.put('/add/allowed_user',
//     (req, res) => users.addAllowedUser(req, res)
// );

// router.put('/add/code',
//     (req, res) => users.addCode(req, res)
// );

module.exports = router;
