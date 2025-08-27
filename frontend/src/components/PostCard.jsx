import React from "react";

// Function to format the date
const formatDate = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const PostCard = ({ post, onDelete, token }) => (
  <article className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
    <div className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 mb-1">
            Posted on {formatDate(post.created_at)}
          </p>
          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h3>
        </div>
        {token && (
          <button
            onClick={() => onDelete(post.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-full text-xs font-bold"
            title="Delete Post"
          >
            X
          </button>
        )}
      </div>
      <p className="text-gray-700 mt-3">{post.content}</p>
      <div className="mt-4">
        <a href="#" className="text-blue-500 hover:text-blue-700 font-semibold">
          Read more &rarr;
        </a>
      </div>
    </div>
  </article>
);

export default PostCard;
