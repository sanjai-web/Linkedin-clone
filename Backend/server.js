const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

let posts = []; // In-memory data storage for posts

// Get all posts
app.get('/posts', (req, res) => {
  res.json(posts);
});

// Create a new post
app.post('/posts', upload.single('file'), (req, res) => {
  const { title, content } = req.body;
  const filePath = req.file ? `/uploads/${req.file.filename}` : null;
  const newPost = { id: Date.now(), title, content, filePath };
  posts.push(newPost);
  res.status(201).json(newPost);
});

// Update an existing post
app.put('/posts/:id', upload.single('file'), (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const filePath = req.file ? `/uploads/${req.file.filename}` : null;
  const postIndex = posts.findIndex(post => post.id == id);

  if (postIndex === -1) {
    return res.status(404).json({ message: 'Post not found' });
  }

  posts[postIndex] = {
    ...posts[postIndex],
    title,
    content,
    filePath: filePath || posts[postIndex].filePath,
  };

  res.json(posts[postIndex]);
});

// Delete an existing post
app.delete('/posts/:id', (req, res) => {
  const { id } = req.params;
  const postIndex = posts.findIndex(post => post.id == id);

  if (postIndex === -1) {
    return res.status(404).json({ message: 'Post not found' });
  }

  // Delete the file if exists
  if (posts[postIndex].filePath) {
    const filePath = path.join(__dirname, posts[postIndex].filePath);
    fs.unlink(filePath, err => {
      if (err) console.error(err);
    });
  }

  posts.splice(postIndex, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
