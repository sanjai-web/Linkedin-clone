import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/home.css"

export default function LinkedInPostingPage() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:3001/posts');
      setPosts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreatePost = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('file', file);

    try {
      await axios.post('http://127.0.0.1:3001/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      fetchPosts();
      setTitle('');
      setContent('');
      setFile(null);
      alert('Post created successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to create post');
    }
  };

  const handleEditPost = async (postId, event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('file', file);

    try {
      await axios.put(`http://127.0.0.1:3001/posts/${postId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      fetchPosts();
      setTitle('');
      setContent('');
      setFile(null);
      alert('Post updated successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to update post');
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://127.0.0.1:3001/posts/${postId}`);
      fetchPosts();
      alert('Post deleted successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to delete post');
    }
  };

  return (
    <div className='container1'>
      <form>
        <div>
          <textarea 
            className='textarea1' 
            placeholder='Start a Post'
            style={{ minWidth: '200px' }} 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
          />
          <div>
            <label>Upload a file:</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          </div>
          <br />
          <button type="button" onClick={handleCreatePost}>Create Post</button>
        </div>
      </form>
      <div>
        {posts.map(post => (
          <div key={post.id} style={{ margin: '20px' }}>
            <div>
              <strong>Content:</strong> {post.content}<br />
              {/* <strong>File:</strong> 
              {post.filePath && typeof post.filePath === 'string' ? (
                post.filePath.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                  <img src={post.filePath} alt="Post" style={{ width: '100px', height: '100px' }} />
                ) : (
                  <a href={post.filePath} target="_blank" rel="noopener noreferrer">View File</a>
                )
              ) : 'No file uploaded'} */}
            </div>
            <div>
              <button className='but2' onClick={(e) => handleEditPost(post.id, e)}>Edit</button>
              <button className='but4' onClick={() => handleDeletePost(post.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
