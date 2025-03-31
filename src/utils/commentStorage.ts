// src/utils/commentStorage.ts
import { v4 as uuidv4 } from 'uuid';
import { Comment } from '../features/products/components/CommentList';

const COMMENTS_STORAGE_KEY = 'user_comments';
// Get all comments from storage
const getAllComments = (): Comment[] => {
  const comments = localStorage.getItem(COMMENTS_STORAGE_KEY);
  return comments ? JSON.parse(comments) : [];
};

// Save all comments to storage
const saveAllComments = (comments: Comment[]): void => {
  localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
};

// Get comments for a specific product
export const getProductComments = (productId: number): Comment[] => {
  const allComments = getAllComments();
  return allComments.filter(comment => comment.productId === productId);
};
  
// Add a new comment
export const addComment = (comment: Omit<Comment, 'id'>): Comment => {
  const allComments = getAllComments();
  const newComment = {
    ...comment,
    id: uuidv4()
  };
  
  allComments.push(newComment);
  saveAllComments(allComments);
  
  return newComment;
};

// Update an existing comment
export const updateComment = (commentId: string, newBody: string, newRating?: number): Comment | null => {
  const allComments = getAllComments();
  const commentIndex = allComments.findIndex(comment => comment.id === commentId);
  
  if (commentIndex === -1) return null;
  
  // Update the comment
  const updatedComment = {
    ...allComments[commentIndex],
    body: newBody
};
  
  // Update rating if provided
  if (newRating !== undefined) {
    updatedComment.rating = newRating;
  }
  
  allComments[commentIndex] = updatedComment;
  saveAllComments(allComments);
  
  return updatedComment;
};

// Delete a comment
export const deleteComment = (commentId: string): boolean => {
  const allComments = getAllComments();
  const filteredComments = allComments.filter(comment => comment.id !== commentId);
  
  if (filteredComments.length === allComments.length) {
    return false; // Comment not found
  }
  
  saveAllComments(filteredComments);
  return true;
};