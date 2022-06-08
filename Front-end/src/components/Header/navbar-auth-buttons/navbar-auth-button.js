import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

function AuthButtons(props) {
  return (
    <>
      <li onClick={props.hideMenu} className="linkNav">
        <Link className="link" to="/sign-in">
          Log In
        </Link>
      </li>
      <li onClick={props.hideMenu} className="linkNav">
        <Button onClick={props.buttonClick} className="btn-icon btn-3" size="sm" color="primary">
          Sign Up
        </Button>
      </li>
    </>
  );
}

export default AuthButtons;
