import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { selectUser } from "../../features/userSlice";
import logo from "./IconTwitch.svg";
import search from "./Search.svg";
import menuico from "./MenuIco.svg";
import cross from "./Cross.svg";
import AuthButtons from "./navbar-auth-buttons/navbar-auth-button";
import NavbarDropdown from "./navbar-svg-dropdown/navbar-svg-dropdown";
import { useCustomSelector } from "../../test";

function Header() {
  // states / setters - destructuring
  const [menu, showMenu] = useState(false); // used for responsive menu
  const [smallScreen, setSmallScreen] = useState(false); // to test screen size
  const [searchInput, setSearch] = useState("");
  let history = useHistory();

  const user = useCustomSelector(selectUser);

  // test if we > || < 900px
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 900px)");
    mediaQuery.addEventListener("change", handleMediaQueryChange);
    handleMediaQueryChange(mediaQuery);
  });

  const handleMediaQueryChange = (mediaQuery) => {
    mediaQuery.matches ? setSmallScreen(true) : setSmallScreen(false);
  };

  // toggle the state value show/hide menu
  const toggleNavRes = () => {
    showMenu(!menu);
  };

  // hide menu when we click a link in it
  const hideMenu = () => {
    if (menu === true) {
      showMenu(!menu);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleKeyPress = (e) => {
    setSearch(e.target.value);
  };

  function handleButtonClick() {
    history.push("/sign-up");
  }

  return (
    <>
      <nav className="headerTop">
        {/* Conditionnal rendering for menu, default true || false */}
        {(menu || !smallScreen) && (
          <ul className="listMenu">
            <li onClick={hideMenu} className="linkNav">
              <Link className="link" to="/">
                <img src={logo} alt="logo twitch" className="logo" />
              </Link>
            </li>
            <li className="linkNav">
              <Link onClick={hideMenu} className="link" to="/">
                Top games
              </Link>
            </li>
            <li onClick={hideMenu} className="linkNav">
              <Link className="link" to="/top-streams">
                Top streams
              </Link>
            </li>
            <li onClick={hideMenu} className="linkNav">
              <Link className="link" to="/posts">
                Top Blogs
              </Link>
            </li>
            {user ? (
              <NavbarDropdown hideMenu={hideMenu} />
            ) : (
              <AuthButtons
                hideMenu={hideMenu}
                buttonClick={handleButtonClick}
              />
            )}
          </ul>
        )}
        {/* \ Conditionnal rendering for menu */}
      </nav>
      <div className="menuResBtn">
        <img
          onClick={toggleNavRes}
          src={menu ? cross : menuico}
          alt="responsive menu icon"
          className="menuIco"
        />
      </div>
    </>
  );
}

export default Header;
