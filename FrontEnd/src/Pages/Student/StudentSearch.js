import { useState, useEffect } from "react";
import StudentSidebar from "./StudentSidebar";
import "./StudentSearch.css";

export default function StudentSearch() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/student/getst", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setStudents(data);
        } else {
          setError(data.message || "Failed to fetch students");
        }
      } catch (err) {
        setError("Server error. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/student/searchst?keyword=${encodeURIComponent(search)}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setStudents(data);
      } else {
        setError(data.message || "Search failed");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.enroll?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="student-page-wrapper">
      <StudentSidebar />
      <div className="student-layout">
        <div className="search-content">
          <div className="search-container">
            <h2>Search Students</h2>
            <p className="subtitle">Find students by name or enrollment number</p>

            <form className="search-form" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Enter student name or enrollment number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                Search
              </button>
            </form>

            {loading ? (
              <div className="loading">Searching...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : (
              <div className="results-section">
                <p className="results-count">
                  {filteredStudents.length} student(s) found
                </p>

                <div className="students-grid">
                  {filteredStudents.length === 0 ? (
                    <div className="no-results">
                      No students found matching your search
                    </div>
                  ) : (
                    filteredStudents.map((student, index) => (
                      <div key={student._id} className="student-card">
                        <div className="student-index">{index + 1}</div>
                        <div className="student-details">
                          <h4>{student.name}</h4>
                          <p className="enrollment">Enroll: {student.enroll}</p>
                          <span className={`badge ${student.verify ? 'verified' : 'pending'}`}>
                            {student.verify ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
