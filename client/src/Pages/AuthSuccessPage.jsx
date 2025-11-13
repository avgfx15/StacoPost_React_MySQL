import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const AuthSuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login since social auth is removed
    navigate('/login');
  }, [navigate]);

  return <div>Redirecting...</div>;
};

export default AuthSuccessPage;
