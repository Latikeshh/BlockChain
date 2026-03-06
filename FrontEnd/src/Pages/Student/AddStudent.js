import { useEffect, useState } from "react";
import { dialog } from "../../components/CustomDialog";
import { validateName, validateEnrollment, validatePassword, getFirstError } from "../../utils/validation";
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

    // Validate all fields using validation utilities
    const nameResult = validateName(name, "Student name");
    if (!nameResult.isValid) {
      dialog.warning("Validation Error", nameResult.error);
      return;
    }

    const enrollResult = validateEnrollment(enroll);
    if (!enrollResult.isValid) {
      dialog.warning("Validation Error", enrollResult.error);
      return;
    }

    const passwordResult = validatePassword(password, 6);
    if (!passwordResult.isValid) {
      dialog.warning("Validation Error", passwordResult.error);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/student/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, enroll, password }),
      });

      const data = await res.json();
      
      if (res.ok) {
        fetchStudents();
        setName("");
        setEnroll("");
        setPassword("");
        
        dialog.success("Success", "Student added successfully!");
        
        // Hide modal using Bootstrap
        const modal = document.getElementById("addStudentModal");
        if (modal) {
          const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
          if (bootstrapModal) bootstrapModal.hide();
        }
      } else {
        dialog.error("Error", data.message || "Failed to add student");
      }
    } catch (err) {
      dialog.error("Server Error", "Unable to connect to server. Please try again.");
    }
  };

  return (
    <div className="addstudent-container">
      {/* HEADER */}
      <div className="addstudent-header">
        <div>
          <h2>Student Management</h2>
          <p>Manage all enrolled students</p>
        </div>

        <div className="addstudent-header-actions">
          <input
            className="addstudent-search-box"
            placeholder="Search by name or enrollment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            className="btn-add-student"
            data-bs-toggle="modal"
            data-bs-target="#addStudentModal"
          >
            + Add Student
          </button>
        </div>
      </div>


      {/* TABLE CARD */}
      <div className="addstudent-table-card">
        <table className="addstudent-table">
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
                <td colSpan="3" className="addstudent-empty">
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
          <div className="modal-content addstudent-modal">

            <div className="modal-header">
              <h5>Add New Student</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <form onSubmit={handleAddStudent}>
              <div className="modal-body">

                <input
                  placeholder="Student Name"
                  className="addstudent-form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <input
                  placeholder="Enrollment Number"
                  className="addstudent-form-input"
                  value={enroll}
                  onChange={(e) => setEnroll(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Password"
                  className="addstudent-form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

              </div>

              <div className="modal-footer">
                <button className="btn-cancel-student" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button className="btn-save-student">
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
