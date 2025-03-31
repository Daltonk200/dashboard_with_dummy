// src/utils/commentStorage.ts
import { Comment } from '../features/products/components/CommentList';

// Key for localStorage
const LOCAL_COMMENTS_KEY = 'product_comments';

// Get all comments from localStorage
export const getLocalComments = (): Comment[] => {
  const storedComments = localStorage.getItem(LOCAL_COMMENTS_KEY);
  return storedComments ? JSON.parse(storedComments) : [];
};

// Get comments for a specific product
export const getProductComments = (productId: number): Comment[] => {
  const allComments = getLocalComments();
  return allComments.filter(comment => comment.productId === productId);
};

// Add a new comment
export const addComment = (comment: Omit<Comment, 'id'>): Comment => {
  const allComments = getLocalComments();
  
  // Create a new comment with a unique ID
  const newComment: Comment = {
    ...comment,
    id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };
  
  // Save to localStorage
  localStorage.setItem(LOCAL_COMMENTS_KEY, JSON.stringify([...allComments, newComment]));
  
  return newComment;
};

// Update an existing comment
export const updateComment = (id: string, body: string): Comment | null => {
  const allComments = getLocalComments();
  const commentIndex = allComments.findIndex(comment => comment.id === id);
  
  if (commentIndex === -1) return null;
  
  // Update the comment
  const updatedComment = { 
    ...allComments[commentIndex], 
    body,
    createdAt: new Date().toISOString() // Update timestamp to show it was edited
  };
  
  allComments[commentIndex] = updatedComment;
  
  // Save to localStorage
  localStorage.setItem(LOCAL_COMMENTS_KEY, JSON.stringify(allComments));
  
  return updatedComment;
};

// Delete a comment
export const deleteComment = (id: string): boolean => {
  const allComments = getLocalComments();
  const filteredComments = allComments.filter(comment => comment.id !== id);
  
  if (filteredComments.length === allComments.length) {
    return false; // Comment not found
  }
  
  // Save to localStorage
  localStorage.setItem(LOCAL_COMMENTS_KEY, JSON.stringify(filteredComments));
  
  return true;
};