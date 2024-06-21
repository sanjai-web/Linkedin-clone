import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPostId, setCurrentPostId] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3001/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleCreateOrUpdatePost = async () => {
    if (currentPostId) {
      await handleUpdatePost(currentPostId);
    } else {
      await handleCreatePost();
    }
  };

  const handleCreatePost = async () => {
    const formData = new FormData();
    formData.append("description", description);
    if (media) {
      formData.append("media", media);
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3001/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      fetchPosts();
      setDescription("");
      setMedia(null);
      alert("Post created successfully");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post");
    }
  };

  const handleEditPost = async (postId) => {
    try {
      const response = await axios.get(`http://localhost:3001/posts/${postId}`);
      const { description } = response.data;
      setDescription(description);
      setMedia(null); // Reset media input for editing
      setCurrentPostId(postId);
    } catch (error) {
      console.error("Error editing post:", error);
      alert("Failed to edit post");
    }
  };

  const handleUpdatePost = async (postId) => {
    const formData = new FormData();
    formData.append("description", description);
    if (media) {
      formData.append("media", media);
    }
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:3001/posts/${postId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      fetchPosts();
      setDescription("");
      setMedia(null);
      setCurrentPostId(null);
      alert("Post updated successfully");
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post");
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3001/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchPosts();
      console.log("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again later.");
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPosts = posts.filter((post) =>
    post.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container" style={{ marginTop: 50 }}>
      <h3>Post Creator</h3>
      <form>
        <div>
          <label>Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Media</label>
          <input type="file" onChange={(e) => setMedia(e.target.files[0])} />
          <br />
          <button
            className="but1"
            type="button"
            onClick={handleCreateOrUpdatePost}
          >
            {currentPostId ? "Update Post" : "Create Post"}
          </button>
        </div>
      </form>
      <div>
        <input
          type="text"
          placeholder="Search post..."
          value={searchTerm}
          onChange={handleSearch}
        />
        {filteredPosts.map((post) => (
          <div key={post._id} style={{ margin: "20px" }}>
            <div>
              <strong>Description:</strong> {post.description}
              <br />
              {post.user && (
                <>
                  <strong>Created by:</strong> {post.user.firstName} {post.user.lastName}
                  <br />
                </>
              )}
              {post.mediaUrl &&
                (post.mediaUrl.endsWith(".mp4") ? (
                  <video width="320" height="240" controls>
                    <source
                      src={`http://localhost:3001${post.mediaUrl}`}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={`http://localhost:3001${post.mediaUrl}`}
                    alt="Post media"
                    width="320"
                    height="240"
                  />
                ))}
            </div>
            <div>
              <button className="but2" onClick={() => handleEditPost(post._id)}>
                Edit
              </button>
              <button
                className="but4"
                onClick={() => handleDeletePost(post._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <NavLink to="/dashbord">
        <h1 fontSize="28px">Dashbord</h1>
      </NavLink>
    </div>
  );
}
