import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/userSlice";
import NavbarAvatar from "../navbar-avatar-svg/navbar-avatar-svg";

function ProfileButton() {
  const user = useSelector(selectUser);

  return (
    <>
      <div>
        <NavbarAvatar />
      </div>
      <li className="linkNav">
        <div className="link">{user.username}</div>
      </li>
    </>
  );
}

export default ProfileButton;
