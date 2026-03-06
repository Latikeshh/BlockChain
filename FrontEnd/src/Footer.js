import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        {/* ABOUT */}
        <div className="footer-col">
          <h3>About</h3>
          <ul>
            <li><Link to="/about">About System</Link></li>
            <li><Link to="/">Our Mission</Link></li>
            <li><Link to="/">Features</Link></li>
            <li><Link to="/">Team</Link></li>
          </ul>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/student/login">Login</Link></li>
          </ul>
        </div>

        {/* RESOURCES */}
        <div className="footer-col">
          <h3>Resources</h3>
          <ul>
            <li><Link to="/">Documentation</Link></li>
            <li><Link to="/">Help Center</Link></li>
            <li><Link to="/contact">FAQ</Link></li>
            <li><Link to="/">Support</Link></li>
          </ul>
        </div>

        {/* LEGAL */}
        <div className="footer-col">
          <h3>Legal</h3>
          <ul>
            <li><Link to="/">Privacy Policy</Link></li>
            <li><Link to="/">Terms of Service</Link></li>
            <li><Link to="/">Cookie Policy</Link></li>
            <li><Link to="/">Disclaimer</Link></li>
          </ul>
        </div>

      </div>

      {/* BRAND & BOTTOM */}
      <div className="footer-brand">
        <h2>Bapusaheb Shivajirao Deore Polytechnic</h2>
        <p>Empowering students with secure, transparent academic systems</p>
      </div>

      <div className="footer-bottom">
        © 2026 B.S. Deore Polytechnic. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
