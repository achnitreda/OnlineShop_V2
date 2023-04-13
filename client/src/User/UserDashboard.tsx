import { Link } from 'react-router-dom';
import { isAuthenticated } from '../Auth';
import Layout from '../Core/Layout';

function Dashboard() {
  const {
    user: { _id, name, email, isAdmin },
  } = isAuthenticated();

  const userLinks = () => {
    return (
      <div className="card">
        <h4 className="card-header">User Links</h4>
        <ul className="list-group">
          <li className="list-group-item">
            <Link className="nav-link" to="/cart">
              My Cart
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link" to={`/profile/${_id}`}>
              Update Profile
            </Link>
          </li>
        </ul>
      </div>
    );
  };

  const userInfo = () => {
    return (
      <div className="card mb-5">
        <h3 className="card-header">User Information</h3>
        <ul className="list-group">
          <li className="list-group-item">{name}</li>
          <li className="list-group-item">{email}</li>
          <li className="list-group-item">
            {isAdmin === true ? 'Admin' : 'Registered User'}
          </li>
        </ul>
      </div>
    );
  };

  return (
    <Layout
      title="Dashboard"
      description={`G'day ${name}!`}
      className="container-fluid"
    >
      <div className="row px-5">
        <div className="col-3">{userLinks()}</div>
        <div className="col-9">{userInfo()}</div>
      </div>
    </Layout>
  );
}

export default Dashboard;
