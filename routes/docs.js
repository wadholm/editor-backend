var express = require('express');
var router = express.Router();

const docs = require("../models/docs.js");

router.get('/',
    (req, res) => docs.readAll(req, res)
);

router.get('/:id',
    (req, res) => docs.readOne(req, res)
);

router.post('/',
    (req, res) => docs.addOne(req, res)
);

router.put('/',
    (req, res) => docs.updateOne(req, res)
);


module.exports = router;
