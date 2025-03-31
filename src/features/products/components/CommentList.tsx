// Updated src/features/products/components/CommentList.tsx
import React from 'react';
import { format } from 'date-fns';
import { Star, Edit2, Trash2, CheckCircle, User } from 'lucide-react';
import { motion } from 'framer-motion';

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
    return (
      <div className="text-center py-8 bg-gray-50 rounded-xl">
        <div className="text-gray-400 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <p className="text-gray-600 font-medium">No reviews yet</p>
        <p className="text-gray-500 text-sm mt-1">Be the first to share your thoughts!</p>
      </div>
    );
  }

  // Helper function to render star rating
  const renderRating = (rating?: number) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={16} 
            fill={i < Math.round(rating) ? "#F59E0B" : "none"} 
            className={i < Math.round(rating) ? "text-amber-400" : "text-gray-300"}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600 font-medium">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  // Get user's initial for avatar
  const getUserInitial = (username: string) => {
    return username.charAt(0).toUpperCase();
  };

  // Format date nicely
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy • h:mm a');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="space-y-5">
      {comments.map((comment) => (
        <motion.div 
          key={comment.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${
                comment.isApiReview 
                  ? 'bg-emerald-500' 
                  : comment.isLocal 
                    ? 'bg-blue-500'
                    : 'bg-purple-500'
              }`}>
                {comment.user.username ? getUserInitial(comment.user.username) : <User size={18} />}
              </div>
              <div className="ml-3">
                <p className="font-semibold text-gray-900">{comment.user.username || "Anonymous"}</p>
                <p className="text-xs text-gray-500">
                  {formatDate(comment.createdAt)}
                </p>
              </div>
            </div>
            
            {comment.isLocal && (
              <div className="flex space-x-1">
                <button 
                  onClick={() => onEditComment && onEditComment(comment)}
                  className="p-1.5 rounded-full text-blue-500 hover:bg-blue-50 transition-colors"
                  aria-label="Edit comment"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => onDeleteComment && onDeleteComment(comment.id)}
                  className="p-1.5 rounded-full text-red-500 hover:bg-red-50 transition-colors "
                  aria-label="Delete comment"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
          
          {/* Display rating if available */}
          {renderRating(comment.rating)}
          
          <p className="mt-2 text-gray-700 leading-relaxed">{comment.body}</p>
          
          <div className="mt-3 flex flex-wrap gap-2">
            {comment.isLocal && (
              <div className="inline-flex items-center text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                <User size={12} className="mr-1" />
                Your review
              </div>
            )}
            
            {comment.isApiReview && (
              <div className="inline-flex items-center text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">
                <CheckCircle size={12} className="mr-1" />
                Verified purchase
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CommentList;
