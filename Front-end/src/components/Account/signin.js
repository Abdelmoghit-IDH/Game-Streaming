import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "../../api/auth-api";
import { signin } from "../../features/userSlice";
import { Button, ChakraProvider } from "@chakra-ui/react";
import { useCustomDispatch } from "../../test";

const SIGN_IN_URL = "/signin";

export default function Login() {
  const initialValues = { username: "", password: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [validForm, setvalidForm] = useState(false);

  const history = useHistory();
  const dispatch = useCustomDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormErrors(validate(formValues));
    setIsSubmit(true);
    setIsLoading(true);

    if (!validForm) {
      setIsLoading(false);
      return;
    }

    const login = formValues.username;
    const password = formValues.password;

    try {
      const response = await axios.post(
        SIGN_IN_URL,
        JSON.stringify({ login, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: false,
        }
      );

      const resData = response?.data["data"];
      const user = resData?.user;
      // Get the value of token without Bearer word
      let token = resData?.authorization["token"];
      token = token.replace("Bearer", "").replaceAll(" ", "");

      try {
        dispatch(
          signin({
            id:user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            signupDate: user.signupDate,
            isAdmin: user.isAdmin,
            token: token,
            isLoggedIn: true,
          })
        );
      } catch (error) {
        console.log(error);
      }

      setIsLoading(false);
      setErrMsg("");
      setFormValues(initialValues);

      history.push("/");
    } catch (err) {
      setIsLoading(false);

      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Incorrect username or password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
    }
  };

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(formValues);
    }
    // eslint-disable-next-line
  }, [formErrors]);

  useEffect(() => {
    setErrMsg("");
  }, [formValues.username, formValues.password]);

  const validate = (values) => {
    const errors = {};
    if (!values.username) {
      errors.username = "Username is required!";
    }
    if (!values.password) {
      errors.password = "Password is required!";
    } else if (values.password.length < 4) {
      errors.password = "Password must be more than 4 characters";
    }

    Object.entries(errors).length === 0
      ? setvalidForm(true)
      : setvalidForm(false);

    return errors;
  };

  return (
    <>
      <div className="auth-wrapper">
        <div className="auth-inner">
          <form onSubmit={handleSubmit}>
            <h3>Sign In</h3>
            <div className="mb-3">
              <label>Username</label>
              <input
                type="text"
                name="username"
                className="form-control"
                placeholder="Enter username"
                defaultValue={formValues.username}
                onChange={handleChange}
              />
              <div className="text-danger">{formErrors.username}</div>
            </div>
            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter password"
                defaultValue={formValues.password}
                onChange={handleChange}
              />
              <div className="text-danger">{formErrors.password}</div>
            </div>
            <div className="mb-3">
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="customCheck1"
                />
                <label className="custom-control-label" htmlFor="customCheck1">
                  Remember me
                </label>
              </div>
            </div>
            <div className="d-grid">
              <ChakraProvider>
                <Button
                  isLoading={isLoading}
                  loadingText="Loading"
                  colorScheme="blue"
                  spinnerPlacement="start"
                  type="submit"
                >
                  Submit
                </Button>
              </ChakraProvider>
            </div>
            <div className="text-danger">{errMsg}</div>
          </form>
        </div>
      </div>
    </>
  );
}
