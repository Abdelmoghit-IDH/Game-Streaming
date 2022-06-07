import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";

export const ProtectedRoute = ({ component: Component, ...rest }) => {
  let user = useSelector(selectUser);

  //if the user isn't connected inially user=false
  if (user === null) {
    user = false;
  }

  return (
    <Route
      {...rest}
      render={(props) => {
        if (user.isLoggedIn) {
          return <Component />;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/sign-in",
                state: { from: props.location },
              }}
            />
          );
        }
      }}
    />
  );
};
