var express = require('express');
var router = express.Router();

const codes = require("../models/codes.js");

// router.get('/',
//     (req, res) => codes.readAll(res)
// );

router.get('/:email',
    (req, res) => codes.getAllowedCodes(req.params.email, res)
);

router.put('/add',
    (req, res) => codes.addCode(req, res)
);

router.put('/update',
    (req, res) => codes.updateCode(req, res)
);

router.put('/add/allowed_user',
    (req, res) => codes.addAllowedUser(req, res)
);

// router.post('/',
//     (req, res) => docs.addOne(req, res)
// );

// router.put('/',
//     (req, res) => docs.updateOne(req, res)
// );


module.exports = router;
