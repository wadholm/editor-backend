var express = require('express');
var router = express.Router();

const docs = require("../models/docs.js");

router.get('/',
    (req, res) => docs.readAll(res)
);

router.get('/:id',
    (req, res) => docs.readOne(req.params.id, res)
);

router.post('/',
    (req, res) => docs.addOne(req, res)
);

router.put('/',
    (req, res) => docs.updateOne(req, res)
);


module.exports = router;
