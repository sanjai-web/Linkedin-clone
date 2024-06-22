import React, { useState, useEffect } from "react";
import axios from "axios";

import "../styles/home.css"; // Import your home styles

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPostId, setCurrentPostId] = useState(null);
  const [currentUser, setCurrentUser] = useState({
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    fetchPosts();
    fetchCurrentUser();
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

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3001/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const handleCreateOrUpdatePost = async (e) => {
    e.preventDefault();
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
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3001/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { description } = response.data;
      setDescription(description);
      setMedia(null);
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

  const filteredPosts = posts.filter((post) => {
    if (post.user) {
      const fullName = `${post.user.firstName} ${post.user.lastName}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    }
    return false;
  });

  return (
    <div className="container" style={{ marginTop: 50 }}>
      <div className="upload">
        <span style={{ color: "black" }}>
          {currentUser.firstName} {currentUser.lastName}
        </span>
        <form onSubmit={handleCreateOrUpdatePost}>
          <div>
            <textarea
              className="startpost"
              placeholder="Start a Post"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="media">Media</label>
            <input
              className="choosefile"
              type="file"
              onChange={(e) => setMedia(e.target.files[0])}
            />
            <br />
            <button className="but1" type="submit">
              {currentPostId ? "Update Post" : "Create Post"}
            </button>
          </div>
        </form>
      </div>
      <div className="content">
        <input
          className="searchpost"
          type="text"
          placeholder="Search post by user..."
          value={searchTerm}
          onChange={handleSearch}
        />
        {filteredPosts.map((post) => (
          <div
            className="overcontainer"
            key={post._id}
            style={{ margin: "20px" }}
          >
            <div className="maincontainer">
              {post.user && (
                <>
                  <p className="name-title">{`${post.user.firstName} ${post.user.lastName}`}</p>
                  <br />
                  <p className="des">{post.description}</p>
                  <br />
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
                        width="480"
                        height="420"
                      />
                    ))}
                </>
              )}
              <br />
              <button className="but2" onClick={() => handleEditPost(post._id)}>
                Edit
              </button>
              <button className="but4" onClick={() => handleDeletePost(post._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}
