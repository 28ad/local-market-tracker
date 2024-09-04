import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isTokenPresent } from '../util/checkToken';
import Loading from './Loading';

const ProtectedRoutes = () => {
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState<{ authenticated: boolean; cmsAccess: boolean }>({
    authenticated: false,
    cmsAccess: false,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const result = await isTokenPresent();
      setAuthUser(result);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return <Loading/>;
  }

  if (authUser.authenticated) {
    return <Navigate to='/dashboard' />;
    
  } else {
    return <Outlet />;
  }
};

export default ProtectedRoutes;
