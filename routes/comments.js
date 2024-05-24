const express = require('express');
const router = express.Router();
const comments = require('../data/comments.js')


router.get("/", (req, res) => {
    res.send(comments);
})

router.get("/:id", (req, res) => {
    const comment = comments.find((c) => c.id == req.params.id);
    res.json(comment);
})

module.exports = router;