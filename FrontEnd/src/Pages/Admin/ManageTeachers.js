import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import "./ManageTeachers.css";
import EditTeacherDialog from "../../components/EditTeacherDialog";

export default function ManageTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      window.location.href =
        role === "teacher" ? "/teacher/dashboard" : "/";
      return;
    }
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/teacher/teachers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setTeachers(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?"))
      return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/teacher/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        fetchTeachers();
      } else {
        alert("Error deleting teacher");
      }
    } catch (err) {
      alert("Error deleting teacher");
    }
  };

  const handleEditClick = (teacher) => {
    setSelectedTeacher(teacher);
    setShowEditDialog(true);
  };

  const handleSaveTeacher = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/teacher/${selectedTeacher._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Teacher updated successfully!");
        setShowEditDialog(false);
        setSelectedTeacher(null);
        fetchTeachers();
      } else {
        alert(data.message || "Error updating teacher");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating teacher");
    }
  };

  const filtered = teachers.filter(
    (t) =>
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.email?.toLowerCase().includes(search.toLowerCase())
  );

  const getPermissionLabel = (teacher) => {
    const p = teacher?.permissions || {};
    const labels = [];
    if (p.dashboard) labels.push("Dashboard");
    if (p.verifiedStudents) labels.push("Verified");
    if (p.pendingStudents) labels.push("Pending");
    if (p.changeRequests) labels.push("Requests");
    if (p.contacts) labels.push("Contacts");
    return labels.length ? labels.join(", ") : "No Access";
  };

  return (
    <div className="teacher-page-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Manage Teachers</h1>
          <p className="header-subtitle">View, edit and manage teacher accounts</p>
        </div>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Table Card */}
      <div className="teacher-table-card">
        <div className="table-card-body">
          {loading ? (
            <div className="loading-state">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">👨‍🏫</span>
              <p>No teachers found.</p>
            </div>
          ) : (
            <table className="teacher-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Access</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((teacher, index) => (
                  <tr key={teacher._id}>
                    <td>{index + 1}</td>
                    <td className="teacher-name">{teacher.name}</td>
                    <td>{teacher.email}</td>
                    <td>{getPermissionLabel(teacher)}</td>
                    <td className="actions-cell">
                      <button
                        className="btn-edit"
                        onClick={() => handleEditClick(teacher)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(teacher._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Edit Teacher Dialog */}
      <EditTeacherDialog
        show={showEditDialog}
        onHide={() => {
          setShowEditDialog(false);
          setSelectedTeacher(null);
        }}
        teacher={selectedTeacher}
        onSave={handleSaveTeacher}
      />
    </div>
  );
}
