import { useState, useEffect } from "react";
import { Form, FormControl, Button, Table, Modal } from "react-bootstrap";
import "./style.scss";
import "../../assets/scss/main.scss";
import searchIcon from "../../assets/images/searchIcon.svg";
import exportIcon from "../../assets/images/exportIcon.svg";
import { httpDelete, httpGet, httpPost, httpPut } from "../../utils/http";
import { BASE_URL,IMAGE_URL } from "../../config/endPoints";
import deleteIcon from "../../assets/images/deleteIcon.svg";

import { useFormik } from "formik";
import { toast, ToastContainer } from "react-toastify";
import { errorToaster, successToaster } from "../../components/Toaster";
import closeIcon from "../../assets/images/closeIcon.svg";
import Select from "react-select";
import editIcon from "../../assets/images/editIcon.svg";
import Loader from "../../components/Loader";
import {
  DELETE_CONFIRMATION,
  SOMETHING_WENT_WRONG,
  STATUS_CHANGED,
} from "../../config/const";

function Reviews() {
  const [review, setReview] = useState([]);
  const [categoryId, setcategoryId] = useState([]);
  const [showCategory, setShowCategory] = useState(false);
  const [category, setCategory] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [updateId, setUpdateId] = useState();
  const categoryClose = () => setShowCategory(false);
  const [loading, setLoading] = useState(false);

  const categoryOpen = (type) => {
    if (type == "new") {
      formik.resetForm();
      setUpdateId();
      setShowCategory(true);
    } else {
      setShowCategory(true);
    }
  };
  useEffect(() => {
    getReview();
  }, []);

  const getReview = () => {
    httpGet(`${BASE_URL}/review?skip=0&limit=50`).then((res) => {
      if (res?.data?.data?.length > 0) {
        let data = res?.data?.data;
        setReview(data);
      }
    });
  };


  const changeStatus = async (data, e) => {
    setLoading(true);
    let res = await httpPut(`${BASE_URL}/review/status/${data._id}`);
    if (res.status === 200) {
      setLoading(false);
      successToaster(STATUS_CHANGED);
      getReview();
    }
    else{
      errorToaster(SOMETHING_WENT_WRONG);
      setTimeout(() => {
        toast.dismiss();
      }, 1000);
    }
  };


 


  const formik = useFormik({
    initialValues: {
      category: [],
      serviceName: "",
      price: "",
    },
    // validate,
    onSubmit: async (values) => {
      const data = {
        categoryId: [],
        serviceName: values.serviceName,
        price: values.price,
      };

      for (let i = 0; i < categoryId.length; i++) {
        data.categoryId.push(categoryId[i].id);
      }
      if (updateId) {
        setLoading(true);

        let res = await httpPut(`${BASE_URL}/priceCatalog/${updateId}`, data);
        if (res.status === 200) {
          setLoading(false);

          successToaster("sucessfully added to api");
          setTimeout(() => {
            toast.dismiss();
            getReview();
            setcategoryId([]);
          }, 1000);
        } else {
          errorToaster(res, "see the error");
          setTimeout(() => {
            toast.dismiss();
          }, 1000);
        }
      } else {
        setLoading(true);

        let res = await httpPost(`${BASE_URL}/priceCatalog`, data);
        if (res.status === 200) {
          setLoading(false);

          successToaster("sucessfully added to api");
          setTimeout(() => {
            toast.dismiss();
            getReview();
            setcategoryId([]);
          }, 1000);
        } else {
          errorToaster(res, "see the error");
          setTimeout(() => {
            toast.dismiss();
          }, 1000);
        }
      }
    },
  });

  const handleCategoryChange = (newSelection) => {
    setcategoryId(newSelection);
  };
  /* 
  const editPriceCatalog = async (id, data) => {
    setUpdateId(id);
    categoryOpen();
    formik.setFieldValue("serviceName", data?.serviceName);
    formik.setFieldValue("price", data?.price);
  } */

  const deleteReview = async (delId) => {
 
    setLoading(true);

    let res = await httpDelete(`${BASE_URL}/review/${deleteId}`);
    if (res.status === 200) {
      setLoading(false);

      successToaster("sucessfully added to api");
      setTimeout(() => {
        toast.dismiss();
        getReview();
      }, 1000);
    } else {
      errorToaster(res, "see the error");
      setTimeout(() => {
        toast.dismiss();
      }, 1000);
    }
    closeDeleteModal();
  };

  const closeDeleteModal = () => setShowDeleteModal(false);
  const deleteModalOpen = (id) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  };
  const convertToData = (data) => {
    let newdate = new Date(data);
    var year = newdate.getFullYear();
    var month = newdate.getMonth();
    var date = newdate.getDate();
    month=month+1
    var fulldate = date + '/' + month + '/' + year
    return fulldate;
  }

  return (
    <>

      {loading && <Loader />}
      <div className="main-content reviewPage">
        {loading && <Loader />}
        <div className="main-content-inner">
          <div className="listing-headder">
            <div className="tabing-content-inner">
              <div className="search-point justify-content-between">
                <Form inline="true" className="search-box d-flex">
                  <FormControl
                    type="text"
                    placeholder="Search"
                    className="mr-2"
                  />
                  <Button variant="outline-success">
                    <img src={searchIcon} alt="" />
                  </Button>
                  <Button className="export-btn">
                    <img src={exportIcon} alt="" />
                  </Button>
                </Form>
                {/* <Button className='new-btn' onClick={() => categoryOpen('new')}>New</Button> */}
              </div>
              <div className="listing-content-table">
                <Table responsive className="profile-list">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Date</th>
                      <th>Profile Id</th>
                      <th>Profile</th>
                      <th>Medal</th>
                      <th>Name</th>
                      <th>Phone</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {review.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td>{key + 1}</td>
                          <td>{convertToData(item.createdAt)}</td>
                          <td>{item?.profile[0]?.vat?item?.profile[0]?.vat:'Null'}</td>
                          <td>{item?.profile[0]?.subscription?item?.profile[0]?.subscription:'Null'}</td>
                          <td>{item?.medal}</td>
                          <td>{item?.reviewername?item.reviewername:'Null'}</td>
                          <td>{item?.phone}</td>
                          <td><div className="invoiceImage"><img src={IMAGE_URL+`reviews/${item.invoiceFile}`}></img></div></td>
                          <td>   

                            <div className="d-flex">
                              <div className="statusWrap">
                                <label className="switch">
                                  <input type="checkbox" 
                                  onChange={(e) => changeStatus(item, e)}
                                  checked={item.status}
                              />
                                  <span className="slider round"></span>
                                </label>
                              </div>
                              <div className="d-flex btnsGroup reviewBtns">
                                <Button type="button">
                                  <img src={editIcon} alt="" />
                                </Button>{" "}
                                <Button type="button" 
                                onClick={(e) => deleteModalOpen(item?._id)}
                                >
                                  <img src={deleteIcon} alt="" />
                                </Button>
                              </div>
                            </div>

                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
        <Modal
          show={showCategory}
          onHide={categoryClose}
          className="category-modal"
        >
          <Form onSubmit={formik.handleSubmit}>
            <Modal.Header>
              <Modal.Title>{""}</Modal.Title>
              <Button variant="primary" size="sm">
                <img src={closeIcon} alt="close" onClick={categoryClose} />
              </Button>
            </Modal.Header>

            <Modal.Body>
              <Form.Group className="form-group">
                <Select
                  value={categoryId}
                  onChange={handleCategoryChange}
                  isMulti
                  name="category"
                  options={category}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </Form.Group>
              <Form.Group className="form-group">
                <Form.Control
                  type="text"
                  placeholder="Service Name"
                  name="serviceName"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.serviceName}
                />
              </Form.Group>
              {formik.errors.serviceName ? (
                <div className="text-danger">{formik.errors.serviceName}</div>
              ) : null}
              <Form.Group className="form-group">
                <Form.Control
                  type="text"
                  placeholder="Price"
                  name="price"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.price}
                />
              </Form.Group>

              {formik.errors.price ? (
                <div className="text-danger">{formik.errors.price}</div>
              ) : null}
              <Form.Group className="form-group">
                <Button
                  type="submit"
                  className="save"
                  variant="primary"
                  onClick={categoryClose}
                >
                  {" "}
                  {updateId ? "Update" : "Save"}{" "}
                </Button>
              </Form.Group>
            </Modal.Body>
          </Form>
        </Modal>
        <Modal
        show={showDeleteModal}
        onHide={closeDeleteModal}
        className="category-modal"
      >
        <Form>
          <div className="crossBtnwrap d-flex justify-content-end">
            <Button>
              <img src={closeIcon} alt="close" onClick={closeDeleteModal} />
            </Button>
          </div>
          <Modal.Body>
            <Form.Group className="form-group">
              <div className="text-center content-center">
                <h3>{DELETE_CONFIRMATION}</h3>
                <p>
                  <Button
                    type="button"
                    className="save"
                    variant="info"
                    onClick={closeDeleteModal}
                  >
                    {" "}
                    No{" "}
                  </Button>{" "}
                  <Button
                    type="button"
                    className="save"
                    variant="danger"
                    onClick={deleteReview}
                  >
                    {" "}
                    Yes{" "}
                  </Button>
                </p>
              </div>
            </Form.Group>
          </Modal.Body>
        </Form>
      </Modal>
      </div>
    </>
  );
}

export default Reviews;
