import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Siderbar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const name = localStorage.getItem("name") || "Teacher";

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Helper to check if a path is active
  const isActive = (path) => {
    if (path === "/teacher/dashboard" || path === "/") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="teacher-sidebar">
      <h3 className="logo">Teacher Panel</h3>
      
      <p className="welcome">Welcome,<br/> {name}</p>

      <nav className="sidebar-nav">
        <Link to="/" className={isActive("/") && location.pathname === "/" ? "nav-item active" : "nav-item"}>
          <span className="nav-icon">🏠</span>
          Home
        </Link>
        <Link to="/teacher/dashboard" className={isActive("/teacher/dashboard") ? "nav-item active" : "nav-item"}>
          <span className="nav-icon">📊</span>
          Dashboard
        </Link>
        <Link to="/teacher/verifiedstudents" className={isActive("/teacher/verifiedstudents") ? "nav-item active" : "nav-item"}>
          <span className="nav-icon">✅</span>
          Verified Students
        </Link>
        <Link to="/teacher/pending" className={isActive("/teacher/pending") ? "nav-item active" : "nav-item"}>
          <span className="nav-icon">⏳</span>
          Pending Students
        </Link>
        <Link to="/teacher/requests" className={isActive("/teacher/requests") ? "nav-item active" : "nav-item"}>
          <span className="nav-icon">📝</span>
          Change Requests
        </Link>
        <Link to="/teacher/contacts" className={isActive("/teacher/contacts") ? "nav-item active" : "nav-item"}>
          <span className="nav-icon">📩</span>
          Contacts
        </Link>
      </nav>

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
