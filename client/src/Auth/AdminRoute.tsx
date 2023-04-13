import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '.';

function AdminRoute() {
  const auth = isAuthenticated() && isAuthenticated().user.isAdmin === true;
  return auth ? <Outlet /> : <Navigate to="/signin" />;
}

export default AdminRoute;
