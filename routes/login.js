const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    res.render('login', { error: null });
});

module.exports = router;
