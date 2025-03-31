// src/features/products/components/CommentForm.tsx
import React, { useState, useEffect } from 'react';
import { Comment } from './CommentList';

interface CommentFormProps {
  productId: number;
  onSubmit: (comment: Omit<Comment, 'id'>) => void;
  editingComment: Comment | null;
  onCancelEdit: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ 
  productId, 
  onSubmit, 
  editingComment, 
  onCancelEdit 
}) => {
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(5); // Default to 5 stars
  
  // Update form when editing a comment
  useEffect(() => {
    if (editingComment) {
      setCommentText(editingComment.body);
      // Use the existing rating or default to 5
      setRating(editingComment.rating || 5);
    } else {
    setCommentText('');
      setRating(5);
    }
  }, [editingComment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;
    
    // Create a new comment object
    const newComment = {
      body: commentText.trim(),
      productId,
      rating,
      user: {
        id: 999, // Placeholder for the current user
        username: 'You' // Placeholder for the current user's name
      },
      isLocal: true,
      createdAt: editingComment ? editingComment.createdAt : new Date().toISOString()
  };

    onSubmit(newComment);
    setCommentText('');
    setRating(5);
};

  // Handle star rating selection
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="mb-4">
        <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
          Rating
        </label>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingChange(star)}
              className="text-2xl focus:outline-none"
            >
              <span className={star <= rating ? "text-yellow-500" : "text-gray-300"}>
                ★
              </span>
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-600">
            ({rating} {rating === 1 ? 'star' : 'stars'})
          </span>
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
          {editingComment ? 'Edit your review' : 'Add a review'}
        </label>
        <textarea
          id="comment"
          rows={3}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Share your thoughts about this product..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          required
        />
      </div>
      <div className="flex space-x-3">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {editingComment ? 'Update Review' : 'Post Review'}
        </button>
        {editingComment && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default CommentForm;