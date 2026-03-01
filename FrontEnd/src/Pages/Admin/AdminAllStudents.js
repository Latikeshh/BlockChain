import { useEffect, useState } from "react";
import "./AdminAllStudents.css";

export default function AdminAllStudents() {
  const token = localStorage.getItem("token");

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* FETCH ALL STUDENTS */
  const fetchAllStudents = async () => {
    try {
      const res = await fetch("http://localhost:8000/student/getst", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setStudents(data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStudents();
  }, []);

  /* FILTERED LIST */
  const filtered = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.enroll?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-all-container">
      {/* HEADER */}
      <div className="admin-all-header">
        <div className="header-content">
          <h2>All Students</h2>
          <p>Complete list of all registered students</p>
        </div>

        <input
          className="admin-search-input"
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="admin-loading">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="admin-all-table-card">
          <table className="admin-all-table">
            <thead>
              <tr>
                <th>Sr.No</th>
                <th>Student Name</th>
                <th>Enrollment</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="4" className="admin-empty">
                    No Students Found
                  </td>
                </tr>
              ) : (
                filtered.map((s, i) => (
                  <tr key={s._id}>
                    <td>{i + 1}</td>
                    <td>{s.name}</td>
                    <td>{s.enroll}</td>
                    <td>
                      {s.verify ? (
                        <span className="admin-badge-verified">Verified</span>
                      ) : (
                        <span className="admin-badge-pending">Pending</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
