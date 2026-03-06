import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dialog } from "./../components/CustomDialog";
import "./Teacher/TeacherRequests.css"; // reuse styles for list items

const ContactList = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/teacher/login");
      return;
    }

    fetch("http://localhost:8000/contact/all", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setContacts(data.data);
        } else {
          dialog.error("Error", data.message || "Failed to fetch contacts");
        }
      })
      .catch((err) => {
        console.error(err);
        dialog.error("Error", "Server error");
      })
      .finally(() => setLoading(false));
  }, [token, navigate]);

  return (
    <div className="teacher-req-layout">
      {/* if used under admin layout the sidebar is different, but styles still apply */}
      <div className="teacher-req-content">
        <div className="teacher-req-container">
          <h2>Contact Messages</h2>
          {loading ? (
            <p>Loading...</p>
          ) : contacts.length === 0 ? (
            <p>No messages found.</p>
          ) : (
            <ul className="req-list">
              {contacts.map((c) => (
                <li key={c._id} className="req-item">
                  <div className="req-main">
                    <span className="student-info">
                      {c.firstName} {c.lastName} &lt;{c.email}&gt;
                    </span>
                    <span className="category">{c.purpose || "-"}</span>
                    <span className="details">{c.message}</span>
                  </div>
                  <div className="req-actions">
                    <span className="status-tag">
                      {new Date(c.createdAt).toLocaleString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactList;
