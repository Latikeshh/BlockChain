import { useEffect, useState } from "react";
import "./VerifiedStudents.css";

export default function VerifiedStudents() {
  const token = localStorage.getItem("token");

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  /* FETCH VERIFIED STUDENTS */
  const fetchVerified = async () => {
    try {
      const res = await fetch("http://localhost:8000/student/verified", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) setStudents(data);
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
    <div className="verified-container">
      {/* HEADER */}
      <div className="verified-header">
        <div>
          <h2>Verified Students</h2>
          <p>List of all approved students</p>
        </div>

        <input
          className="search-input"
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="verified-table-card">
        <table className="verified-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Student Name</th>
              <th>Enrollment</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty">
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
                    <span className="badge-verified">Verified</span>
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
