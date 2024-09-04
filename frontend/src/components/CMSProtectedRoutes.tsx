import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isTokenPresent } from '../util/checkToken';
import Loading from './Loading';

const CMSPrivateRoutes = () => {
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState<{ authenticated: boolean; cmsAccess: boolean }>({
    authenticated: false,
    cmsAccess: false,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const result = await isTokenPresent();
      setAuthUser(result);
      console.log(authUser);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return <Loading/>;
  }

  if (authUser.authenticated && authUser.cmsAccess) {
    return <Outlet />;
  } else {
    return <Navigate to='/cms' />;
  }
};

export default CMSPrivateRoutes;
