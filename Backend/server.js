// server.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('E:/StartUp/Website-clone/Backend/uploads'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once('open', () => console.log('Connected to MongoDB'));

// Define mongoose schema and model
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  role: String,
});
const User = mongoose.model('User', userSchema);

const postSchema = new mongoose.Schema({
  description: String,
  mediaUrl: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User model
});
const Post = mongoose.model('Post', postSchema);

// Define mongoose schema and model for messages
const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  timestamp: { type: Date, default: Date.now },
});
const Message = mongoose.model('Message', messageSchema);

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'E:/StartUp/Website-clone/Backend/uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
};

// Post endpoints
// Create a post
app.post('/posts', verifyToken, upload.single('media'), async (req, res) => {
  const { description } = req.body;
  const mediaUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const decoded = jwt.verify(req.token, 'secretkey');
    const newPost = new Post({
      description,
      mediaUrl,
      user: decoded.userId,
    });
    await newPost.save();
    res.status(201).json({ message: 'Post created successfully' });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get all posts
app.get('/posts', verifyToken, async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'firstName lastName email');
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get a single post
app.get('/posts/:postId', verifyToken, async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId).populate('user', 'firstName lastName email');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update a post
app.put('/posts/:postId', verifyToken, upload.single('media'), async (req, res) => {
  const { postId } = req.params;
  const { description } = req.body;
  const mediaUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    let updatedPost = await Post.findById(postId);
    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    updatedPost.description = description;
    updatedPost.mediaUrl = mediaUrl;
    await updatedPost.save();
    res.json({ message: 'Post updated successfully' });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete a post
app.delete('/posts/:postId', verifyToken, async (req, res) => {
  const { postId } = req.params;

  try {
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Signup endpoint
app.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ firstName, lastName, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: 'Signup successful' });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ userId: user._id }, 'secretkey', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Fetch user details
app.get('/user', verifyToken, async (req, res) => {
  try {
    const decoded = jwt.verify(req.token, 'secretkey');
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update user password
app.put('/user/password', verifyToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const decoded = jwt.verify(req.token, 'secretkey');
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Send a message
app.post('/messages', verifyToken, async (req, res) => {
  const { receiverId, message } = req.body;

  try {
    const decoded = jwt.verify(req.token, 'secretkey');
    const newMessage = new Message({
      senderId: decoded.userId,
      receiverId,
      message,
    });
    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Fetch user messages
app.get('/messages', verifyToken, async (req, res) => {
  try {
    const decoded = jwt.verify(req.token, 'secretkey');
    const messages = await Message.find({
      $or: [{ senderId: decoded.userId }, { receiverId: decoded.userId }],
    }).populate('senderId receiverId', 'firstName lastName email');

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
