const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");

router.get('/', function (req, res, next) {
    if (req.session.user) {
        return res.redirect('/');
    }
    res.render('register', {error: null});
});

router.post('/', async function (req, res, next) {
    const {email, password, confirmPassword} = req.body;

    if (confirmPassword !== password) {
        res.render('register', {error: 'Passwords do not match'});
    }

    if (password.length < 8) {
        return res.render('register', {error: 'Password should contain 8 characters'});
    }

    try {
        const users = await User.find({email});

        if (users.length > 0) {
            return res.render('register', {error: 'Email already registered'});
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const newUser = new User({email, password: hashedPassword})
        await newUser.save();

        req.session.user = {email}

        res.redirect('/blogs');
    } catch (e) {
        console.log(e)
    }
});

module.exports = router;
