// Navbar.js
import React, { useState } from "react";
import "./nav.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-search">
          <input type="text" placeholder="Search..." className="search-input" />
          <button className="search-button">Search</button>
        </div>
        <div className="navbar-user">
          <img
            src="https://lh3.googleusercontent.com/a/ACg8ocLrB6YNsq05Ar9UsVXDphd2VedW-flUA8Bja5VXXvelcDC9g48=s432-c-no"
            alt="Musab Abbasi"
            className="user-avatar"
            onClick={toggleDropdown}
          />
          {dropdownVisible && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <img
                  src="https://lh3.googleusercontent.com/a/ACg8ocLrB6YNsq05Ar9UsVXDphd2VedW-flUA8Bja5VXXvelcDC9g48=s432-c-no" 
                  alt="Musab Abbasi"
                  className="dropdown-avatar"
                />
                <span className="user-name">Musab Abbasi</span> 
              </div>
              <div className="dropdown-footer">
                <button className="logout-button">Logout</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
