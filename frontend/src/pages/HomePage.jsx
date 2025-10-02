// src/pages/HomePage.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PostCard from "../components/PostCard";

const API_URL = "http://localhost:3000";

// --- SOLUTION: Define components outside the HomePage component ---

const WelcomeBanner = () => (
  <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-center">
    <h2 className="text-3xl font-bold text-gray-800 mb-4">
      Welcome to the Blog!
    </h2>
    <p className="text-gray-600 mb-6">
      Join the community. Share your thoughts, ideas, and stories with the
      world.
    </p>
    <div className="flex justify-center space-x-4">
      <Link
        to="/login"
        className="text-gray-600 bg-gray-100 hover:bg-gray-200 font-bold py-3 px-6 rounded-lg"
      >
        Login
      </Link>
      <Link
        to="/register"
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg"
      >
        Register
      </Link>
    </div>
  </div>
);

// We need to pass props to this component, so we define it to accept them
const CreatePostForm = ({
  handleCreatePost,
  newPostTitle,
  setNewPostTitle,
  newPostContent,
  setNewPostContent,
  isLoading,
}) => (
  <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Create a New Post</h2>
    <form onSubmit={handleCreatePost}>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Title"
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
          className="shadow-inner appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <textarea
          placeholder="What's on your mind?"
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          className="shadow-inner appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 h-28"
          rows="4"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg disabled:bg-blue-300"
      >
        {isLoading ? "Posting..." : "Post"}
      </button>
    </form>
  </div>
);

const HomePage = ({ token, userId, setModalMessage }) => {
  // <-- Add userId prop
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/posts`);
      const data = await response.json();
      if (response.ok) {
        setPosts(data.posts);
      } else {
        throw new Error(data.error || "Failed to fetch posts");
      }
    } catch (error) {
      setModalMessage(error.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostTitle || !newPostContent) {
      setModalMessage("Title and content cannot be empty.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newPostTitle, content: newPostContent }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create post");

      setModalMessage("Post created successfully!");
      setNewPostTitle("");
      setNewPostContent("");
      fetchPosts();
    } catch (error) {
      setModalMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- NEW: Function to handle deleting a post ---
  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(`${API_URL}/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete post");

      setModalMessage("Post deleted successfully!");
      // Update the UI by removing the post from the state
      setPosts(posts.filter((p) => p.id !== postId));
    } catch (error) {
      setModalMessage(error.message);
    }
  };

  return (
    <>
      {token ? (
        <CreatePostForm
          handleCreatePost={handleCreatePost}
          newPostTitle={newPostTitle}
          setNewPostTitle={setNewPostTitle}
          newPostContent={newPostContent}
          setNewPostContent={setNewPostContent}
          isLoading={isLoading}
        />
      ) : (
        <WelcomeBanner />
      )}

      <h1 className="text-4xl font-bold text-gray-800 mb-8">Latest Posts</h1>
      <div className="space-y-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              userId={userId} // Pass the current user's ID
              onDelete={handleDeletePost} // Pass the delete handler
            />
          ))
        ) : (
          <p className="text-center text-gray-500">
            No posts yet. Be the first to write!
          </p>
        )}
      </div>
    </>
  );
};

export default HomePage;
