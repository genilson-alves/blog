// import "./App.css";

// function App() {
//   return <>Hello World</>;
// }

// export default App;

import React, { useState, useEffect, useCallback } from "react";

// --- Configuration ---
// Make sure this points to your running back-end API
const API_URL = "http://localhost:3000";

// --- Helper Components ---

// A simple modal component for showing messages
const Modal = ({ message, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-sm text-center">
      <p className="mb-4 text-gray-700">{message}</p>
      <button
        onClick={onClose}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Close
      </button>
    </div>
  </div>
);

// --- Main Components ---

// Header Component: Shows app title and login/logout status
const Header = ({ token, onLogout }) => (
  <header className="bg-gray-800 text-white shadow-md">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Personal Blog API</h1>
      {token && (
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
        >
          Logout
        </button>
      )}
    </div>
  </header>
);

// Auth Component: Handles both Login and Registration
const Auth = ({ setToken, setModalMessage }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const endpoint = isLogin ? "/login" : "/register";

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      if (isLogin) {
        setToken(data.token);
      } else {
        setModalMessage("Registration successful! Please log in.");
        setIsLogin(true); // Switch to login form after successful registration
      }
    } catch (error) {
      setModalMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        {isLogin ? "Login" : "Register"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-blue-300 transition duration-200"
        >
          {isLoading ? "Processing..." : isLogin ? "Login" : "Register"}
        </button>
      </form>
      <p className="text-center text-gray-600 mt-6">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-500 hover:text-blue-700 font-bold ml-2"
        >
          {isLogin ? "Register" : "Login"}
        </button>
      </p>
    </div>
  );
};

// Posts Component: Displays, creates, and deletes posts
const Posts = ({ token, setModalMessage }) => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/posts`);
      const data = await response.json();
      setPosts(data.posts.reverse()); // Show newest posts first
    } catch (error) {
      setModalMessage("Could not fetch posts.");
    }
  }, [setModalMessage]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create post");

      setTitle("");
      setContent("");
      fetchPosts(); // Refresh the posts list
    } catch (error) {
      setModalMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(`${API_URL}/posts/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete post");

      setModalMessage("Post deleted successfully.");
      fetchPosts(); // Refresh the posts list
    } catch (error) {
      setModalMessage(error.message);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {token && (
        <form
          onSubmit={handleCreatePost}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Create New Post
          </h3>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-4">
            <textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 h-28"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-green-300 transition duration-200"
          >
            {isLoading ? "Posting..." : "Create Post"}
          </button>
        </form>
      )}

      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        All Posts
      </h2>
      <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-lg p-6 relative"
            >
              <h4 className="text-xl font-bold text-gray-900">{post.title}</h4>
              <p className="text-gray-700 mt-2">{post.content}</p>
              <p className="text-xs text-gray-500 mt-4">
                User ID: {post.user_id}
              </p>
              {token && (
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="absolute top-4 right-4 bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-full text-xs font-bold"
                  title="Delete Post"
                >
                  X
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No posts yet. Be the first to create one!
          </p>
        )}
      </div>
    </div>
  );
};

// --- Main App Component ---
export default function App() {
  // Attempt to get token from localStorage on initial load
  const [token, setToken] = useState(localStorage.getItem("blog-token"));
  const [modalMessage, setModalMessage] = useState("");

  // Use an effect to sync the token with localStorage whenever it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("blog-token", token);
    } else {
      localStorage.removeItem("blog-token");
    }
  }, [token]);

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {modalMessage && (
        <Modal message={modalMessage} onClose={() => setModalMessage("")} />
      )}
      <Header token={token} onLogout={handleLogout} />
      <main className="container mx-auto p-4 md:p-8">
        {!token ? (
          <Auth setToken={setToken} setModalMessage={setModalMessage} />
        ) : (
          <Posts token={token} setModalMessage={setModalMessage} />
        )}
      </main>
    </div>
  );
}
