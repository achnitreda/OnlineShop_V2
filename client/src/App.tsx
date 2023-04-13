import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './User/Signup';
import Signin from './User/Signin';
import Home from './Core/Home';
import PrivateOutlet from './Auth/PrivateRoute';
import Dashboard from './User/UserDashboard';
import AdminRoute from './Auth/AdminRoute';
import AdminDashboard from './User/AdminDashboard';
import AddCategory from './Admin/AddCategory';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<PrivateOutlet />}>
          <Route path="/user/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
        <Route element={<AdminRoute />}>
          <Route path="/create/category" element={<AddCategory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
