import React, { useState } from "react";
import { Link } from "react-router-dom";
import { logout } from "../../../features/userSlice";
import { useCustomDispatch } from "../../../test";
import ProfileButton from "../navbar-profile-button/navbar-profile-button";
import "./navbar.styles.css";

const NavbarDropdown = (props) => {
  const [display, setDisplay] = useState(false);
  const dispatch = useCustomDispatch();

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
  };

  return (
    <>
      <div className="svg-dropdown-div" onClick={() => setDisplay(!display)}>
        <div className="svg-dropdown">
          <ProfileButton hideMenu={props.hideMenu} />
        </div>
      </div>
      <div className="dropdown-outter">
        <div
          className={
            display ? "dropdown-container showing" : "dropdown-container"
          }
        >
          <div className="dropdown">
            <div className="dropdown-item">
              <Link className="dropdown-item-a" to="/profile">
                Profile
              </Link>
            </div>
            <div className="dropdown-item"  style={{color: "#6441a4"}}>
              <div onClick={handleLogout} className="dropdown-item-a">
                LogOut
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarDropdown;
