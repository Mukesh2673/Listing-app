import React from "react";
import {
  Nav,
  TabContainer,
  Form,
  FormControl,
  Button,
  Tab,
  Table,
  Modal,
} from "react-bootstrap";
import "./style.scss";
import "../../assets/scss/main.scss";
import searchIcon from "../../assets/images/searchIcon.svg";
import { useState, useEffect, useRef } from "react";
import { AUTH_ENDPOINT } from "../../config/endPoints";
import { BASE_URL } from "../../config/endPoints";
import { httpDelete, httpGet, httpPut } from "../../utils/http";
import { CSVLink } from "react-csv";
import deleteIcon from "../../assets/images/deleteIcon.svg";
import exportIcon from "../../assets/images/exportIcon.svg";
import { useNavigate } from "react-router-dom";
import closeIcon from "../../assets/images/closeIcon.svg";
import { errorToaster, successToaster } from "../../components/Toaster";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomPagination from "../../components/Pagination";
import { useDebounce } from "use-debounce";
import {
  DELETED,
  DELETE_CONFIRMATION,
  SOMETHING_WENT_WRONG,
  STATUS_CHANGED
} from "../../config/const";
import Loader from "../../components/Loader";
const Profile = () => {
  //get Data
  const [showProfile, setShowProfile] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [activeMenu, setActiveMenu] = useState("first");
  const [exportData, setExportData] = useState([]);
  const closeDeleteModal = () => setShowDeleteModal(false);
  const [pages, setPages] = useState(0);
  const [offSet, setOffSet] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [searchValue] = useDebounce(searchString, 1000);
  const [loading, setLoading] = useState(false);
  const [planSubscription, setPlanSubscription] = useState(null)
  const csvLink = useRef(null);

  const navigate = useNavigate();
  useEffect(() => {
    getData();
  }, []);
  async function getData(offSet = 0) {
    setLoading(true);
    await httpGet(
      `${BASE_URL}/auth/profile?offSet=${offSet}&limit=${limit}`
    ).then((res) => {
      if (res?.data?.data) {
        setLoading(false);
        let data = res?.data?.data;
        setShowProfile(data);
        setPages(res?.data?.pages);

        setActiveMenu("first");
      }
    });
  }

  const getSearchData = async (offSet = 0) => {
    setLoading(true);
    let res = await httpGet(
      `${BASE_URL}/auth/profile/search?text=${searchValue}&offSet=${offSet}&limit=${limit}`
    );
    setLoading(false);
    let response = res?.data?.data;
    setPages(res?.data?.pages);
    setShowProfile(response);
  };

  const PaginationHandleClick = (offset, page) => {
    setOffSet(offset);
    setCurrentPage(page);
    getData(offset);
  };

  // Get profile data specific to profile type
  function getProfiletypeData(type) {
    httpGet(
      `${BASE_URL}/auth/profile?offSet=${offSet}&limit=${limit}&profile=${type}`
    ).then((res) => {
      if (res?.data?.data) {
        let data = res?.data?.data;
        setShowProfile(data);
      }
    });
  }

  //delete Profile
  const del = async (data) => {
    setLoading(true);
    let res = await httpDelete(`${AUTH_ENDPOINT}/profile/${deleteId}`);
    if (res.status === 200) {
      setLoading(false);
      setActiveMenu("first");
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

  //Edit Profile
  const editProfile = async (data) => {
    navigate(`/updateprofile/${data._id}`);
  };

  //search Profile
  useEffect(() => {
    if (searchValue.length === 0) {
      getData();
    } else {
      getSearchData();
    }
  }, [searchValue]);

  // Open delete Modal
  const deleteModalOpen = (id) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  };

  const getProfiletype = (type) => {
    getProfiletypeData(type);
  };

  // Update Status
  const changeStatus = async (data) => {
    setLoading(true);
    let res = await httpPut(`${AUTH_ENDPOINT}/profile/status/${data._id}`);
    if (res.status === 200) {
      setLoading(false);
      successToaster(STATUS_CHANGED);
      getData();
    }
  };

  // get all profile data
  const getProfileAllData = async () => {
    setLoading(true);
    await httpGet(
      `${BASE_URL}/auth/profile?offSet=${0}&limit=${limit * pages}`
    ).then((res) => {
      if (res?.data?.data) {
        let obj = res?.data?.data;

        let data = res?.data?.data;
        let arr = [];
        obj?.map((response, index) => {
          arr[index] = {
            email: response?.email ? response?.email : "Null",
            description: response?.description ? response?.description : "Null",
            phone: response?.phone ? response?.phone : "Null",
            address: response?.address ? response?.address : "Null",
            vat: response?.vat ? response?.vat : "Null",
            activeDay: response?.activeDay ? response?.activeDay : "Null",
            city: response?.city[0]?.value ? response?.city[0]?.value : "Null",
            starttime: response?.starttime ? response?.starttime : "Null",
            id: response?._id ? response?._id : "Null",
            endtime: response?.endtime ? response?.endtime : "Null",
            startDate: response?.startDate ? response?.startDate : "Null",
            subscription: response?.subscription
              ? response?.subscription
              : "null",
            expiredDate: response?.expiredDate ? response?.expiredDate : "Null",
            probadge: response?.proBadge ? response?.proBadge : "Null",
            status: response?.status ? response?.status : "Null",
            updated: response?.updatedAt ? response?.updatedAt : "null",
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
        <div className="tab-search-wrap">
          <TabContainer
            id="left-tabs-example"
            defaultActiveKey={activeMenu}
            activeKey={activeMenu}
          >
            <div className="tabs-btn">
              <div className="tab-search">
                <div className="search-point">
                  <Form inline="true" className="search-box d-flex">
                    <FormControl
                      type="text"
                      placeholder="Search"
                      className="mr-sm-2"
                      value={searchString}
                      onChange={(e) => setSearchString(e.target.value)}
                    />
                    <Button variant="outline-success">
                      <img src={searchIcon} alt="" />
                    </Button>
                  </Form>
                  <Button
                    onClick={getProfileAllData}
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
                </div>
                <Nav variant="pills">
                  <Nav.Item>
                    <Nav.Link
                      eventKey="first"
                      onClick={() => {
                        setActiveMenu("first");
                        getData();
                      }}
                    >
                      All
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="second"
                      onClick={() => {
                        setActiveMenu("second");
                        getProfiletype("pro");
                      }}
                    >
                      Pro
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="third"
                      onClick={() => {
                        setActiveMenu("third");
                        getProfiletype("lite");
                      }}
                    >
                      Lite
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="fourth"
                      onClick={() => {
                        setActiveMenu("fourth");
                        getProfiletype("free");
                      }}
                    >
                      Free
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </div>
              <Button
                className="new-btn"
                onClick={() => {
                  navigate("/addprofile");
                }}
              >
                New
              </Button>
            </div>
            <div className="tabing-content">
              <div className="tabing-content-inner">
                <Tab.Content>
                  <Tab.Pane eventKey="first">
                    <div className="">
                      <Table responsive className="porfile-list">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>City</th>
                            <th>Phone</th>
                            <th>Plan</th>
                            <th>Start</th>
                            <th>End</th>
                            <th>Vat</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {showProfile?.map((item, key) => {
                            return (
                              <tr key={key} >
                                <td>{key + 1} </td>
                                <td onClick={() => editProfile(item)}>{item.title ? item.title : "Null"}</td>
                                <td onClick={() => editProfile(item)}>{item?.city[0]?.value ? item?.city[0]?.value : "Null"}</td>
                                <td onClick={() => editProfile(item)}>{item.phone ? item.phone : "Null"}</td>
                                <td onClick={() => editProfile(item)}
                                className={(item.subscription === 'pro' && "pro-btn")|| (item.subscription === 'lite' && "lite-btn") || (item.subscription === 'free' && "free-btn")} 

                                > 
                                    <div className="planText">
                                      {item.subscription
                                        ? item.subscription
                                        : "Null"}
                                    </div>
                                </td>
                                <td onClick={() => editProfile(item)}>
                                  {item.startDate
                                    ? item.startDate
                                      .split("-")
                                      .reverse()
                                      .join("-")
                                    : "Null"}
                                </td>
                                <td onClick={() => editProfile(item)}>
                                  {item.expiredDate
                                    ? item.expiredDate
                                      .split("-")
                                      .reverse()
                                      .join("-")
                                    : "Null"}
                                </td>
                                <td onClick={() => editProfile(item)}>{item.vat ? item.vat : "Null"}</td>

                                
                                <td>
                                  <div className="d-flex">
                                    <div className="statusWrap">
                                      <label className="switch">
                                        <input
                                          type="checkbox"
                                          onChange={(e) => changeStatus(item)}
                                          checked={item.status}
                                        />
                                        <span className="slider round"></span>
                                      </label>
                                    </div>
                                    <div className="d-flex btnsGroup">
                                      
                                      <img
                                        src={deleteIcon}
                                        alt=""
                                        onClick={() =>
                                          deleteModalOpen(item._id)
                                        }
                                      />
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="second">
                    <div className="">
                      <Table responsive className="porfile-list">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>City</th>
                            <th>Phone</th>
                            <th>Plan</th>
                            <th>Start</th>
                            <th>End</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {showProfile?.map((item, key) => {
                            return (
                              <tr key={key}>
                                <td>{key + 1} </td>
                                <td onClick={() => editProfile(item)}>{item.title ? item.title : "Null"}</td>
                                <td onClick={() => editProfile(item)}>{item?.city[0]?.value ? item?.city[0].value : "Null"}</td>
                                <td onClick={() => editProfile(item)}>{item.phone ? item.phone : "Null"}</td>
                                <td onClick={() => editProfile(item)}  
                                  className={(item.subscription === 'pro' && "pro-btn")|| (item.subscription === 'lite' && "lite-btn") || (item.subscription === 'free' && "free-btn")} 

                                >
                                  <div className="planText">
                                    {item.subscription
                                    ? item.subscription
                                    : "Null"}
                                  </div>
                                </td>
                                <td onClick={() => editProfile(item)}>
                                  {item.startDate ? item.startDate : "Null"}
                                </td>
                                <td onClick={() => editProfile(item)}>
                                  {item.expiredDate ? item.expiredDate : "Null"}
                                </td>

                                <td>
                                  <div className="d-flex">
                                    <div className="statusWrap">
                                      <label className="switch">
                                        <input
                                          type="checkbox"
                                          onChange={(e) => changeStatus(item)}
                                          checked={item.status}
                                        />
                                        <span className="slider round"></span>
                                      </label>
                                    </div>
                                    <div className="d-flex btnsGroup">
                                      
                                      <img
                                        src={deleteIcon}
                                        alt=""
                                        onClick={() =>
                                          deleteModalOpen(item._id)
                                        }
                                      />
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="third">
                    <div className="">
                      <Table responsive className="porfile-list">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>City</th>
                            <th>Phone</th>
                            <th>Plan</th>
                            <th>Start</th>
                            <th>End</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {showProfile?.map((item, key) => {
                            return (
                              <tr key={key}>
                                <td>{key + 1} </td>
                                <td onClick={() => editProfile(item)}>{item.title ? item.title : "Null"}</td>
                                <td onClick={() => editProfile(item)}>{item?.city[0]?.value ? item?.city[0]?.value : "Null"}</td>
                                <td onClick={() => editProfile(item)}>{item.phone ? item.phone : "Null"}</td>
                                <td onClick={() => editProfile(item)} 
                                //  className={`${item.subscription}` }
                                className={(item.subscription === 'pro' && "pro-btn")|| (item.subscription === 'lite' && "lite-btn") || (item.subscription === 'free' && "free-btn")} 

                                
                                >
                                  <div className="planText">
                                  {item.subscription
                                    ? item.subscription
                                    : "Null"}
                                    </div>
                                </td>
                                <td onClick={() => editProfile(item)}>
                                  {item.startDate ? item.startDate : "Null"}
                                </td>
                                <td onClick={() => editProfile(item)}>
                                  {item.expiredDate ? item.expiredDate : "Null"}
                                </td>

                                <td>
                                  <div className="d-flex">
                                    <div className="statusWrap">
                                      <label className="switch">
                                        <input
                                          type="checkbox"
                                          onChange={(e) => changeStatus(item)}
                                          checked={item.status}
                                        />
                                        <span className="slider round"></span>
                                      </label>
                                    </div>
                                    <div className="d-flex btnsGroup">
                                      
                                      <img
                                        src={deleteIcon}
                                        alt=""
                                        onClick={() =>
                                          deleteModalOpen(item._id)
                                        }
                                      />
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="fourth">
                    <div className="">
                      <Table responsive className="porfile-list">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>City</th>
                            <th>Phone</th>
                            <th>Plan</th>
                            <th>Start</th>
                            <th>End</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {showProfile?.map((item, key) => {
                            return (
                              <tr key={key}>
                                <td onClick={() => editProfile(item)}>{key + 1} </td>
                                <td onClick={() => editProfile(item)}>{item.title ? item.title : "Null"}</td>
                                <td onClick={() => editProfile(item)}>{item?.city[0]?.value ? item?.city[0]?.value : "Null"}</td>
                                <td onClick={() => editProfile(item)}>{item.phone ? item.phone : "Null"}</td>
                                <td onClick={() => editProfile(item)}  
                                // className={`${item.subscription}` }
                                className={(item.subscription === 'pro' && "pro-btn")|| (item.subscription === 'lite' && "lite-btn") || (item.subscription === 'free' && "free-btn")} 

                                >
                                  <div className="planText">
                                  {item.subscription
                                    ? item.subscription
                                    : "Null"}
                                    </div>
                                </td>
                                <td onClick={() => editProfile(item)}>
                                  {item.startDate ? item.startDate : "Null"}
                                </td>
                                <td onClick={() => editProfile(item)}>
                                  {item.expiredDate ? item.expiredDate : "Null"}
                                </td>

                                <td>
                                  <div className="d-flex">
                                    <div className="statusWrap">
                                      <label className="switch">
                                        <input
                                          type="checkbox"
                                          onChange={(e) => changeStatus(item)}
                                          checked={item.status}
                                        />
                                        <span className="slider round"></span>
                                      </label>
                                    </div>
                                    <div className="d-flex btnsGroup">
                                     
                                      <img
                                        src={deleteIcon}
                                        alt=""
                                        onClick={() =>
                                          deleteModalOpen(item._id)
                                        }
                                      />
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </div>{" "}
                  </Tab.Pane>
                </Tab.Content>
              </div>
            </div>
          </TabContainer>

          {/* pagination HTML Start */}
          <CustomPagination
            limit={limit}
            pages={pages}
            currentPage={currentPage}
            PaginationHandleClick={PaginationHandleClick}
          />
          {/* pagination HTML End */}
        </div>

        {/* Delete MOdal starts here*/}
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
        {/* Delete MOdal starts here*/}
      </div>
    </>
  );
};
export default Profile;
