import useAuth from 'hooks/useAuth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) navigate('/login', { replace: true });
    else navigate('/');
  }, [isLoggedIn]);

  return <>{children}</>;
};

export default AuthGuard;
