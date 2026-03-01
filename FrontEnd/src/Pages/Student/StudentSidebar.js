import { Link, useNavigate, useLocation } from "react-router-dom";
import "./StudentSidebar.css";

export default function StudentSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const name = localStorage.getItem("name");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Helper to check if a path is active
  const isActive = (path) => {
    if (path === "/student/dashboard" || path === "/") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="student-sidebar">
      <h3 className="logo">Student Panel</h3>

      <p className="welcome">Welcome,<br/> {name}</p>

      <nav className="sidebar-nav">
        <Link to="/" className={isActive("/") && location.pathname === "/" ? "nav-item active" : "nav-item"}>
          <span className="nav-icon">🏠</span>
          Home
        </Link>
        <Link to="/student/dashboard" className={isActive("/student/dashboard") ? "nav-item active" : "nav-item"}>
          <span className="nav-icon">📊</span>
          Dashboard
        </Link>
        <Link to="/student/profile" className={isActive("/student/profile") ? "nav-item active" : "nav-item"}>
          <span className="nav-icon">👤</span>
          My Profile
        </Link>
        <Link to="/student/status" className={isActive("/student/status") ? "nav-item active" : "nav-item"}>
          <span className="nav-icon">✅</span>
          Verified Status
        </Link>
        <Link to="/student/request" className={isActive("/student/request") ? "nav-item active" : "nav-item"}>
          <span className="nav-icon">📝</span>
          Request
        </Link>
      </nav>

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
