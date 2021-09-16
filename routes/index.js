var express = require('express');
var router = express.Router();

router.get("/", (req, res) => {
    const data = {
        data: {
            msg: "This is the index page"
        }
    };

    res.json(data);
});

module.exports = router;
