import {
  Form,
  FormControl,
  Button,
  Table,
  Modal,
} from "react-bootstrap";
import "./style.scss";
import "../../assets/scss/main.scss";
import searchIcon from "../../assets/images/searchIcon.svg";
import exportIcon from "../../assets/images/exportIcon.svg";
import { AUTH_ENDPOINT } from "../../config/endPoints";
import { useState, useEffect, useRef } from "react";
import closeIcon from "../../assets/images/closeIcon.svg";
import editIcon from "../../assets/images/editIcon.svg";
import deleteIcon from "../../assets/images/deleteIcon.svg";
import { BASE_URL } from "../../config/endPoints";
import { httpDelete, httpGet, httpPost, httpPut } from "../../utils/http";
import { errorToaster, successToaster } from "../../components/Toaster";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CSVLink } from "react-csv";
import CustomPagination from "../../components/Pagination";
import { useDebounce } from "use-debounce";
import {
  ADDED,
  DELETED,
  DELETE_CONFIRMATION,
  MANDATORY,
  SOMETHING_WENT_WRONG,
  STATUS_CHANGED,
  UPDATED,
} from "../../config/const";
import Loader from "../../components/Loader";
import { useFormik } from "formik";


function Locations() {
  const [showLocation, setShowLocation] = useState(false);
  const [showUpdateLocation, setUpdateLocation] = useState(false);
  const [locationData, setLocationData] = useState([]);
  const [locationDetails, setLocationDetails] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const locationsClose = () => {
    setShowLocation(false);
  };
  const [searchString, setSearchString] = useState("");
  const [cityName, setCityName] = useState("");
  const [limit, setLimit] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [offSet, setOffSet] = useState(0);
  const [pages, setPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [exportData, setExportData] = useState([]);
  const [searchValue] = useDebounce(searchString, 1000);
  const [paginations, setPaginations] = useState(false);
  const [updateId, setUpdateId] = useState();
  const csvLink = useRef(null);


  // get data on loading the page first time
  useEffect(() => {
    setLoading(true);
    getData();
  }, []);

  //search Location Data
  useEffect(() => {
    if (searchValue.length === 0) {
      getData();
    } else {
      getSearchData();
    }
  }, [searchValue]);

  const locationsOpen = (type) => {
    if (type == "new") {
      formik.resetForm();
      setUpdateId();
      setShowLocation(true);
    }
    else {
      setShowLocation(true);

    }

  };

  // to close delete modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setCityName("");
  };

  //Get Data
  async function getData(offSet = 0) {
    setLoading(true);
    await httpGet(
      `${BASE_URL}/auth/location?offSet=${offSet}&limit=${limit}`
    ).then((res) => {
      if (res?.data) {
        setLoading(false);
        setPages(res?.data?.pages);
        setLocationData(res?.data?.records);
        res?.data?.records.length > 10 && setPaginations(true);
      }
    });
  }
  const getLocationAllData = async () => {
    setLoading(true);
    await httpGet(
      `${BASE_URL}/auth/location?offSet=${0}&limit=${limit * pages}`
    ).then((res) => {
      if (res?.data?.records) {
        let obj = res?.data?.records;
        let arr = [];
        obj.map((response, index) => {
          arr[index] = {
            city: response?.city ? response?.city : "Null",
            cityEnglish: response?.cityEnglish ? response?.cityEnglish : "Null",
            cityHebrew: response?.cityHebrew ? response?.cityHebrew : "Null",
            createdAt: response?.createdAt ? response?.createdAt : "Null",
            updatedAt: response?.updatedAt ? response?.updatedAt : "Null",
            id: response?._id ? response?._id : "Null",
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
  const editButton = (data) => {
    formik.setFieldValue("cityName", data.cityHebrew);
    setUpdateId(data._id)
    setLocationDetails(data);
    setCityName(data.cityHebrew);
    locationsOpen();

  };
  const deleteModalOpen = (id) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  };

  //Delete Location
  const del = async (data) => {
    setLoading(true);
    let res = await httpDelete(`${AUTH_ENDPOINT}/location/${deleteId}`);
    if (res.status === 200) {
      setLoading(false);
      getData();
      successToaster(DELETED);
      setTimeout(() => {
        toast.dismiss();
      }, 1000);
    } else {
      errorToaster(SOMETHING_WENT_WRONG);
      setTimeout(() => {
        toast.dismiss();
      }, 1000);
    }
    closeDeleteModal();
  };

  //update Location
  const Update = async () => {
    let data = {
      city: cityName,
      id: locationDetails._id,
    };
    let res = await httpPut(`${AUTH_ENDPOINT}/location/${data.id}`, data);
    setLoading(true);
    if (res.status === 200) {
      setLoading(false);
      let objIndex = locationData.findIndex((obj) => obj._id === data.id);
      locationData[objIndex] = res.data.data;
      setLocationData(locationData);
      successToaster(UPDATED);
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

  //Save Location

  //close Location Modal
  const locationClose = async () => {
    setShowLocation(false);
  };

  //change status 
  const changeStatus = async (data, e) => {
    let res = await httpPut(`${AUTH_ENDPOINT}/location/status/${data._id}`);
    setLoading(true);

    if (res.status === 200) {
      setLoading(false);
      getData();
      locationData.filter((data) => data.status === true);
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

  //  To paginate
  const PaginationHandleClick = (offset, page) => {
    setOffSet(offset);
    setCurrentPage(page);
    getData(offset);
  };

  // get search data
  const getSearchData = async () => {
    setLoading(true);
    let res = await httpGet(
      `${AUTH_ENDPOINT}/location/search?text=${searchValue}&offSet=${offSet}&limit=${limit}`
    );
    let response = res?.data?.data;
    setLoading(false);
    response.length && setLocationData(response);
    response.length < 10 && setPaginations(false);
  };

  const validate = (values) => {
    const errors = {};
    if (!values.cityName) {
      errors.cityName = MANDATORY;
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      cityName: "",
    },
    validate,
    onSubmit: async (values) => {

      if (updateId) {
        let data = {
          city: values.cityName,
          cityHebrew: values.cityName,
          cityEnglish: values.cityName,
          id: updateId,
        };
        let res = await httpPut(`${AUTH_ENDPOINT}/location/${data.id}`, data);
        setLoading(true);
        if (res.status === 200) {
          setLoading(false);
          let objIndex = locationData.findIndex((obj) => obj._id === data.id);
          locationData[objIndex] = res.data.data;
          setLocationData(locationData);
          setShowLocation(false);
          successToaster(UPDATED);
          setTimeout(() => {
            toast.dismiss();
          }, 1000);
        } else {
          errorToaster(SOMETHING_WENT_WRONG);
          setTimeout(() => {
            toast.dismiss();
          }, 1000);
        }
      }
      else {
        let data = {
          city: values.cityName,
          cityEnglish: values.cityName,
          cityHebrew: values.cityName
        }
        let res = await httpPost(`${AUTH_ENDPOINT}/location`, data);
        setLoading(true);
        if (res?.status === 200) {
          setLoading(false);
          setShowLocation(false);
          getData();
          setCityName("");
          successToaster(ADDED);
          setTimeout(() => {
            toast.dismiss();
          }, 1000);
        } else {
          errorToaster(SOMETHING_WENT_WRONG);
          setTimeout(() => {
            toast.dismiss();
          }, 1000);
        }
      }
    }
  });


  return (
    <>
      {loading && <Loader />}
      <div className="main-content">
        <div className="listing-headder">
          <div className="tabing-content-inner">
            <div className="search-point justify-content-between">
              <Form inline="true" className="search-box d-flex">
                <FormControl
                  type="text"
                  placeholder="Search"
                  className="mr-2"
                  value={searchString}
                  onChange={(e) => setSearchString(e.target.value)}
                />
                <Button variant="outline-success">
                  <img src={searchIcon} alt="" />
                </Button>
                <Button
                  onClick={getLocationAllData}
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
              <Button onClick={() => locationsOpen('new')} className="new-btn">
                New
              </Button>
            </div>
            <div className="listing-content-table">
              <Table responsive className="porfile-list">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>City</th>
                    <th>Profile</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {locationData?.map((item, key) => {
                    return (
                      <tr key={key}>
                        <td onClick={(e) => editButton(item)}>{key + 1}</td>
                        <td onClick={(e) => editButton(item)}>{item?.cityHebrew}</td>
                        <td onClick={(e) => editButton(item)}>
                          {item.profile ? item.profile : 0}
                        </td>
                        <td>
                          <div className="d-flex">
                            <div className="statusWrap">
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  onChange={(e) => changeStatus(item, e)}
                                  checked={item.status}
                                />
                                <span className="slider round"></span>
                              </label>
                            </div> 
                            <img
                              onClick={(e) => deleteModalOpen(item._id)}
                              src={deleteIcon}
                              alt="delete"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>

            {/* pagination HTML Start */}
            {paginations && (
              <CustomPagination
                limit={limit}
                pages={pages}
                currentPage={currentPage}
                PaginationHandleClick={PaginationHandleClick}
              />
            )}
            {/* pagination HTML End */}

          </div>
        </div>
      </div>

      <Modal
        backdrop="static"
        show={showLocation}
        onHide={locationClose}
        className="location-modal"
      >
        <Form onSubmit={formik.handleSubmit}>
          <div className="crossBtnwrap d-flex justify-content-end">
            <Button onClick={locationsClose}>
              <img src={closeIcon} alt="close" />
            </Button>
          </div>
          <Modal.Body>
            <Form.Group className="form-group" controlId="cityName">
              <Form.Control
                type="text"
                placeholder="City"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.cityName}
              />
              {formik.errors.cityName && formik.touched.cityName ? (
                <div className="text-danger">{formik.errors.cityName}</div>
              ) : null}

            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" className="save" variant="primary">
              {updateId ? "Update" : "Save"}
            </Button>
          </Modal.Footer>
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
                    onClick={del}
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
    </>
  );
}
export default Locations;
