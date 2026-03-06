import { useState, useEffect } from "react";
import "./AdminPendingStudents.css";

export default function AdminPendingStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPendingStudents = async () => {
      try {
        const res = await fetch("http://localhost:8000/student/pending", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setStudents(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingStudents();
  }, [token]);

  const filteredStudents = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.enroll?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-pending-container">
      <div className="admin-pending-header">
        <div className="header-content">
          <h2>Pending Students</h2>
          <p>Students awaiting verification</p>
        </div>

        <input
          className="admin-search-input"
          placeholder="Search by name or enrollment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="admin-loading">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <>
          <div className="admin-pending-table-card">
            <table className="admin-pending-table">
              <thead>
                <tr>
                  <th>Sr No</th>
                  <th>Student Name</th>
                  <th>Enrollment No</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="admin-empty">
                      No Pending Students Found
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student, index) => (
                    <tr key={student._id}>
                      <td>{index + 1}</td>
                      <td>{student.name}</td>
                      <td>{student.enroll}</td>
                      <td>
                        <span className="admin-badge-pending">Pending</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
