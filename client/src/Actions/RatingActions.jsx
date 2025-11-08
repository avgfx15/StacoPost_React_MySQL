import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_API_URL;

// + Rate a Post Action
export const ratePostAction = async (postId, rating, token) => {
  const response = await axios.post(
    `${baseUrl}/ratings/posts/${postId}`,
    { rating },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// + Rate a Comment Action
export const rateCommentAction = async (commentId, rating, token) => {
  const response = await axios.post(
    `${baseUrl}/ratings/comments/${commentId}`,
    { rating },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// / Get Rating Stats for a Post Action
export const getPostRatingStatsAction = async (postId) => {
  const response = await axios.get(`${baseUrl}/ratings/posts/${postId}/stats`);
  return response.data;
};

// / Get Rating Stats for a Comment Action
export const getCommentRatingStatsAction = async (commentId) => {
  const response = await axios.get(
    `${baseUrl}/ratings/comments/${commentId}/stats`
  );
  return response.data;
};

// / Get User's Rating Status for a Post Action
export const getUserPostRatingStatusAction = async (postId, token) => {
  const response = await axios.get(
    `${baseUrl}/ratings/posts/${postId}/status`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// / Get User's Rating Status for a Comment Action
export const getUserCommentRatingStatusAction = async (commentId, token) => {
  const response = await axios.get(
    `${baseUrl}/ratings/comments/${commentId}/status`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
