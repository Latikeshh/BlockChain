import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Student/StudentLogin.css"
import logo from "../Images/clglogo.png";

export default function TeacherLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  /* ===================== TEACHER LOGIN ===================== */
  const handleTeacherLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/teacher/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", "teacher");
        localStorage.setItem("name", data.user.name);
        navigate("/teacher/dashboard");
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="background1">
      <div className="container">
        <div className="form-container sign-in-container">
          <form onSubmit={handleTeacherLogin}>
            <img src={logo} alt="logo" className="login-logo" />
            <h2>Teacher Login</h2>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Link to="/">Forgot password?</Link>
            <button type="submit" className="btn">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
