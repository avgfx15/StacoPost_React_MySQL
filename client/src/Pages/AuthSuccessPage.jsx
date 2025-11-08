import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../AuthContext';

const AuthSuccessPage = () => {
  const navigate = useNavigate();
  const { socialLogin, refreshUser } = useAuth();

  useEffect(() => {
    // Get token from cookie instead of URL params
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('auth_token='))
      ?.split('=')[1];

    if (token) {
      socialLogin(token);
      // Clear the cookie after using it
      document.cookie =
        'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      // Wait a bit for the token to be set, then refresh user data
      setTimeout(() => {
        refreshUser();
        navigate('/');
      }, 100);
    } else {
      navigate('/login');
    }
  }, [socialLogin, refreshUser, navigate]);

  return <div>Logging in...</div>;
};

export default AuthSuccessPage;
