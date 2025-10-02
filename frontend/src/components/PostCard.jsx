// src/components/PostCard.jsx

import React, { useState } from "react";

const MOCK_COMMENTS = [
  { id: 1, author: "Alice", text: "Great post, thanks for sharing!" },
  {
    id: 2,
    author: "Bob",
    text: "I have a question about the second paragraph.",
  },
];

const PostCard = ({ post, userId, onDelete }) => {
  // <-- Add userId and onDelete props
  const [showComments, setShowComments] = useState(false);

  const comments = post.id % 2 !== 0 ? MOCK_COMMENTS : [];

  // --- NEW: Check if the current user is the author of the post ---
  const isAuthor = post.user_id === userId;

  return (
    <article className="bg-white rounded-xl shadow-lg overflow-hidden transition-shadow hover:shadow-xl relative">
      {/* --- NEW: Delete Button --- */}
      {isAuthor && (
        <button
          onClick={() => onDelete(post.id)}
          className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-full text-xs"
        >
          Delete
        </button>
      )}

      <div className="p-6">
        <p className="text-sm text-gray-500 mb-2">
          Posted on {new Date(post.created_at).toLocaleDateString()}
        </p>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{post.title}</h3>
        <p className="text-gray-700 leading-relaxed">{post.content}</p>

        {comments.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowComments(!showComments)}
              className="text-blue-500 hover:text-blue-700 font-semibold"
            >
              {showComments ? "Hide" : "Show"} {comments.length} comments
            </button>
          </div>
        )}

        {showComments && comments.length > 0 && (
          <div className="mt-4 space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                <p className="font-semibold text-gray-800">{comment.author}</p>
                <p className="text-gray-600">{comment.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

export default PostCard;
