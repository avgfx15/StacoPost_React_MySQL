import React from 'react';
import SingleCommentComponent from './SingleCommentComponent';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createCommentForPostAction,
  fetchCommentsByPostIdAction,
} from '../Actions/PostActions';
import { toast } from 'react-toastify';
import { useAuth } from '../AuthContext.jsx';

// & Comments Component
const CommentsComponent = ({ postId }) => {
  const { user } = useAuth();
  // Fetch Comments data using the postId

  // / Get All Comments
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchCommentsByPostIdAction(postId),
    enabled: !!postId, // Only run the query if slug is available
  });

  const queryClient = useQueryClient();

  const { getToken } = useAuth();
  // + Use Mutation from TanStackQuery for New Post
  const commentMutation = useMutation({
    mutationFn: async (newComment) => {
      const token = await getToken();

      return createCommentForPostAction(postId, newComment.commentDesc, token);
    },
    onError: (error) => {
      toast.error('Error creating comment: ' + error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      toast.success('Comment Added Successfully');
    },
  });

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error: {error.message}</div>;

  const handleSubmit = (e) => {
    e.preventDefault();
    const commentDesc = e.target.comment.value;
    if (!commentDesc) {
      toast.error('Comment cannot be empty');
      return;
    }
    commentMutation.mutate({ commentDesc });
    e.target.reset();
  };

  const comments = data || [];

  // ^ Render Comments Component
  return (
    <div className='flex flex-col gap-5 w-9/12'>
      <h1 className='text-lg underline text-gray-600'>Comments</h1>
      <form
        onSubmit={handleSubmit}
        className='flex items-center justify-between gap-8 w-full'
      >
        <textarea
          type='text'
          name='comment'
          placeholder='Write your comment'
          className='w-full p-3 rounded-2xl border'
        />
        <button
          type='submit'
          className='bg-sky-800 text-white px-4 py-2 rounded-xl font-medium'
        >
          Send
        </button>
      </form>
      {comments?.length === 0 && (
        <div>No comments yet. Be the first to comment!</div>
      )}

      {commentMutation.isPending && (
        <SingleCommentComponent
          comment={{
            commentDesc: `${commentMutation.variables.commentDesc} (Sending...)`,
            commentUser: {
              username: user.username,
              profileImage: user.imageUrl,
            },
            createdAt: new Date().toISOString(),
          }}
        />
      )}

      {comments?.map((comment) => (
        <div key={comment.id}>
          <SingleCommentComponent comment={comment} postId={postId} />
        </div>
      ))}
    </div>
  );
};

export default CommentsComponent;
