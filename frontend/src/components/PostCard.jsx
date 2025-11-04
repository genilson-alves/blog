import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:3000";

const PostCard = ({
  post,
  currentUser,
  token,
  onUpdate,
  onDelete,
  setModalMessage,
}) => {
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedContent, setEditedContent] = useState(post.content);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState("");

  const handleApiError = async (response) => {
    let errorMsg = `Error: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMsg = errorData.error || errorMsg;
    } catch (e) {}
    throw new Error(errorMsg);
  };

  const fetchComments = async () => {
    if (!post.id) return;
    try {
      const response = await fetch(`${API_URL}/posts/${post.id}/comments`);
      if (!response.ok) await handleApiError(response);
      const data = await response.json();
      setComments(data.comments);
    } catch (error) {
      setModalMessage(error.message);
    }
  };

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments]);

  const handleSavePost = () => {
    onUpdate(post.id, { title: editedTitle, content: editedContent });
    setIsEditingPost(false);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const response = await fetch(`${API_URL}/posts/${post.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment }),
      });
      if (!response.ok) await handleApiError(response);
      setNewComment("");
      setIsReplying(false);
      await fetchComments();
    } catch (error) {
      setModalMessage(error.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;
    try {
      const response = await fetch(`${API_URL}/comments/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) await handleApiError(response);
      await fetchComments();
    } catch (error) {
      setModalMessage(error.message);
    }
  };

  const handleUpdateComment = async (commentId) => {
    try {
      const response = await fetch(`${API_URL}/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: editedCommentContent }),
      });
      if (!response.ok) await handleApiError(response);
      setEditingCommentId(null);
      setEditedCommentContent("");
      await fetchComments();
    } catch (error) {
      setModalMessage(error.message);
    }
  };

  const startEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditedCommentContent(comment.content);
  };

  return (
    <article className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <p className="text-sm text-gray-500">
            Posted on {new Date(post.created_at).toLocaleDateString()} by{" "}
            <strong>{post.author}</strong>
          </p>
          {currentUser?.id === post.user_id && (
            <div className="flex space-x-3">
              <button
                onClick={() => setIsEditingPost(!isEditingPost)}
                className="text-sm text-blue-500 hover:text-blue-700 font-semibold transition-transform duration-200 hover:scale-110"
              >
                {isEditingPost ? "Cancel" : "Edit"}
              </button>
              <button
                onClick={() => onDelete(post.id)}
                className="text-sm text-red-500 hover:text-red-700 font-semibold transition-transform duration-200 hover:scale-110"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {isEditingPost ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="shadow-inner appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="shadow-inner appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
            />
            <button
              onClick={handleSavePost}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Save Post
            </button>
          </div>
        ) : (
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {post.title}
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex space-x-4">
            {post.comment_count > 0 && (
              <button
                onClick={() => setShowComments(!showComments)}
                className="text-blue-500 hover:text-blue-700 font-semibold transition-transform duration-200 hover:scale-110"
              >
                {showComments ? "Hide" : "Show"} Comments ({post.comment_count})
              </button>
            )}
            {currentUser && (
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="text-green-500 hover:text-green-700 font-semibold transition-transform duration-200 hover:scale-110"
              >
                {isReplying ? "Cancel" : "Reply"}
              </button>
            )}
          </div>
        </div>

        {(showComments || isReplying) && (
          <div className="mt-4">
            {isReplying && (
              <form onSubmit={handleAddComment} className="mb-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="shadow-inner appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                />
                <button
                  type="submit"
                  className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  Submit Comment
                </button>
              </form>
            )}
            {showComments && (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-gray-800">
                        {comment.author}
                      </p>
                      {currentUser?.id === comment.user_id && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditComment(comment)}
                            className="text-xs text-blue-500 hover:text-blue-700 font-semibold transition-transform duration-200 hover:scale-110"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-xs text-red-500 hover:text-red-700 font-semibold transition-transform duration-200 hover:scale-110"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                    {editingCommentId === comment.id ? (
                      <div className="mt-2">
                        <textarea
                          value={editedCommentContent}
                          onChange={(e) =>
                            setEditedCommentContent(e.target.value)
                          }
                          className="shadow-inner appearance-none border rounded-lg w-full py-1 px-2 text-sm text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => handleUpdateComment(comment.id)}
                          className="mt-1 bg-green-500 hover:bg-green-600 text-white font-bold text-xs py-1 px-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <p className="text-gray-600 mt-1">{comment.content}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export default PostCard;
