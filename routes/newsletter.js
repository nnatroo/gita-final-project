const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {

    const email = req.session.user ? req.session.user.email : null;
    res.render('newsletter', {email})
});

module.exports = router;
