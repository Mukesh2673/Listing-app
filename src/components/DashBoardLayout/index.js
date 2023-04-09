import { Suspense } from "react";
import { useFormik } from 'formik'

import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import React, {  useEffect, useState } from 'react'
import { Button, Dropdown, DropdownButton, Form, Modal } from 'react-bootstrap'
import DropdownItem from 'react-bootstrap/esm/DropdownItem'
import Navbr from "./Navabr";
import Sidebar from "./Sidebar";
import logo from "../../assets/images/logo.svg";
import { toast, ToastContainer } from 'react-toastify'
import { CONFIRM_PASSWORD, MANDATORY, OLD_NEW_PASSWORD, OLD_PASSWORD, SOMETHING_WENT_WRONG, STRONG_PASSWORD, UPDATED } from '../../config/const'
import 'react-toastify/dist/ReactToastify.css'
//import { httpPost } from '../../../utils/http'
import { httpPost } from '../../utils/http'
import { CHANGE_PASSWORD_ENDPOINT } from '../../config/endPoints'
import { errorToaster, successToaster } from '../Toaster'
import closeIcon from '../../../src/assets/images/closeIcon.svg'


function WithRouter(Component) {
function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return <Component {...props} router={{ location, navigate, params }} />;
  }
  return ComponentWithRouterProp;
}

function DashboardLayout(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showChangePassword, setshowChangePassword] = useState(false)
  const changePasswordClose = () => setshowChangePassword(false)
  const changePasswordOpen = () => setshowChangePassword(true)
  const [loading, setLoading] = useState(false);

  const validate = values => {
    const errors = {}
    if(!values.oldPassword){
      errors.oldPassword = MANDATORY
    }
    if (!values.password) {
      errors.password = MANDATORY
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i.test(values.password)){
      errors.password = STRONG_PASSWORD
    }
    if(values.oldPassword !== '' && values.oldPassword ===values.password){
      errors.password = OLD_NEW_PASSWORD
    }
    if (!values.confirmPassword) {
      errors.confirmPassword = MANDATORY
    } else if (values.confirmPassword !== values.password){
      errors.confirmPassword = CONFIRM_PASSWORD
    }
    return errors
  }
  const changePassword = async (data) => {
    setLoading(true); 
    let res = await httpPost(`${CHANGE_PASSWORD_ENDPOINT}`, data)
    if (res.status === 200) {
      setLoading(false); 
      setshowChangePassword(false);
      successToaster(UPDATED)

      setTimeout(() => {
        toast.dismiss();
        Logout()
      }, 1000);
    } else {
      errorToaster(SOMETHING_WENT_WRONG);
      setLoading(false); 
      setshowChangePassword(false);

      setTimeout(() => {
        toast.dismiss();
      }, 1000);
    }
      formik.setFieldValue("oldPassword", "");
      formik.setFieldValue("password", "");
      formik.setFieldValue("confirmPassword", "");
  }

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      password: '',
      confirmPassword: ''
    },
    validate,
    onSubmit: async (values) => {

      const data = {
        oldPassword: values.oldPassword,
        password: values.password
      }
         changePassword(data);
      }
  })
 const Logout = () => {
  localStorage.removeItem("authorization");
  navigate('/')
  }



  if (!localStorage.getItem('authorization')) {
    return (
      <Suspense fallback={null}>
        <Navigate
          to={{ pathname: '/', state: { from: props.location } }}
        />
      </Suspense>
    );
  }

 return (
    <>
    <ToastContainer autoClose={1000}/>
      <div className='wrapper'>
        <div className='top-bar'>
          <div className="logoWrap">
            
            <img src={logo} alt='logo'/>
            <h2>PRO CARD</h2>
          </div>
          <DropdownButton id="dropdown-item-button" title=" ">
            <p>Admin
              <span>admin@gmail.com</span>
            </p>
            <Dropdown.Divider />
            <DropdownItem>Setting</DropdownItem>
            <DropdownItem onClick={changePasswordOpen}>Change Password</DropdownItem>
            <DropdownItem onClick={Logout}>
              Logout
            </DropdownItem>
          </DropdownButton>
        </div>
        <Modal
        show={showChangePassword}
        onHide={changePasswordClose}
        className='category-modal'
      >
        <form onSubmit={formik.handleSubmit}> 
        <div className='crossBtnwrap d-flex justify-content-end'>
          <Button onClick={changePasswordClose}>
            <img src={closeIcon} alt='close'  />
          </Button>
          </div>
         
          <Modal.Body>
            <Form.Group className='form-group' controlId='oldPassword'>
              <Form.Control
                type='password'
                placeholder='Enter your old password'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.oldPassword}
                name="oldPassword"
              />
              {formik.errors.oldPassword ? (
                <div className='text-danger'>{formik.errors.oldPassword}</div>
              ) : null}
              
            </Form.Group>

            <Form.Group className='form-group' controlId='password'>
              <Form.Control
                type='password'
                placeholder='Enter your new password'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                name="password"
              />
              {formik.errors.password ? (
                <div className='text-danger'>{formik.errors.password}</div>
              ) : null}
            </Form.Group>

            <Form.Group className='form-group' controlId='confirmPassword'>
              <Form.Control
                type='password'
                placeholder='Confirm your new password'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
                name="confirmPassword"
              />
              {formik.errors.confirmPassword ? (
                <div className='text-danger'>{formik.errors.confirmPassword}</div>
              ) : null}
            </Form.Group>
            
          </Modal.Body>
          <Modal.Footer>
            <Button
              type='submit'
              className='save'
              variant='primary'
              // onClick={changePasswordClose}
              // disabled={allowClose ? false : true}
            >
              Update Password         
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
        <div className='full-content'>
          <Sidebar />
          <Navbr />
          <ToastContainer autoClose={1000} />
          {props.element}
        </div>
      </div>
    </>
  );
}
export default WithRouter(DashboardLayout);
