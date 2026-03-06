import { Link, useNavigate, useLocation } from "react-router-dom";
import "./TeacherSiderbar.css";

const defaultPermissions = {
  dashboard: true,
  verifiedStudents: true,
  pendingStudents: true,
  changeRequests: true,
  passwordResetRequests: true,
  contacts: true,
  managePermissions: true,
};

const parsePermissions = () => {
  const raw = localStorage.getItem("teacherPermissions");
  if (!raw) return defaultPermissions;

  try {
    const parsed = JSON.parse(raw);
    return {
      dashboard:
        typeof parsed.dashboard === "boolean"
          ? parsed.dashboard
          : defaultPermissions.dashboard,
      verifiedStudents:
        typeof parsed.verifiedStudents === "boolean"
          ? parsed.verifiedStudents
          : defaultPermissions.verifiedStudents,
      pendingStudents:
        typeof parsed.pendingStudents === "boolean"
          ? parsed.pendingStudents
          : defaultPermissions.pendingStudents,
      changeRequests:
        typeof parsed.changeRequests === "boolean"
          ? parsed.changeRequests
          : defaultPermissions.changeRequests,
      passwordResetRequests:
        typeof parsed.passwordResetRequests === "boolean"
          ? parsed.passwordResetRequests
          : defaultPermissions.passwordResetRequests,
      contacts:
        typeof parsed.contacts === "boolean"
          ? parsed.contacts
          : defaultPermissions.contacts,
    };
  } catch {
    return defaultPermissions;
  }
};

export default function TeacherSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const name = localStorage.getItem("name") || "Teacher";
  const permissions = parsePermissions();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isActive = (path) => {
    if (path === "/teacher/dashboard" || path === "/") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const getDisplayName = () => {
    if (!name || name === "Teacher") return "Teacher";
    return name.split(' ')[0];
  };

  return (
    <div className="teacher-sidebar">
      <div className="teacher-header">
        <div className="teacher-avatar">
          <span>👨‍🏫</span>
        </div>
        <div className="teacher-info">
          <h3 className="teacher-name">{getDisplayName()}</h3>
          <span className="teacher-role">Teacher</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <Link to="/" className={isActive("/") && location.pathname === "/" ? "nav-item active" : "nav-item"}>
          <span className="nav-icon">🏠</span>
          <span className="nav-text">Home</span>
        </Link>

        {permissions.dashboard && (
          <Link to="/teacher/dashboard" className={isActive("/teacher/dashboard") ? "nav-item active" : "nav-item"}>
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </Link>
        )}

        {permissions.verifiedStudents && (
          <Link to="/teacher/verifiedstudents" className={isActive("/teacher/verifiedstudents") ? "nav-item active" : "nav-item"}>
            <span className="nav-icon">✅</span>
            <span className="nav-text">Verified Students</span>
          </Link>
        )}

        {permissions.pendingStudents && (
          <Link to="/teacher/pending" className={isActive("/teacher/pending") ? "nav-item active" : "nav-item"}>
            <span className="nav-icon">⏳</span>
            <span className="nav-text">Pending Students</span>
          </Link>
        )}

        {permissions.changeRequests && (
          <>
            <Link to="/teacher/info-requests" className={isActive("/teacher/info-requests") ? "nav-item active" : "nav-item"}>
              <span className="nav-icon">📋</span>
              <span className="nav-text">Manage Requests</span>
            </Link>
          </>
        )}

        {permissions.managePermissions && (
          <Link to="/teacher/permissions" className={isActive("/teacher/permissions") ? "nav-item active" : "nav-item"}>
            <span className="nav-icon">🔐</span>
            <span className="nav-text">Permissions</span>
          </Link>
        )}

        {permissions.passwordResetRequests && (
          <Link to="/teacher/password-reset-requests" className={isActive("/teacher/password-reset-requests") ? "nav-item active" : "nav-item"}>
            <span className="nav-icon">🔑</span>
            <span className="nav-text">Password Reset</span>
          </Link>
        )}

        {permissions.contacts && (
          <Link to="/teacher/contacts" className={isActive("/teacher/contacts") ? "nav-item active" : "nav-item"}>
            <span className="nav-icon">📩</span>
            <span className="nav-text">Contacts</span>
          </Link>
        )}
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

