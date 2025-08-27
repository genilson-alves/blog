import React, { useState, useEffect, useCallback } from "react";
import PostCard from "../components/PostCard";

const API_URL = "http://localhost:3000";

const HomePage = ({ token, setModalMessage }) => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/posts`);
      const data = await response.json();
      setPosts(data.posts);
    } catch (error) {
      setModalMessage("Could not fetch posts");
    }
  }, [setModalMessage]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

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
      fetchPosts();
    } catch (error) {
      setModalMessage(error.message);
    }
  };
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
          Latest posts
        </h1>
        <p className="text-lg text-gray-600 mt-2">Welcome to our blog.</p>
      </div>
      <div className="grid gap-8 md:grid-cols-1 lg:max-w-4xl mx-auto">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={handleDeletePost}
              token={token}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No posts yet. Be the first, create yours.
          </p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
