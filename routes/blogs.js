const express = require('express');
const router = express.Router();

const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

router.get('/', requireAuth, function (req, res, next) {
    res.render('blogs', {error: null});
});

module.exports = router;
