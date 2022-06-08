import React from 'react';
import { Link } from 'react-router-dom';
import NavbarAvatar from '../navbar-avatar-svg/navbar-avatar-svg';

function ProfileButton(props) {
  return (
    <>
      <div>
        <NavbarAvatar />
      </div>
      <li className="linkNav">
        <Link onClick={props.hideMenu} className="link" to="/profile">
          Abdelmoghit
        </Link>
      </li>
    </>
  );
}

export default ProfileButton;
