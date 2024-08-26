import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isTokenPresent } from '../util/checkToken';

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
    return <div>Loading...</div>;
  }

  if (authUser.authenticated) {
    return <Outlet />;
  } else {
    return <Navigate to='/login' />;
  }
};

export default ProtectedRoutes;
