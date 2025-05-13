const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    content: String,
    author: String,
    date: String,
    formatedDate: String,
});

const Blog = mongoose.model('Blog', blogSchema, "blogs");
module.exports = Blog;
