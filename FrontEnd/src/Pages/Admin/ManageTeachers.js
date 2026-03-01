import { useEffect, useState } from "react";
import { Table, Button, Card, Spinner } from "react-bootstrap";
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

  const filtered = teachers.filter(
    (t) =>
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="manage-wrapper">
      <div className="manage-header">
        <div>
          <h2>Manage Teachers</h2>
          <p>View, edit and manage teacher accounts</p>
        </div>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-box"
        />
      </div>

      <Card className="manage-card">
        <Card.Body>
          {loading ? (
            <div className="loading-container">
              <Spinner animation="border" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-container">
              <p>No teachers found.</p>
            </div>
          ) : (
            <Table hover responsive className="manage-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((teacher, index) => (
                  <tr key={teacher._id}>
                    <td>{index + 1}</td>
                    <td className="teacher-name">{teacher.name}</td>
                    <td>{teacher.email}</td>
                    <td className="action-column">
                      <Button
                        size="sm"
                        className="edit-btn"
                        onClick={() =>
                          window.alert("Edit feature coming soon")
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        className="delete-btn"
                        onClick={() => handleDelete(teacher._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}