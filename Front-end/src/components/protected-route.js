import React from "react";
import { Route, Redirect } from "react-router-dom";
import { selectUser } from "../features/userSlice";
import { useCustomSelector } from "../test";

export const ProtectedRoute = ({ component: Component, ...rest }) => {
  let user = useCustomSelector(selectUser);

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
