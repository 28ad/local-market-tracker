import { Navigate, Outlet } from 'react-router-dom';
import { isTokenPresent } from '../util/checkToken';

const PrivateRoutes = () => {

  if (isTokenPresent()) {
    console.log('Token cookie is present');
  } else {
    console.log('Token cookie is not present');
  }


  return (
    isTokenPresent() ? <Outlet /> : <Navigate to='/login' />
  )
}

export default PrivateRoutes;