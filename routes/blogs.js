const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');


const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        console.log('No user found.');
        res.redirect('/login');
    }
}

router.get('/', requireAuth, async function (req, res, next) {
    const blogs = await Blog.find({});
    blogs.reverse();
    const email = req.session.user.email;

    res.render('blogs', {blogs, email});
});

router.get('/new', requireAuth, function (req, res, next) {
    const email = req.session.user.email;
    res.render('new_blog', {error: null, email});
});

router.post('/new', requireAuth, async function (req, res, next) {
    const {title, description, content} = req.body;
    const email = req.session.user.email;

    if (!title || !content) {
        res.render("new_blog", {error: "Missing title or content", email});
        return;
    }

    if (title.length > 20) {
        res.render("new_blog", {error: "Title length must be less than 20 characters", email});
        return;
    }

    // const blogs = JSON.parse(fs.readFileSync(BLOGS_FILE));
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];
    const currentMonthString = months[currentMonth];
    const formatedDate = `${currentDay} ${currentMonthString} ${currentYear}`;
    const newBlogData = {
        id: String(Date.now()),
        title,
        description,
        content,
        author: req.session.user.email,
        date: new Date().toLocaleString(),
        formatedDate
    }

    try {
        const newBlog = new Blog(newBlogData)
        await newBlog.save();

        res.redirect('/blogs');

    } catch (err) {
        console.log(err);
    }

});

router.get('/:blogId', requireAuth, async function (req, res, next) {
    const {blogId} = req.params;
    const {email} = req.session.user;

    try {
        const blogs = await Blog.find({})
        blogs.reverse();
        const blog = await Blog.findOne({id: blogId})

        res.render("blog", {email, blog, blogs});
    } catch (err) {
        console.log(err);
    }


})

router.post('/:blogId/newComment', requireAuth, async function (req, res, next) {
    const {blogId} = req.params;
    const {newComment} = req.body;

    try {
        const comment = {
            id: String(Date.now()),
            content: newComment,
            author: req.session.user.email,
            replies: [],
        }

        const result = await Blog.updateOne({id: blogId}, {$push: {comments: comment}})
        console.log(result);
    } catch (err) {
        console.error(err);
    }
    res.redirect(`/blogs/${blogId}`);
});


router.post('/:blogId/comment/:commentId/like', requireAuth, async function (req, res, next) {
    const {blogId, commentId} = req.params;
    const {email} = req.session.user;

    try {
        const blog = await Blog.findOne({id: blogId, "comments.id": commentId})
        const comment = blog.comments.find(comment => comment.id === commentId);
        const hasLiked = comment.likes && comment.likes.includes(email);

        const result = await Blog.updateOne({
            id: blogId,
            "comments.id": commentId
        }, hasLiked ? {$pull: {"comments.$.likes": email}} : {$addToSet: {"comments.$.likes": email}})
        console.log(result)
    } catch (err) {
        console.error(err);
    }
    res.redirect(`/blogs/${blogId}`);
});

router.post('/:blogId/comment/:commentId/reply', requireAuth, async function (req, res, next) {
    const {blogId, commentId} = req.params;
    const {email} = req.session.user;
    const {replyContent} = req.body;

    try {
        const reply = {
            content: replyContent,
            author: email
        }
        const result = await Blog.updateOne({
            id: blogId,
            "comments.id": commentId
        }, {
            $push: {
                "comments.$.replies": reply
            }
        })
        console.log(result);
    } catch (err) {
        console.error(err);
    }
    res.redirect(`/blogs/${blogId}`);
});

module.exports = router;
