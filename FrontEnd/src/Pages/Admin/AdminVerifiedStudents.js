import { useEffect, useState } from "react";
import "./AdminVerifiedStudents.css";

export default function AdminVerifiedStudents() {
  const token = localStorage.getItem("token");

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* FETCH VERIFIED STUDENTS */
  const fetchVerified = async () => {
    try {
      const res = await fetch("http://localhost:8000/student/verified", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setStudents(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchVerified();
  }, []);

  /* FILTERED LIST */
  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.enroll.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-verified-container">
      {/* HEADER */}
      <div className="admin-verified-header">
        <div>
          <h2>Verified Students</h2>
          <p>List of all approved students</p>
        </div>

        <input
          className="admin-search-input"
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="admin-verified-table-card">
        <table className="admin-verified-table">
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
                  No Verified Students Found
                </td>
              </tr>
            ) : (
              filtered.map((s, i) => (
                <tr key={s._id}>
                  <td>{i + 1}</td>
                  <td>{s.name}</td>
                  <td>{s.enroll}</td>
                  <td>
                    <span className="admin-badge-verified">Verified</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
