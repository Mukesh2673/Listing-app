import { useState, useEffect, useRef } from "react";
import { Form, FormControl, Button, Table, Modal } from "react-bootstrap";
import "./style.scss";
import "../../assets/scss/main.scss";
import searchIcon from "../../assets/images/searchIcon.svg";
import deleteIcon from "../../assets/images/deleteIcon.svg";
import exportIcon from "../../assets/images/exportIcon.svg";
import editIcon from "../../assets/images/editIcon.svg";
import { httpDelete, httpGet, httpPost, httpPut } from "../../utils/http";
import { BASE_URL } from "../../config/endPoints";
import { useFormik } from "formik";
import closeIcon from "../../assets/images/closeIcon.svg";
import Select from "react-select";
import { CSVLink } from "react-csv";
import { errorToaster, successToaster } from "../../components/Toaster";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDebounce } from "use-debounce";
import {
  ADDED,
  DELETED,
  DELETE_CONFIRMATION,
  MANDATORY,
  MIN_PRICE,
  SOMETHING_WENT_WRONG,
  STATUS_CHANGED,
  UPDATED,
} from "../../config/const";
import Loader from "../../components/Loader";
import CustomPagination from "../../components/Pagination";

function Pricecatalog() {
  const [priceCatalogData, setPriceCatalogData] = useState([]);
  const [categoryId, setcategoryId] = useState([]);
  const [showCategory, setShowCategory] = useState(false);
  const [category, setCategory] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [updateId, setUpdateId] = useState();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchField, setSearchField] = useState("");
  const [exportData, setExportData] = useState([]);
  const [limit, setLimit] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [offSet, setOffSet] = useState(0);
  const [pages, setPages] = useState(0);
  const [searchValue] = useDebounce(searchField, 1000);
  const [loading, setLoading] = useState(false);
  const csvLink = useRef(null);

  const categoryOpen = (type) => {
    if (type == "new") {
      formik.resetForm();
      setUpdateId();
      setShowCategory(true);
    } else {
      setShowCategory(true);
    }
  };

  // Set Pagination values to send to modal
  const PaginationHandleClick = (offset, page) => {
    setOffSet(offset);
    setCurrentPage(page);
    getPriceCatalog(offset);
  };

  // to get price calog and category on page loading
  useEffect(() => {
    getPriceCatalog();
    getCategory("");
  }, []);

  useEffect(() => {
    if (searchValue.length === 0) {
      getPriceCatalog();
    } else {
      getSearchData();
    }
  }, [searchValue]);

  //get price catalog
  const getPriceCatalog = async (offSet = 0) => {
    setLoading(true);
    await httpGet(
      `${BASE_URL}/priceCatalog?offSet=${offSet}&limit=${limit}`
    ).then((res) => {
      if (res?.data?.data?.length > 0) {
        setLoading(false);
        let data = res?.data?.data;
        let arr = [];
        data.map((item, index) => {
          arr[index] = {
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            price: item.price ? item.price : "NULL",
            serviceName: item.serviceName ? item.serviceName : "NULL",
            category: item.category[0].value ? item.category[0].value : "NULL",
          };
        });
        setExportData(arr);
        setPriceCatalogData(data);
        setPages(res?.data?.pages);
      }
    });
  };

  // to close category modal
  const categoryClose = () => {
    setShowCategory(false);
    setSelectedCategory("");
    formik.resetForm();
  };

  // set search field value in state
  const handleSearch = (e) => {
    setSearchField(e.target.value);
  };

  // get categories
  const getCategory = (categoryArr) => {
    let arr = [];
    if (categoryArr.length > 0) {
      for (let j = 0; j < categoryArr.length; j++) {
        for (let i = 0; i < category.length; i++) {
          if (category[i].value == categoryArr[j].toLowerCase()) {
            arr.push({
              value: category[i].value
                ? category[i].value.toLowerCase()
                : "ocean",
              label: category[i].value
                ? category[i].value.toUpperCase()
                : "Ocean",
              id: category[i]._id ? category[i]._id : "1",
            });
          }
        }
      }
      setcategoryId(arr);
    } else {
      httpGet(`${BASE_URL}/category`).then((res) => {
        if (res?.data?.data?.length > 0) {
          let data = res?.data?.data;
          for (let i = 0; i < data.length; i++) {
            arr.push({
              value: data[i].name ? data[i].name.toLowerCase() : "ocean",
              label: data[i].name ? data[i].name.toUpperCase() : "Ocean",
              id: data[i]._id ? data[i]._id : "1",
            });
          }
          setCategory(arr);
        }
      });
    }
  };

  //change status
  const changeStatus = async (data, e) => {
    setLoading(true);
    let res = await httpPut(`${BASE_URL}/priceCatalog/status/${data._id}`);
    if (res.status === 200) {
      setLoading(false);

      getPriceCatalog();
      successToaster(STATUS_CHANGED);
      setTimeout(() => {
        toast.dismiss();
      }, 1000);
    } else {
      errorToaster(SOMETHING_WENT_WRONG);
      setTimeout(() => {
        toast.dismiss();
      }, 1000);
    }
  };

  const validate = (values) => {
    const errors = {};
    if (!values.serviceName) {
      errors.serviceName = MANDATORY;
    }
    if (!values.price){
        if(values.price === 0){
          return;
        }
        else{
          errors.price = MANDATORY
        }
     
    } else if(values.price < 0){
      errors.price = MIN_PRICE

    }
    if (values.category.length < 1) {
      errors.category = MANDATORY
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      category: [],
      serviceName: "",
      price: "",
    },
    validate,
    onSubmit: async (values) => {
      const data = {
        category: [values.category],
        serviceName: values.serviceName,
        price: values.price,
      };
      if (updateId) {
        setLoading(true);
        let res = await httpPut(`${BASE_URL}/priceCatalog/${updateId}`, data);
        if (res.status === 200) {
          setLoading(false);
          categoryClose();
          successToaster(UPDATED);
          setTimeout(() => {
            toast.dismiss();
            getPriceCatalog();
            setcategoryId([]);
          }, 1000);
        } else {
          errorToaster(SOMETHING_WENT_WRONG);
          categoryClose();
          setTimeout(() => {
            toast.dismiss();
          }, 1000);
        }
      } else {
        setLoading(true);
        let res = await httpPost(`${BASE_URL}/priceCatalog`, data);
        if (res.status === 200) {
          setLoading(false);
          categoryClose();
          successToaster(ADDED);
          setTimeout(() => {
            toast.dismiss();
            getPriceCatalog();
            setcategoryId([]);
          }, 1000);
        } else {
          errorToaster(SOMETHING_WENT_WRONG);
          categoryClose();
          setTimeout(() => {
            toast.dismiss();
          }, 1000);
        }
      }
    },
  });

  //save select option value
  const handleCategoryChange = (newSelection) => {
    formik.setFieldValue("category", newSelection);
    setcategoryId(newSelection);
  };

  const editPriceCatalog = async (id, data) => {
    formik.setFieldValue("serviceName", data.serviceName);
    formik.setFieldValue("price", data.price);
    formik.setFieldValue("category", data.category);
    let category = data.category[0].value?.toUpperCase();
    setSelectedCategory(category);
    setUpdateId(id);
    categoryOpen();
  };

  // delete price catalog
  const deletePriceCatalog = async () => {
    setLoading(true);
    let res = await httpDelete(`${BASE_URL}/priceCatalog/${deleteId}`);
    if (res.status === 200) {
      setLoading(false);

      successToaster(DELETED);
      setTimeout(() => {
        toast.dismiss();
        getPriceCatalog();
      }, 1000);
    } else {
      errorToaster(SOMETHING_WENT_WRONG);
      setTimeout(() => {
        toast.dismiss();
      }, 1000);
    }
    closeDeleteModal();
  };

  // close delete modal
  const closeDeleteModal = () => setShowDeleteModal(false);

  // open delete modal
  const deleteModalOpen = (id) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  };

  // get searched data
  const getSearchData = async () => {
    setLoading(true);
    let res = await httpGet(
      `${BASE_URL}/priceCatalog/search?text=${searchValue}&offSet=${offSet}&limit=${limit}`
    );
    if (res.status === 200) {
      setLoading(false);
      let response = res?.data?.data;
      response.length && setPriceCatalogData(response);
    } else {
      errorToaster(SOMETHING_WENT_WRONG);
      setTimeout(() => {
        toast.dismiss();
      }, 1000);
    }
  };

  // get price catalog data
  const getPriceCatalogAllData = async () => {
    setLoading(true);
    await httpGet(
      `${BASE_URL}/priceCatalog?offSet=${0}&limit=${limit * pages}`
    ).then((res) => {
      if (res?.data?.data) {
        let obj = res?.data?.data;
        let arr = [];
        obj.map((response, index) => {
          arr[index] = {
            category:
              response?.category.length > 0
                ? response?.category[0].value
                : "Null",
            serviceName: response?.serviceName ? response?.serviceName : "Null",
            status: response?.status ? response?.status : "false",
            createdAt: response?.createdAt ? response?.createdAt : "Null",
            updatedAt: response?.updatedAt ? response?.updatedAt : "Null",
          };
        });
        setExportData(arr);
        setTimeout(() => {
          csvLink.current.link.click();
          setLoading(false);
        }, 2000);
      }
    });
  };

  return (
    <>

      {loading && <Loader />}
      <div className="main-content">
        <div className="main-content-inner">
          <div className="listing-headder">
            <div className="tabing-content-inner">
              <div className="search-point justify-content-between">
                <Form inline="true" className="search-box d-flex">
                  <FormControl
                    type="text"
                    placeholder="Search"
                    className="mr-2"
                    onChange={handleSearch}
                    value={searchField}
                  />
                  <Button variant="outline-success">
                    <img src={searchIcon} alt="" />
                  </Button>
                  <Button
                    onClick={getPriceCatalogAllData}
                    className="export-btn btn btn-primary"
                  >
                    <img src={exportIcon} alt="" />
                  </Button>
                  <CSVLink
                    className="hidden"
                    data={exportData}
                    ref={csvLink}
                    target="_blank"
                  ></CSVLink>
                </Form>
                <Button className="new-btn" onClick={() => categoryOpen("new")}>
                  New
                </Button>
              </div>
              <div className="listing-content-table">
                <Table responsive className="porfile-list">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Category</th>
                      <th>Service</th>
                      <th>Price</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {priceCatalogData.map((data, i) => {
                      return (
                        <tr key={i}>
                          <td onClick={() =>editPriceCatalog(data._id, data)}>{i + 1}</td>
                          <td onClick={() =>editPriceCatalog(data._id, data)}>
                            {data.category[0].value
                              ? data.category[0].value?.toUpperCase()
                              : "Null"}
                          </td>
                          <td onClick={() =>editPriceCatalog(data._id, data)}>{data.serviceName}</td>
                          <td onClick={() =>editPriceCatalog(data._id, data)}>{data.price}</td>
                          <td>
                            <div className="d-flex">
                              <div className="statusWrap">
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    onChange={(e) => changeStatus(data)}
                                    checked={data.status}
                                  />
                                  <span className="slider round"></span>
                                </label>
                              </div>

                              <div className="d-flex btnsGroup">
                                
                                <Button
                                  type="button"
                                  onClick={() => deleteModalOpen(data._id)}
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
              {/* pagination HTML Start */}
              <CustomPagination
                limit={limit}
                pages={pages}
                currentPage={currentPage}
                PaginationHandleClick={PaginationHandleClick}
              />
              {/* pagination HTML End */}
            </div>
          </div>
        </div>

        {/*category Modal Open */}
        <Modal
          show={showCategory}
          onHide={categoryClose}
          className="category-modal"
        >
          <Form onSubmit={formik.handleSubmit}>
            <Modal.Header>
              <Modal.Title>{""}</Modal.Title>
              <div className="crossBtnwrap d-flex justify-content-end">
                <Button className="crossBtn" variant="primary">
                  <img src={closeIcon} alt="close" onClick={categoryClose} />
                </Button>
              </div>
            </Modal.Header>

            <Modal.Body>
              <Form.Group className="form-group">
                <Select
                  onChange={handleCategoryChange}
                  name="category"
                  options={category}
                  className="basic-single"
                  classNamePrefix="select"
                  defaultInputValue={selectedCategory}
                />
                {formik.errors.category && formik.touched.category ? (
                  <div className="text-danger">{formik.errors.category}</div>
                ) : null}
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
                {formik.errors.serviceName && formik.touched.serviceName ? (
                  <div className="text-danger">{formik.errors.serviceName}</div>
                ) : null}
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Control
                  type="number"
                  placeholder="Price"
                  name="price"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.price}
                  min="0"
                />
                {formik.errors.price && formik.touched.price ? (
                  <div className="text-danger">{formik.errors.price}</div>
                ) : null}
              </Form.Group>


              <Form.Group className="form-group">
                <Button
                  type="submit"
                  className="save"
                  variant="primary"
                //onClick={categoryClose}
                >

                  {updateId ? "Update" : "Save"}
                </Button>
              </Form.Group>
            </Modal.Body>
          </Form>
        </Modal>
        {/*category Modal close */}

        {/*Delete Modal Open */}
        <Modal
          show={showDeleteModal}
          onHide={closeDeleteModal}
          className="category-modal"
        >
          <Form onSubmit={formik.handleSubmit}>
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
                      onClick={deletePriceCatalog}
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
        {/*Delete Modal close */}

      </div>
    </>
  );
}
export default Pricecatalog;
