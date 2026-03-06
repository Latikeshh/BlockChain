import { useState } from "react";
import { dialog } from "../../components/CustomDialog";
import { validateName, validateEmail, validatePassword } from "../../utils/validation";
import "./AddTeacher.css";

const initialPermissions = {
  dashboard: false,
  verifiedStudents: false,
  pendingStudents: false,
  changeRequests: false,
  contacts: false,
};

export default function AddTeacher() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    permissions: initialPermissions,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePermissionToggle = (key) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [key]: !prev.permissions[key],
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate name
    const nameResult = validateName(formData.name, "Teacher name");
    if (!nameResult.isValid) {
      dialog.error("Validation Error", nameResult.error);
      return;
    }

    // Validate email
    const emailResult = validateEmail(formData.email);
    if (!emailResult.isValid) {
      dialog.error("Validation Error", emailResult.error);
      return;
    }

    // Validate password
    const passwordResult = validatePassword(formData.password, 6);
    if (!passwordResult.isValid) {
      dialog.error("Validation Error", passwordResult.error);
      return;
    }

    const selectedPermissionCount = Object.values(formData.permissions).filter(Boolean).length;
    if (selectedPermissionCount === 0) {
      dialog.error("Select Access", "Please select at least one permission for this teacher.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/teacher/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          permissions: formData.permissions,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        dialog.success("Added", "Teacher added successfully!");
        setFormData({
          name: "",
          email: "",
          password: "",
          permissions: initialPermissions,
        });
      } else {
        dialog.error("Error", data.message || "Error adding teacher");
      }
    } catch (err) {
      dialog.error("Error", "Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-teacher-page">
      <div className="add-teacher-header">
        <div className="add-teacher-header-content">
          <h1 className="add-teacher-title">Add New Teacher</h1>
          <p className="add-teacher-subtitle">
            Create a new teacher account with access to the system
          </p>
        </div>
      </div>

      <div className="add-teacher-content">
        <div className="add-teacher-card">
          <div className="add-teacher-card-body">
            <form onSubmit={handleSubmit}>
              
              <div className="add-teacher-row">
                <div className="add-teacher-group">
                  <label className="add-teacher-label">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter teacher name"
                    className="add-teacher-input"
                    required
                  />
                </div>

                <div className="add-teacher-group">
                  <label className="add-teacher-label">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    className="add-teacher-input"
                    required
                  />
                </div>
              </div>

              <div className="add-teacher-row">
                <div className="add-teacher-group">
                  <label className="add-teacher-label">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className="add-teacher-input"
                    required
                  />
                </div>
              </div>

              <div className="add-teacher-permission-group">
                <label className="add-teacher-label">
                  Teacher Access Options *
                </label>

                <div className="add-teacher-permission-grid">

                  <label className="add-teacher-permission-item">
                    <input
                      type="checkbox"
                      checked={formData.permissions.dashboard}
                      onChange={() => handlePermissionToggle("dashboard")}
                    />
                    <span>Dashboard</span>
                  </label>

                  <label className="add-teacher-permission-item">
                    <input
                      type="checkbox"
                      checked={formData.permissions.verifiedStudents}
                      onChange={() => handlePermissionToggle("verifiedStudents")}
                    />
                    <span>Verified Students</span>
                  </label>

                  <label className="add-teacher-permission-item">
                    <input
                      type="checkbox"
                      checked={formData.permissions.pendingStudents}
                      onChange={() => handlePermissionToggle("pendingStudents")}
                    />
                    <span>Pending Students</span>
                  </label>

                  <label className="add-teacher-permission-item">
                    <input
                      type="checkbox"
                      checked={formData.permissions.changeRequests}
                      onChange={() => handlePermissionToggle("changeRequests")}
                    />
                    <span>Change Requests</span>
                  </label>

                  <label className="add-teacher-permission-item">
                    <input
                      type="checkbox"
                      checked={formData.permissions.contacts}
                      onChange={() => handlePermissionToggle("contacts")}
                    />
                    <span>Contacts</span>
                  </label>

                </div>
              </div>

              <button
                type="submit"
                className="add-teacher-submit"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Teacher"}
              </button>

            </form>
          </div>
        </div>

        <div className="add-teacher-info-card">
          <div className="add-teacher-info-body">
            <h5 className="add-teacher-info-title">Instructions</h5>
            <p className="add-teacher-info-text">
              Fill in the teacher details to create a new teacher account.
            </p>
            <ul className="add-teacher-info-text">
              <li><strong>Name and Email</strong> are required</li>
              <li><strong>Password</strong> for teacher login</li>
              <li>Choose access options for each teacher while creating account</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}