const express = require('express');
const router = express.Router();
const fs = require("fs")

const BLOGS_FILE = "blogs.json";

const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        console.log(req.session.user);
        res.redirect('/login');
    }
}

router.get('/', requireAuth, function (req, res, next) {
    const data = fs.readFileSync(BLOGS_FILE)
    const blogs = JSON.parse(data)


    res.render('blogs', {error: null, blogs});

});

router.get('/new', requireAuth, function (req, res, next) {
    res.render('new_blog', {error: null});
});

router.post('/new', requireAuth, function (req, res, next) {
    const {title, content} = req.body;
    if (!title || !content) {
        res.render('new_blog', {error: `Missing title or content`});
    }

    const data = fs.readFileSync(BLOGS_FILE)
    const blogs = JSON.parse(data)

    const newBlog = {
        id: String(Date.now()),
        title,
        content,
        author: req.session.user.email,
        date: new Date().toLocaleString()
    }
    blogs.push(newBlog);
    fs.writeFileSync(BLOGS_FILE, JSON.stringify(blogs, null, 2));

    res.redirect("/blogs");
})

module.exports = router;
