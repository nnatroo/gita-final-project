const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
    id: String,
    email: String,
    date: {type: Date, default: Date.now},
});

const Newsletter = mongoose.model('Newsletter', newsletterSchema, "newslettters");
module.exports = Newsletter;
