import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Colors from "../Variables.js";
import hero1 from "../Images/ssvps1.jpg";
import hero2 from "../Images/ssvpss2.jpg";
import hero3 from "../Images/ssvps3.jpg";

export default function Home() {
  const navigate = useNavigate();
  const images = [hero1, hero2, hero3];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="app">
      {/* HERO / CAROUSEL */}
      <section className="hero">
        <img src={images[index]} alt="hero" className="hero-img" />
        
        {/* Overlay */}
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <h1>
            Blockchain Based
            <span>Student Record System</span>
          </h1>
          <p>Secure • Transparent • Tamper-Proof Academic Verification</p>
          <button onClick={() => navigate("/student/login")}>Get Started</button>
        </div>

        {/* Carousel Indicators */}
        <div className="carousel-indicators">
          {images.map((_, i) => (
            <span
              key={i}
              className={i === index ? "dot active" : "dot"}
              onClick={() => setIndex(i)}
            ></span>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <h2>Key System Features</h2>
        <p className="features-sub">
          Our system ensures secure, reliable and verifiable academic records using cutting-edge blockchain technology.
        </p>

        <div className="feature-cards">
          <div className="feature-card">
            <span className="feature-icon">🔐</span>
            <h3>Secure Storage</h3>
            <p>Student data is safely stored with enterprise-grade encryption.</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">⛓️</span>
            <h3>Blockchain Proof</h3>
            <p>SHA-256 hash stored on immutable blockchain ledger.</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">🧾</span>
            <h3>Tamper Detection</h3>
            <p>Any change in record is instantly detected and flagged.</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">👨‍🎓</span>
            <h3>Student Access</h3>
            <p>Students can view and share records with employers.</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">🏛️</span>
            <h3>Admin Verification</h3>
            <p>Colleges verify records instantly with digital signatures.</p>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="stats">
        <div className="stat-item">
          <span className="stat-number">100+</span>
          <span className="stat-labell">Students Verified</span>
        </div>
        {/* <div className="stat-item">
          <span className="stat-number">50+</span>
          <span className="stat-labell">Partner Institutions</span>
        </div> */}
        <div className="stat-item">
          <span className="stat-number">100%</span>
          <span className="stat-labell">Secure Records</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">24/7</span>
          <span className="stat-labell">System Availability</span>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Academic Verification?</h2>
          <p>Join the future of secure, transparent student record management. Get started today.</p>
          <div className="cta-buttons">
            <a href="/student/login" className="cta-btn cta-btn-primary">Student Login</a>
            <a href="/teacher/login" className="cta-btn cta-btn-secondary">Teacher Login</a>
          </div>
        </div>
      </section>
    </div>
  );
}
