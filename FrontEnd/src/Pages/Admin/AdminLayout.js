import AdminSidebar from "./AdminSidebar";
import "./AdminLayout.css";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="admin-main-content">
        {children}
      </div>
    </div>
  );
}
