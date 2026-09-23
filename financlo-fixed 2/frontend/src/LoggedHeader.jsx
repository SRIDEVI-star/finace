import React, { useState } from "react";
import "./Header.css";

const LoggedHeader = ({ username, onDashboardClick, onLogoutClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="logo">Financlo</div>
      <nav className={`nav ${isMenuOpen ? "nav--open" : ""}`}>
        <ul className="nav__list">
          <li className="nav__item">
            <a
              href="#dashboard"
              className="nav__link"
              onClick={(e) => {
                e.preventDefault();
                onDashboardClick();
              }}
            >
              Dashboard{username ? ` (${username})` : ""}
            </a>
          </li>
          <li className="nav__item">
            <a
              href="#logout"
              className="nav__link"
              onClick={(e) => {
                e.preventDefault();
                onLogoutClick();
              }}
            >
              Log out
            </a>
          </li>
        </ul>
      </nav>
      <div className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <span className="menu-toggle__bar"></span>
        <span className="menu-toggle__bar"></span>
        <span className="menu-toggle__bar"></span>
      </div>
    </header>
  );
};

export default LoggedHeader;
