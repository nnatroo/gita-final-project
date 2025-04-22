const express = require('express');
const {request, json} = require("express");
const fs = require("fs")
const router = express.Router();
const bcrypt = require("bcryptjs");

const USERS_FILE = "users.json"

router.get('/', function (req, res, next) {
    if (req.session.user) {
        return res.redirect('/blogs');
    }
    res.render('register', {error: null});
});

router.post('/', function (req, res, next) {
    const {email, password, confirmPassword} = req.body

    if (password !== confirmPassword) {
        res.render('register', {error: "Passwords don't match"});
    }

    const data = fs.readFileSync(USERS_FILE)
    const users = JSON.parse(data)

    const emailExist = users.find(user => user.email === email);
    if (emailExist) {
        return res.render('register', {error: `Email already registered`});
    }

    if (password.length < 8) {
        return res.render('register', {error: `Passwords should contain at least 8 characters`});
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    users.push({email, password: hashedPassword});
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))

    res.render('register', {error: null});
});


module.exports = router;
