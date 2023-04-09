import { useFormik } from 'formik'
import React, {  useEffect, useState } from 'react'
import { Button, Dropdown, DropdownButton, Form, Modal } from 'react-bootstrap'
import DropdownItem from 'react-bootstrap/esm/DropdownItem'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"; 
import { CHANGE_PASSWORD_ENDPOINT } from '../../../config/endPoints'
import { httpPost } from '../../../utils/http'
import { errorToaster, successToaster } from '../../Toaster'
import closeIcon from '../../../assets/images/closeIcon.svg'
import arrowToggle from '../../../assets/images/arrowToggle.svg'
import './style.scss'
import { CONFIRM_PASSWORD, MANDATORY, OLD_NEW_PASSWORD, OLD_PASSWORD, SOMETHING_WENT_WRONG, STRONG_PASSWORD, UPDATED } from '../../../config/const'
import Loader from '../../Loader'

const Navbr = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showChangePassword, setshowChangePassword] = useState(false)
  const changePasswordClose = () => setshowChangePassword(false)
  const changePasswordOpen = () => setshowChangePassword(true)
  const [dashboardRoute,setDashboardRoute]=useState('')
  const [dynamicClass,setdynamicClass]=useState(false)
  const [loading, setLoading] = useState(false);

 /*  useEffect(() => {
    var displayRoute=location.pathname.split('/')
    setDashboardRoute(displayRoute[1]);
  }, [location]) */

/*   const validate = values => {
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
 */


 /*  const changePassword = async (data) => {
    setLoading(true); 
    let res = await httpPost(`${CHANGE_PASSWORD_ENDPOINT}`, data)
    if (res.status === 200) {
      setLoading(false); 
      setshowChangePassword(false);
      successToaster(UPDATED)

      setTimeout(() => {
        toast.dismiss();
        logout()
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
  } */

/*   const formik = useFormik({
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
 */



  const logout = () => {
    localStorage.removeItem("authorization");
    navigate('/')
  }

  if (!localStorage.getItem("authorization")) {
    navigate('/')
  }
  const toggleMenu = () => {
    var bodyClass=!dynamicClass
    bodyClass ? document.body.classList.add('menuToggle') :document.body.classList.remove('menuToggle');
    setdynamicClass(bodyClass)

  }
  return (
    <>
    <div className='header'>
    <ToastContainer autoClose={1000} />
      {loading && <Loader />}
        <div className='profile-wrap d-flex justify-content-end'>
          <Button className='menuButton' onClick={() =>{ toggleMenu()}}>
            <img src={arrowToggle} alt="menu"/>
          </Button>
          {/* <DropdownButton id="dropdown-item-button" title=" ">
            <p>Admin
              <span>admin@gmail.com</span>
            </p>
            <Dropdown.Divider />
            <DropdownItem>Setting</DropdownItem>
            <DropdownItem onClick={changePasswordOpen}>Change Password</DropdownItem>
            <DropdownItem onClick={logout}>
              Logout
            </DropdownItem>
          </DropdownButton> */}
        </div>
     {/*    <h1>{location.pathname.replace(/[^a-zA-Z ]/g, "").split('/')[0]}</h1> */}
     {/* <h1>{dashboardRoute}</h1> */}
      </div>

     {/*  <Modal
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
              Update Passworda      
            </Button>
          </Modal.Footer>
        </form>
      </Modal> */}
      </>
)

}

export default Navbr
