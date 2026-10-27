"use client";

import { useEffect, useState } from "react";

const navigation = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "Our story" },
  { href: "#menu", label: "The menu" },
  { href: "#reserve", label: "Reservations" },
  { href: "#contact", label: "Visit us" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const sections = navigation
      .map(({ href }) => document.querySelector(href))
      .filter((section): section is Element => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(`#${visible.target.id}`);
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.15, 0.4] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <>
      <div className="topline" aria-label="Restaurant details">
        <span>Kakamega Town, Kenya</span>
        <span>Good food, good company</span>
        <span>Every day · 7am–8pm</span>
      </div>
      <header className="navbar">
        <a className="logo" href="#home" aria-label="Savory Bites home">
          <span className="logo-mark" aria-hidden="true">S</span>
          <span className="logo-type">Savory <em>Bites</em><i>.</i></span>
        </a>

        <button
          className={`menu-toggle${menuOpen ? " is-open" : ""}`}
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true" /><span aria-hidden="true" />
        </button>

        <nav
          className={`nav-links${menuOpen ? " is-open" : ""}`}
          id="primary-navigation"
          aria-label="Main navigation"
        >
          {navigation.map(({ href, label }) => (
            <a
              href={href}
              key={href}
              aria-current={activeSection === href ? "location" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
          <a className="nav-mobile-cta" href="#menu" onClick={() => setMenuOpen(false)}>
            Order from the menu <span aria-hidden="true">↗</span>
          </a>
        </nav>

        <a className="nav-button" href="#menu">Order from the menu <span aria-hidden="true">↗</span></a>
      </header>
    </>
  );
}
