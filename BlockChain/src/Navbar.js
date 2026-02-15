import { Link, useNavigate } from "react-router-dom";
import logo from "../src/Images/clglogo.png";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const dashboardPath =
  role === "teacher"
    ? "/teacher/dashboard"
    : role === "student"
    ? "/student/dashboard"
    : "/";

  return (
    <>
      {/* TOP BAR */}
      <div className="N-top-bar">
        <div className="N-marquee">
          <p>
            Shri Shivaji Vidya Prasarak Sanstha's Bapusaheb Shivajirao Deore Polytechnic
          </p>
        </div>
      </div>

      <header className="N-navbar">
        {/* LEFT */}
        <div className="N-nav-left">
          <img src={logo} alt="logo" />
          <h3>B.S. Deore Polytechnic</h3>
        </div>

        {/* RIGHT */}
        <nav className="N-nav-right">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          {/* IF LOGGED IN */}
          {role ? (
            <>
              <Link to={dashboardPath}>
                Dashboard
              </Link>
             <div className="dropdown N-dropdown">
              <Link
                className="N-login-btn dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown">
                👤
              </Link>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item" to={dashboardPath}>
                    {name}<br></br>
                    ({role})
                  </Link>
                </li>
              </ul>
            </div>
              <Link className="N-logout-btn" onClick={handleLogout}>
                Logout
              </Link>
            </>
          ) : (
            /* LOGIN DROPDOWN */
            <div className="dropdown N-dropdown">
              <Link
                className="N-login-btn dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown">
                Login
              </Link>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item" to="/student/login">
                    Student
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/teacher/login">
                    Teacher
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </nav>
      </header>
    </>
  );
};

export default Navbar;