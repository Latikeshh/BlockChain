import { Link, useNavigate } from "react-router-dom";
import "./AdminSidebar.css";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "Admin";

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="admin-sidebar">
      <h3 className="logo">Admin 77Panel</h3>
      
      <p className="welcome">Welcome,<br/> {name}</p>

      <nav className="sidebar-nav">
        <Link to="/" className="nav-item">
          <span className="nav-icon">🏠</span>
          Home
        </Link>
        <Link to="/admin/dashboard" className="nav-item">
          <span className="nav-icon">📊</span>
          Dashboard
        </Link>
        <Link to="/admin/addteacher" className="nav-item">
          <span className="nav-icon">👨‍🏫</span>
          Add Teacher
        </Link>
        <Link to="/admin/teachers" className="nav-item">
          <span className="nav-icon">👥</span>
          Manage Teachers
        </Link>
        <Link to="/admin/allstudents" className="nav-item">
          <span className="nav-icon">👨‍🎓</span>
          All Students
        </Link>
        <Link to="/admin/verifiedstudents" className="nav-item">
          <span className="nav-icon">✅</span>
          Verified Students
        </Link>
        <Link to="/admin/pending" className="nav-item">
          <span className="nav-icon">⏳</span>
          Pending Students
        </Link>
        <Link to="/admin/settings" className="nav-item">
          <span className="nav-icon">⚙️</span>
          Settings
        </Link>
        <Link to="/admin/contacts" className="nav-item">
          <span className="nav-icon">📩</span>
          Contacts
        </Link>
      </nav>

      <button className="logout-btn" onClick={logout}>
        🚪 Logout
      </button>
    </div>
  );
}
