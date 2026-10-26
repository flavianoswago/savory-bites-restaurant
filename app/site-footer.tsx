"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

const socialProfiles: { name: string; url: string | null }[] = [
  { name: "Instagram", url: null },
  { name: "Facebook", url: null },
  { name: "TikTok", url: null },
];

export default function SiteFooter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "info" | "success">("info");
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const lastSubmittedEmail = useRef("");
  const submitLock = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setCurrentYear(new Date().getFullYear()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  function scrollToTop() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  function handleNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitLock.current) return;

    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setMessageType("error");
      setMessage("Enter a valid email address.");
      return;
    }
    if (lastSubmittedEmail.current === normalizedEmail) {
      setMessageType("info");
      setMessage("This address was already checked. Newsletter signup is not connected yet, so it has not been sent or saved.");
      return;
    }

    submitLock.current = true;
    lastSubmittedEmail.current = normalizedEmail;
    setMessageType("info");
    setMessage("Thanks for your interest. Newsletter signup is not connected yet, so your email was not sent or saved.");
    submitLock.current = false;
  }

  return (
    <footer className="site-footer">
      <div className="site-footer-main">
        <section className="site-footer-brand" aria-labelledby="footer-brand-title">
          <a className="site-footer-logo" href="#home" aria-label="Savory Bites home">
            <span className="site-footer-mark" aria-hidden="true">S</span>
            <span id="footer-brand-title">Savory<span>Bites</span><i>.</i></span>
          </a>
          <p className="site-footer-tagline">Good food. Great moments.</p>
          <p className="site-footer-description">Fresh ingredients, generous plates, and a warm seat waiting for you in Kakamega.</p>
          <a className="site-footer-order" href="#menu">Order online <span aria-hidden="true">↗</span></a>
        </section>

        <nav className="site-footer-column" aria-label="Footer quick links">
          <h2>Explore</h2>
          <a href="#home">Home</a>
          <a href="#about">About us</a>
          <a href="#menu">Our menu</a>
          <a href="#reserve">Reservations</a>
          <a href="#menu">Order online</a>
          <a href="#contact">Contact us</a>
        </nav>

        <section className="site-footer-column site-footer-contact" aria-labelledby="footer-contact-title">
          <h2 id="footer-contact-title">Find us</h2>
          <p>Kakamega Town<br />P.O. Box 48654-597</p>
          <a href="tel:+254112810217">+254 112 810 217</a>
          <span className="site-footer-unavailable">Email address not provided</span>
          <a href="https://www.google.com/maps/search/?api=1&query=Savory+Bites+Kakamega+Town" target="_blank" rel="noreferrer">Get directions <span aria-hidden="true">↗</span></a>
        </section>

        <section className="site-footer-column site-footer-social" aria-labelledby="footer-social-title">
          <h2 id="footer-social-title">Follow along</h2>
          <div className="site-footer-social-list">
            {socialProfiles.map(({ name, url }) => url
              ? <a href={url} key={name} target="_blank" rel="noreferrer">{name} <span aria-hidden="true">↗</span></a>
              : <span className="site-footer-configurable" key={name} title={`Add the restaurant's ${name} profile URL to enable this link`}>{name}<small>Profile URL needed</small></span>)}
            <a href="https://wa.me/254112810217?text=Hello%20Savory%20Bites!" target="_blank" rel="noreferrer">WhatsApp <span aria-hidden="true">↗</span></a>
          </div>
        </section>

        <section className="site-footer-column site-footer-newsletter" aria-labelledby="footer-newsletter-title">
          <h2 id="footer-newsletter-title">A little something in your inbox</h2>
          <p>Get the latest specials and restaurant news.</p>
          <form className="site-footer-form" onSubmit={handleNewsletterSubmit}>
            <label className="sr-only" htmlFor="footer-email">Your email address</label>
            <input id="footer-email" name="email" type="email" autoComplete="email" placeholder="Email address" required value={email} onChange={(event) => { setEmail(event.target.value); setMessage(""); }} />
            <button type="submit">Subscribe <span aria-hidden="true">→</span></button>
          </form>
          <p className={`site-footer-feedback ${messageType}`} role="status" aria-live="polite">{message || "Your email will not be stored until newsletter signup is connected."}</p>
        </section>

        <section className="site-footer-column site-footer-legal" aria-labelledby="footer-legal-title">
          <h2 id="footer-legal-title">Information</h2>
          <span className="site-footer-unavailable">Privacy policy <small>Page to be created</small></span>
          <span className="site-footer-unavailable">Terms and conditions <small>Page to be created</small></span>
        </section>
      </div>

      <div className="site-footer-bottom">
        <small>© {currentYear ?? ""} Savory Bites Restaurant</small>
        <small>Made with care in Kakamega <span aria-hidden="true">✳</span></small>
        <button className="site-footer-top-link" type="button" onClick={scrollToTop}>Back to top <span aria-hidden="true">↑</span></button>
      </div>
    </footer>
  );
}
