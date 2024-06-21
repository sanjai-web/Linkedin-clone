const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  description: String,
  mediaUrl: String,
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
