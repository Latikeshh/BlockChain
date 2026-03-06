import { useState } from "react";
import { dialog } from "../../components/CustomDialog";
import "./AdminSettings.css";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: "Blockchain Student Record System",
    allowStudentRegistration: true,
    requireEmailVerification: false,
    maxFileSize: 5,
    retentionDays: 365
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate saving - in real app, this would call an API
    setTimeout(() => {
      dialog.success("Settings Saved", "Your settings have been saved successfully!");
      setLoading(false);
    }, 500);
  };

  return (
    <div className="form-page-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">System Settings</h1>
          <p className="header-subtitle">Configure system preferences and options</p>
        </div>
      </div>

      <div className="form-content">
        <div className="form-card">
          <div className="form-card-body">
            <form onSubmit={handleSubmit}>
              {/* General Settings */}
              <h5 className="section-title">General Settings</h5>
              <div className="form-group">
                <label className="form-label-custom">Site Name</label>
                <input
                  type="text"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleChange}
                  className="form-control-custom"
                />
              </div>

              {/* Registration Settings */}
              <h5 className="section-title">Registration Settings</h5>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="allowStudentRegistration"
                    checked={settings.allowStudentRegistration}
                    onChange={handleChange}
                  />
                  <span className="checkbox-text">Allow Student Registration</span>
                </label>
              </div>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="requireEmailVerification"
                    checked={settings.requireEmailVerification}
                    onChange={handleChange}
                  />
                  <span className="checkbox-text">Require Email Verification</span>
                </label>
              </div>

              {/* Data Settings */}
              <h5 className="section-title">Data Settings</h5>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label-custom">Max File Size (MB)</label>
                  <input
                    type="number"
                    name="maxFileSize"
                    value={settings.maxFileSize}
                    onChange={handleChange}
                    min="1"
                    max="50"
                    className="form-control-custom"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label-custom">Data Retention (Days)</label>
                  <input
                    type="number"
                    name="retentionDays"
                    value={settings.retentionDays}
                    onChange={handleChange}
                    min="30"
                    max="1825"
                    className="form-control-custom"
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Saving..." : "💾 Save Settings"}
              </button>
            </form>
          </div>
        </div>

        <div className="info-card">
          <div className="info-card-body">
            <h5 className="info-title">⚙️ Settings Info</h5>
            <p className="info-text">
              Configure how the system handles student records and registrations.
            </p>
            <ul className="info-list">
              <li className="info-list-item"><strong>Student Registration</strong> - Enable/disable new student signups</li>
              <li className="info-list-item"><strong>Email Verification</strong> - Require email confirmation</li>
              <li className="info-list-item"><strong>File Size</strong> - Max upload size per student</li>
              <li className="info-list-item"><strong>Data Retention</strong> - How long to keep records</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
