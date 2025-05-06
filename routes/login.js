const express = require('express');
const fs = require("fs");
const router = express.Router();
const bcrypt =  require("bcryptjs");

const USERS_FILE = 'users.json';

router.get('/', function(req, res, next) {
    if (req.session.user) {
        return res.redirect('/');
    }
    res.render('login', { error: null });
});

router.post('/', function(req, res, next) {
    const { email, password } = req.body;

    const data = fs.readFileSync(USERS_FILE);
    const users = JSON.parse(data);

    const user = users.find(user => user.email === email)

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.render('login', {error: 'Invalid email or password'});
    }

    req.session.user = { email: user.email }

    res.redirect(`/blogs`)
})

module.exports = router;
