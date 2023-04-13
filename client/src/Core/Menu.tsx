import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated, signout } from '../Auth';

// const isActive = (path: unknown) => (location: Location) =>
//   location.pathname === path;

function Menu() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          Home
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink
                className={
                  location.pathname === '/' ? 'nav-link active' : 'nav-link'
                }
                to="/"
              >
                Home
              </NavLink>
            </li>

            {isAuthenticated() && isAuthenticated().user.isAdmin === false && (
              <li className="nav-item">
                <NavLink
                  className={
                    location.pathname === '/user/dashboard'
                      ? 'nav-link active'
                      : 'nav-link'
                  }
                  to="/user/dashboard"
                >
                  Dashboard
                </NavLink>
              </li>
            )}

            {isAuthenticated() && isAuthenticated().user.isAdmin === true && (
              <li className="nav-item">
                <NavLink
                  className={
                    location.pathname === '/admin/dashboard'
                      ? 'nav-link active'
                      : 'nav-link'
                  }
                  to="/admin/dashboard"
                >
                  Dashboard
                </NavLink>
              </li>
            )}

            {!isAuthenticated() && (
              <>
                <li className="nav-item">
                  <NavLink
                    className={
                      location.pathname === '/signin'
                        ? 'nav-link active'
                        : 'nav-link'
                    }
                    to="/signin"
                  >
                    Signin
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    className={
                      location.pathname === '/signup'
                        ? 'nav-link active'
                        : 'nav-link'
                    }
                    to="/signup"
                  >
                    Signup
                  </NavLink>
                </li>
              </>
            )}

            {isAuthenticated() && (
              <li className="nav-item">
                <span
                  className="nav-link"
                  style={{ cursor: 'pointer', color: '#ffffff' }}
                  onClick={() => signout(() => navigate('/signin'))}
                >
                  Signout
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Menu;
