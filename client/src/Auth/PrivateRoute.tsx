import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '.';

function PrivateOutlet() {
  const auth = isAuthenticated();
  return auth ? <Outlet /> : <Navigate to="/signin" />;
}

export default PrivateOutlet;
