const express = require('express');
const router = express.Router();
const fs = require('fs');
const bcrypt =  require("bcryptjs");

const USERS_FILE = 'users.json';

router.get('/', function(req, res, next) {
    if (req.session.user) {
        return res.redirect('/');
    }
    res.render('register', { error: null });
});

router.post('/', function(req, res, next) {
    const { email, password, confirmPassword } = req.body;

    if (confirmPassword !== password) {
        res.render('register', { error: 'Passwords do not match' });
    }

    let users = [];

    if (fs.existsSync(USERS_FILE)) {
        const data = fs.readFileSync(USERS_FILE);
        users = JSON.parse(data);
    }

    const emailExists = users.find(user => user.email === email);
    if (emailExists) {
        return res.render('register', { error: 'Email already registered' });
    }

    if (password.length < 8) {
        return res.render('register', { error: 'Password should contain 8 characters' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    users.push({ email, password: hashedPassword });
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    req.session.user = { email }

    res.redirect('/blogs');
});

module.exports = router;