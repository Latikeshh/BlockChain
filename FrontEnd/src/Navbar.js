import { Link, useNavigate } from "react-router-dom";
import logo from "../src/Images/clglogo.png";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const dashboardPath =
    role === "admin"
      ? "/admin/dashboard"
      : role === "teacher"
      ? "/teacher/dashboard"
      : role === "student"
      ? "/student/dashboard"
      : "/";

  return (
    <>
      {/* TOP BAR */}
      <div className="N-top-bar">
        <div className="N-marquee">
          <p>
            🎓 Shri Shivaji Vidya Prasarak Sanstha's Bapusaheb Shivajirao Deore Polytechnic
          </p>
        </div>
      </div>

      <header className="N-navbar">
        {/* LEFT */}
        <div className="N-nav-left">
          <div className="N-logo-container">
            <img src={logo} alt="logo" className="N-logo-img" />
            <div className="N-logo-text">
              <span className="N-college-name">B.S. Deore</span>
              <span className="N-college-subtitle">Polytechnic</span>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <nav className="N-nav-right">
          <Link to="/" className="N-nav-link">
            <span className="N-nav-icon">🏠</span>
            Home
          </Link>
          <Link to="/about" className="N-nav-link">
            <span className="N-nav-icon">ℹ️</span>
            About
          </Link>
          <Link to="/contact" className="N-nav-link">
            <span className="N-nav-icon">📞</span>
            Contact
          </Link>
          
          {/* IF LOGGED IN */}
          {role ? (
            <div className="N-auth-section">
              <Link to={dashboardPath} className="N-dashboard-link">
                <span className="N-nav-icon">📊</span>
                Dashboard
              </Link>
              <div className="N-user-menu">
                <button className="N-user-btn">
                  <span className="N-user-avatar">👤</span>
                  <span className="N-user-name">{name}</span>
                  <span className="N-dropdown-arrow">▼</span>
                </button>
                <div className="N-user-dropdown">
                  <div className="N-user-info">
                    <span className="N-user-role">{role}</span>
                  </div>
                  <Link to={dashboardPath} className="N-dropdown-link">
                    🎯 My Dashboard
                  </Link>
                  <button className="N-logout-btn" onClick={handleLogout}>
                    🚪 Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* LOGIN BUTTON */
            <div className="N-login-section">
              <button className="N-login-btn">
                <span>🔑</span> Login
                <span className="N-login-arrow">▼</span>
              </button>
              <div className="N-login-dropdown">
                <Link to="/student/login" className="N-dropdown-link">
                  <span>🎓</span> Student Login
                </Link>
                <Link to="/teacher/login" className="N-dropdown-link">
                  <span>👨‍🏫</span> Teacher Login
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
};

export default Navbar;
