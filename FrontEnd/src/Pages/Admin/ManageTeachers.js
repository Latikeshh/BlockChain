import { useEffect, useState } from "react";
import { dialog } from "../../components/CustomDialog";
import "./ManageTeachers.css";

export default function ManageTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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
    dialog.confirm(
      "Delete Teacher",
      "Are you sure you want to delete this teacher?",
      async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`http://localhost:8000/teacher/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.ok) {
            dialog.success("Deleted", "Teacher deleted successfully");
            fetchTeachers();
          } else {
            dialog.error("Error", "Unable to delete teacher");
          }
        } catch (err) {
          dialog.error("Error", "Unable to delete teacher");
        }
      }
    );
  };

  const filtered = teachers.filter(
    (t) =>
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="teachers-container">
      <div className="teachers-header">
        <div>
          <h2>Manage Teachers</h2>
          <p>View, edit and manage teacher accounts</p>
        </div>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="teachers-search-input"
        />
      </div>

      {loading ? (
        <div className="teachers-loading">Loading teachers...</div>
      ) : filtered.length === 0 ? (
        <div className="teachers-empty">No Teachers Found</div>
      ) : (
        <div className="teachers-table-card">
          <table className="teachers-table">
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Teacher Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((teacher, index) => (
                <tr key={teacher._id}>
                  <td>{index + 1}</td>
                  <td>{teacher.name}</td>
                  <td>{teacher.email}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => dialog.info("Coming soon", "Edit feature coming soon")}
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
        </div>
      )}
    </div>
  );
}
