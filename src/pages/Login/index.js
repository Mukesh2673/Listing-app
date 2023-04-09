import { Button, Form } from "react-bootstrap";
import "./style.scss";
import logo from "../../assets/images/logoLogin.svg";
import { useFormik } from "formik";
import { httpPost } from "../../utils/http";
import { AUTH_ENDPOINT } from "../../config/endPoints";
import { useNavigate } from "react-router-dom";
import { errorToaster, successToaster } from "../../components/Toaster";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState } from "react";
import { Invalid_CREDENTIALS, LOGIN, MANDATORY } from "../../config/const";
import Loader from "../../components/Loader";

const validate = (values) => {
  const errors = {};
  if (!values.userName) {
    errors.userName = MANDATORY;
  }
   if (!values.password) {
    errors.password = MANDATORY;
  }
  
  return errors;
};

const Login = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      userName: "",
      password: "",
    },
    validate,
    onSubmit: async (values) => {
      const data = {
        email: values.userName,
        password: values.password,
      };

      setLoading(true);
      let res = await httpPost(`${AUTH_ENDPOINT}/login`, data);
      if (res.status === 200) {
        setLoading(false);
        localStorage.setItem("authorization", res.data.data.token);
        successToaster(LOGIN);
        setTimeout(() => {
          toast.dismiss();
        }, 2000);
        setTimeout(() => {
          navigate("/profile");
        }, 1000);
        setLoginError(false);
      } else {
        setLoading(false);
        errorToaster(Invalid_CREDENTIALS);
        setTimeout(() => {
          toast.dismiss();
        }, 1000);
        formik.resetForm();
        setLoginError(true);
        setTimeout(() => {
          setLoginError(false);
        }, 2000);
      }
    },
  });

  return (
    <>
      <ToastContainer autoClose={1000} />
      {loading && <Loader />}
      <div className="login-wrapper">
        <div className="login-main">
          <div className="logo-wrap text-center">
            <img src={logo} alt="Logo " />
          </div>
          <h1 className="text-center">PRO CARD</h1>

          <Form className="form-wrap" onSubmit={formik.handleSubmit}>
            <Form.Group className="form-group" controlId="userName">
              <Form.Control
                type="text"
                placeholder="Username"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.userName}
              />
              {formik.errors.userName && formik.touched.userName ? (
                <div className="text-danger">{formik.errors.userName}</div>
              ) : null}
            </Form.Group>
            <Form.Group className="form-group" controlId="password">
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />

              {formik.errors.password && formik.touched.password ? (
                <div className="text-danger">{formik.errors.password}</div>
              ) : null}
              {loginError ? (
                <div className="text-danger">Invalid Credentials</div>
              ) : null}
            </Form.Group>
            <Form.Group className="form-group text-center">
              <Button type="submit">Login</Button>
            </Form.Group>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;
