// src/features/products/components/CommentList.tsx
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
  isLocal?: boolean;
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

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div 
          key={comment.id} 
          className={`p-4 rounded-lg border ${comment.isLocal ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100'}`}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
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
          
          <p className="mt-2 text-gray-700">{comment.body}</p>
          
          {comment.isLocal && (
            <div className="mt-1">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Your comment
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentList;