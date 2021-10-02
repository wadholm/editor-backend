var express = require('express');
var router = express.Router();

const docs = require("../models/docs.js");

router.get('/',
    (req, res) => docs.readAll(res)
);

router.get('/:email',
    (req, res) => docs.getAllowedDocs(req.params.email, res)
);

router.put('/add',
    (req, res) => docs.addDoc(req, res)
);

router.put('/update',
    (req, res) => docs.updateDoc(req, res)
);

// router.post('/',
//     (req, res) => docs.addOne(req, res)
// );

// router.put('/',
//     (req, res) => docs.updateOne(req, res)
// );


module.exports = router;
