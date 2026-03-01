import { Link, useNavigate, useLocation } from "react-router-dom";
import "./AdminSidebar.css";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const name = localStorage.getItem("name") || "Admin";

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Helper to check if a path is active
  const isActive = (path) => {
    if (path === "/admin/dashboard" || path === "/") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Get first name for display
  const getDisplayName = () => {
    if (!name || name === "Admin") return "Admin";
    return name.split(' ')[0];
  };

  return (
    <div className="admin-sidebar">
      <div className="admin-header">
        <div className="admin-avatar">
          <span>👤</span>
        </div>
        <div className="admin-info">
          <h3 className="admin-name">{getDisplayName()}</h3>
          <span className="admin-role">Administrator</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <Link to="/" className={isActive("/") && location.pathname === "/" ? "nav-item active" : "nav-item"}>
          <span className="nav-icon">🏠</span>
          <span className="nav-text">Home</span>
        </Link>
        <Link to="/admin/dashboard" className={isActive("/admin/dashboard") ? "nav-item active" : "nav-item"}>
          <span className="nav-icon">📊</span>
          <span className="nav-text">Dashboard</span>
        </Link>
        <Link to="/admin/addteacher" className={isActive("/admin/addteacher") ? "nav-item active" : "nav-item"}>
          <span className="nav-icon">👨‍🏫</span>
          <span className="nav-text">Add Teacher</span>
        </Link>
        <Link to="/admin/teachers" className={isActive("/admin/teachers") ? "nav-item active" : "nav-item"}>
          <span className="nav-icon">👥</span>
          <span className="nav-text">Manage Teachers</span>
        </Link>
        <Link to="/admin/allstudents" className={isActive("/admin/allstudents") ? "nav-item active" : "nav-item"}>
          <span className="nav-icon">👨‍🎓</span>
          <span className="nav-text">All Students</span>
        </Link>
        <Link to="/admin/verifiedstudents" className={isActive("/admin/verifiedstudents") ? "nav-item active" : "nav-item"}>
          <span className="nav-icon">✅</span>
          <span className="nav-text">Verified Students</span>
        </Link>
        <Link to="/admin/pending" className={isActive("/admin/pending") ? "nav-item active" : "nav-item"}>
          <span className="nav-icon">⏳</span>
          <span className="nav-text">Pending Students</span>
        </Link>
        <Link to="/admin/settings" className={isActive("/admin/settings") ? "nav-item active" : "nav-item"}>
          <span className="nav-icon">⚙️</span>
          <span className="nav-text">Settings</span>
        </Link>
        <Link to="/admin/contacts" className={isActive("/admin/contacts") ? "nav-item active" : "nav-item"}>
          <span className="nav-icon">📩</span>
          <span className="nav-text">Contacts</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={logout}>
          <span className="logout-icon">🚪</span>
          <span className="logout-text">Logout</span>
        </button>
      </div>
    </div>
  );
}
