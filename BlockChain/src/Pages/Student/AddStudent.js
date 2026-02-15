import { useEffect, useState } from "react";
import "./AddStudent.css";

export default function AddStudent() {
  const token = localStorage.getItem("token");
const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [enroll, setEnroll] = useState("");
  const [password, setPassword] = useState("");

  /* FETCH STUDENTS */
  const fetchStudents = async () => {
    try {
      const res = await fetch("http://localhost:8000/student/getst", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) setStudents(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  /* ADD STUDENT */
  const handleAddStudent = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8000/student/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, enroll, password }),
      });

      if (res.ok) {
        fetchStudents();
        setName("");
        setEnroll("");
        setPassword("");

        window.bootstrap.Modal.getInstance(
          document.getElementById("addStudentModal")
        ).hide();
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="admin-container">
      {/* HEADER */}
      <div className="admin-header">
  <div>
    <h2>Student Management</h2>
    <p>Manage all enrolled students</p>
  </div>

  <div className="header-actions">
    <input
      className="search-box"
      placeholder="Search by name or enrollment..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

    <button
      className="btn-add"
      data-bs-toggle="modal"
      data-bs-target="#addStudentModal"
    >
      + Add Student
    </button>
  </div>
</div>


      {/* TABLE CARD */}
      <div className="table-card">
        <table className="student-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Student Name</th>
              <th>Enrollment No</th>
            </tr>
          </thead>

          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="3" className="empty">
                  No Students Available
                </td>
              </tr>
            ) : (
                
              students
  .filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.enroll.toLowerCase().includes(search.toLowerCase())
  )
  .map((s, i) => (
                <tr key={s._id}>
                  <td>{i + 1}</td>
                  <td>{s.name}</td>
                  <td>{s.enroll}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <div className="modal fade" id="addStudentModal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content custom-modal">

            <div className="modal-header">
              <h5>Add New Student</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <form onSubmit={handleAddStudent}>
              <div className="modal-body">

                <input
                  placeholder="Student Name"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <input
                  placeholder="Enrollment Number"
                  className="form-input"
                  value={enroll}
                  onChange={(e) => setEnroll(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

              </div>

              <div className="modal-footer">
                <button className="btn-cancel" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button className="btn-save">
                  Save Student
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>

    </div>
  );
}
