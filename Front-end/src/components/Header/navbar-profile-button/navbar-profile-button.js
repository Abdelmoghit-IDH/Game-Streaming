import React from "react";
import { selectUser } from "../../../features/userSlice";
import { useCustomSelector } from "../../../test";
import NavbarAvatar from "../navbar-avatar-svg/navbar-avatar-svg";

function ProfileButton() {
  const user = useCustomSelector(selectUser);

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
