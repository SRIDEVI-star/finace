import React, { useState } from "react";
import "./Header.css"; // CSS file for styling the header

const Header = ({ onRegisterClick, onLoginClick }) => { // Correctly destructure the props
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="logo">Financlo</div>
      <nav className={`nav ${isMenuOpen ? "nav--open" : ""}`}>
        <ul className="nav__list">
          <li className="nav__item">
            {/* Register link that triggers the onRegisterClick function */}
            <a href="#register" className="nav__link" onClick={(e) => {
              e.preventDefault(); // Prevent default anchor behavior
              onRegisterClick(); // Call function to show registration page
            }}>
              Register
            </a>
          </li>
          <li className="nav__item">
            {/* Login link that triggers the onLoginClick function */}
            <a href="#login" className="nav__link" onClick={(e) => {
              e.preventDefault(); // Prevent default anchor behavior
              onLoginClick(); // Call function to show login page
            }}>Login</a>
          </li>
          <li className="nav__item">
            <a href="#donate" className="nav__link">Donate</a>
          </li>
          <li className="nav__item">
            <a href="#careers" className="nav__link">Careers</a>
          </li>
          <li className="nav__item">
            <a href="#about" className="nav__link">About</a>
          </li>
        </ul>
      </nav>
      <div className="menu-toggle" onClick={toggleMenu}>
        <span className="menu-toggle__bar"></span>
        <span className="menu-toggle__bar"></span>
        <span className="menu-toggle__bar"></span>
      </div>
    </header>
  );
};

export default Header;


// import React, { useState } from "react";
// import "./Header.css"; // CSS file for styling the header
// import UserCreationForm from './UserCreationForm'; // Import your form component

// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [showRegisterForm, setShowRegisterForm] = useState(false); // State to show/hide the register form

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const handleRegisterClick = () => {
//     setShowRegisterForm(!showRegisterForm); // Toggle form visibility when Register is clicked
//   };

//   return (
//     <>
//     <header className="header">
//       <div className="logo">Financlo</div>
//       <nav className={`nav ${isMenuOpen ? "nav--open" : ""}`}>
//         <ul className="nav__list">
//           <li className="nav__item">

//           <button type="button" className="nav__link" onClick={handleRegisterClick}>Register</button>
//           </li>
//           <li className="nav__item">
//             <a href="#home" className="nav__link">Login</a>
//           </li>
//           <li className="nav__item">
//             <a href="#about" className="nav__link">Donate</a>
//           </li>
//           <li className="nav__item">
//             <a href="#services" className="nav__link">Careers</a>
//           </li>
//           <li className="nav__item">
//             <a href="#contact" className="nav__link">About</a>
//           </li>
//         </ul>
//       </nav>
//       <div className="menu-toggle" onClick={toggleMenu}>
//         <span className="menu-toggle__bar"></span>
//         <span className="menu-toggle__bar"></span>
//         <span className="menu-toggle__bar"></span>
//       </div>
//     </header>

//     {/* Conditionally render the user creation form */}
//     {showRegisterForm && (
//       <div className="form-container">
//         <UserCreationForm />
//       </div>
//     )}
//     </>
//   );
// };

// export default Header;



// import React, { useState } from "react";
// import "./Header.css"; // CSS file for styling the header

// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   return (
//     <>
//     <header className="header">
//       <div className="logo">Financlo</div>
//       <nav className={`nav ${isMenuOpen ? "nav--open" : ""}`}>
//         <ul className="nav__list">
//           <li className="nav__item">
//             <a href="#home" className="nav__link">Register</a>
//           </li>
//           <li className="nav__item">
//             <a href="#home" className="nav__link">Login</a>
//           </li>
//           <li className="nav__item">
//             <a href="#about" className="nav__link">Donate</a>
//           </li>
//           <li className="nav__item">
//             <a href="#services" className="nav__link">Careers</a>
//           </li>
//           <li className="nav__item">
//             <a href="#contact" className="nav__link">About</a>
//           </li>
//         </ul>
//       </nav>
//       <div className="menu-toggle" onClick={toggleMenu}>
//         <span className="menu-toggle__bar"></span>
//         <span className="menu-toggle__bar"></span>
//         <span className="menu-toggle__bar"></span>
//       </div>
//     </header>
//     </>
//   );
// };

// export default Header;
