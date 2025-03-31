// Updated src/features/products/components/CommentList.tsx
import React from 'react';
import { format } from 'date-fns';

// Define the comment interface
export interface Comment {
  id: string;
  body: string;
  postId?: number;
  productId: number;
  user: {
    id: number;
    username: string;
  };
  rating?: number; // Add rating field for API reviews
  isLocal?: boolean;
  isApiReview?: boolean; // Flag for API reviews
  createdAt: string;
}

// Interface for the props
interface CommentListProps {
  comments: Comment[];
  onEditComment?: (comment: Comment) => void;
  onDeleteComment?: (commentId: string) => void;
}

const CommentList: React.FC<CommentListProps> = ({ 
  comments, 
  onEditComment, 
  onDeleteComment 
}) => {
  if (comments.length === 0) {
    return <p className="text-gray-500 italic">No comments yet. Be the first to comment!</p>;
  }

  // Helper function to render star rating
  const renderRating = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center mb-1">
        <div className="text-yellow-500">
          {'★'.repeat(Math.round(rating))}
          {'☆'.repeat(5 - Math.round(rating))}
        </div>
        <span className="ml-1 text-sm text-gray-600">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div 
          key={comment.id} 
          className={`p-4 rounded-lg border ${
            comment.isLocal 
              ? 'bg-blue-50 border-blue-100' 
              : comment.isApiReview 
                ? 'bg-green-50 border-green-100'
                : 'bg-gray-50 border-gray-100'
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                comment.isApiReview 
                  ? 'bg-green-500' 
                  : comment.isLocal 
                    ? 'bg-blue-500'
                    : 'bg-indigo-500'
              }`}>
                {comment.user.username.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="font-semibold">{comment.user.username}</p>
                <p className="text-xs text-gray-500">
                  {format(new Date(comment.createdAt), 'MMM d, yyyy • h:mm a')}
                </p>
              </div>
            </div>
            
            {comment.isLocal && (
              <div className="flex space-x-2">
                <button 
                  onClick={() => onEditComment && onEditComment(comment)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>
                <button 
                  onClick={() => onDeleteComment && onDeleteComment(comment.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
          
          {/* Display rating if available */}
          {renderRating(comment.rating)}
          
          <p className="mt-2 text-gray-700">{comment.body}</p>
          
          {comment.isLocal && (
            <div className="mt-1">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Your comment
              </span>
            </div>
          )}
          
          {comment.isApiReview && (
            <div className="mt-1">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Verified review
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentList;