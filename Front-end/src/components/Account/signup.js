import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { Button, ChakraProvider } from "@chakra-ui/react";
import axios from "../../api/auth-api";

const SIGN_UP_URL = "/signup";
const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const FULLNAME_REGEX = /^^[a-zA-Z]{4,}(?: [a-zA-Z]+)?(?: [a-zA-Z]+)?$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export default function SignUp() {
  const initialValues = {
    username: "",
    fullname: "",
    email: "",
    password: "",
    description: "",
    channel: "",
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validForm, setvalidForm] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const history = useHistory();

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(formValues);
    }
    // eslint-disable-next-line
  }, [formErrors]);

  useEffect(() => {
    setErrMsg("");
  }, [
    formValues.username,
    formValues.fullname,
    formValues.email,
    formValues.password,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validate = (values) => {
    const errors = {};

    //check if entred value are valid using Regex patterns
    const isValidUsername = USER_REGEX.test(formValues.username);
    const isValidpassword = PWD_REGEX.test(formValues.password);
    const isValidFullname = FULLNAME_REGEX.test(formValues.fullname);
    const isValidChannel = USER_REGEX.test(formValues.channel);

    if (!values.username) {
      errors.username = "Username is required!";
    } else if (!isValidUsername) {
      errors.username = "Please choose a valid username!";
    }
    if (!values.fullname) {
      errors.fullname = "Full name is required!";
    } else if (!isValidFullname) {
      errors.fullname = "Please choose a valid full name!";
    }
    if (!values.email) {
      errors.email = "Email is required!";
    }
    if (!values.password) {
      errors.password = "Password is required!";
    } else if (!isValidpassword) {
      errors.password = "Please choose a stronger password!";
    }
    if (!values.channel) {
      errors.channel = "Full name is required!";
    } else if (!isValidChannel) {
      errors.channel = "Please choose a valid channel name!";
    }

    Object.entries(errors).length === 0
      ? setvalidForm(true)
      : setvalidForm(false);

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //check if entred value are valid
    setFormErrors(validate(formValues));
    setIsSubmit(true);
    setIsLoading(true);

    console.log(formValues.channel)
    console.log(formValues.description)

    const channelName = formValues.channel
    const channelDescription = formValues.description

    if (!validForm) {
      setIsLoading(false);
      return;
    }

    const [firstname, lastname] = formValues.fullname.split(" ");
    const username = formValues.username;
    const email = formValues.email;
    const password = formValues.password;
    const confirmPassword = formValues.password;

    try {
      const response = await axios.post(
        SIGN_UP_URL,
        JSON.stringify({
          firstname,
          lastname,
          username,
          email,
          password,
          confirmPassword,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: false,
        }
      );

      setSuccess(true);

      //TODO: to remove after implementation
      console.log(response?.data);
      console.log(success);

      console.log(username);

      await axios.post(
        "http://127.0.0.1:3002/api/channels/",
        {
          "name":channelName,
          "description":channelDescription,
          "username":username
        }
        // ,
        // {
        //   headers: { "Content-Type": "application/json" },
        //   withCredentials: false,
        // }
      );


      history.push("/sign-in");

      //clear state and controlled inputs
      setErrMsg("");
      setFormValues(initialValues);
    } catch (err) {
      setIsLoading(false);
      const msgError = JSON.stringify(
        err?.response["data"]["errors"][0]["msg"]
      );
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg(msgError.replaceAll('"', ""));
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form onSubmit={handleSubmit}>
          <h3>Sign Up</h3>
          <div className="mb-3">
            <label>Username</label>
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="Username"
              value={formValues.username}
              onChange={handleChange}
            />
            <div className="text-danger">{formErrors.username}</div>
          </div>
          <div className="mb-3">
            <label>Full name</label>
            <input
              type="text"
              name="fullname"
              className="form-control"
              placeholder="Full name"
              value={formValues.fullname}
              onChange={handleChange}
            />
            <div className="text-danger">{formErrors.fullname}</div>
          </div>
          <div className="mb-3">
            <label>Email address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter email"
              value={formValues.email}
              onChange={handleChange}
            />
            <div className="text-danger">{formErrors.email}</div>
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter password"
              value={formValues.password}
              onChange={handleChange}
            />
            <div className="text-danger">{formErrors.password}</div>
          </div>
          <div className="mb-3">
            <label>Channel Name</label>
            <input
              type="text"
              name="channel"
              className="form-control"
              placeholder="Choose a channel name"
              value={formValues.channel}
              onChange={handleChange}
            />
            <div className="text-danger">{formErrors.channel}</div>
          </div>
          <div className="mb-3">
            <label>Channel description</label>
            <input
              type="text"
              name="description"
              className="form-control"
              placeholder="Choose a channel description"
              value={formValues.description}
              onChange={handleChange}
            />
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
                Sign Up
              </Button>
            </ChakraProvider>
          </div>
          <p className="forgot-password text-right">
            Already registered <Link to="/sign-in">sign in?</Link>
          </p>
          <div className="text-danger">{errMsg}</div>
        </form>
      </div>
    </div>
  );
}
