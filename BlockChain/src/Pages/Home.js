import { useEffect, useState } from "react";
import "./Home.css";
// images
import hero1 from "../Images/ssvps1.jpg";
import hero2 from "../Images/ssvpss2.jpg";
import hero3 from "../Images/ssvps3.jpg";

export default function App() {
  const images = [hero1, hero2, hero3];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="app">
      {/* HERO / CAROUSEL */}
      <section className="hero">
        <img src={images[index]} alt="hero" className="hero-img" />

        <div className="hero-content">
          <h1>
            Blockchain Based <span>Student Record System</span>
          </h1>
          <p>Secure • Transparent • Tamper-Proof Academic Verification</p>
        </div>

        {/* 🔵 INDICATORS */}
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
          Our system ensures secure, reliable and verifiable academic records.
        </p>

        <div className="feature-cards">
          <div className="feature-card">
            <span>🔐</span>
            <h3>Secure Storage</h3>
            <p>Student data is safely stored with encryption.</p>
          </div>

          <div className="feature-card">
            <span>⛓️</span>
            <h3>Blockchain Proof</h3>
            <p>SHA-256 hash stored on blockchain.</p>
          </div>

          <div className="feature-card">
            <span>🧾</span>
            <h3>Tamper Detection</h3>
            <p>Any change in record is detected.</p>
          </div>

          <div className="feature-card">
            <span>👨‍🎓</span>
            <h3>Student Access</h3>
            <p>Students can view and share records.</p>
          </div>

          <div className="feature-card">
            <span>🏛️</span>
            <h3>Admin Verification</h3>
            <p>Colleges verify records instantly.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
