// src/pages/Dashboard/components/CommentsPanel.tsx (replacing NotificationsPanel)
import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { commentService } from '../../../services/api';

const CommentsPanel: React.FC = () => {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await commentService.fetchComments(1, 5); // Get 5 most recent comments
        setComments(response.comments);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Comments</h3>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {comments.length} new
        </span>
      </div>
      <div className="p-5">
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="animate-pulse text-gray-400">Loading comments...</div>
          </div>
        ) : comments.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {comments.map((comment) => (
              <li key={comment.id} className="py-4">
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-500">
                        {comment.user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {comment.user.username}
                    </p>
                    <p className="text-sm text-gray-500">
                      {comment.body}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500">
            <MessageSquare className="h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm">No comments yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsPanel;
