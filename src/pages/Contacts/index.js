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
const Contacts = () => {
  //get Data
  const [showContacts, setContacts] = useState([]);
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
      `${BASE_URL}/auth/contacts?offSet=${offSet}&limit=${limit}`
    ).then((res) => {
        console.log('valueo f res is',res);
              if (res?.data?.records) {
        setLoading(false);
        let data = res?.data?.records;
        console.log('dredata0',data)
        setContacts(data);
        setPages(res?.data?.pages);

        setActiveMenu("first");
      }
    });
  }
  const getSearchData = async (offSet = 0) => {
/*     setLoading(true);
    let res = await httpGet(
      `${BASE_URL}/auth/profile/search?text=${searchValue}&offSet=${offSet}&limit=${limit}`
    );
    setLoading(false);
    let response = res?.data?.data;
    setPages(res?.data?.pages);
    setContacts(response); */
  };

  const PaginationHandleClick = (offset, page) => {
    setOffSet(offset);
    setCurrentPage(page);
    getData(offset);
  };

  const del = async (data) => {
    setLoading(true);
    let res = await httpDelete(`${AUTH_ENDPOINT}/contacts/${deleteId}`);
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
  const editContact = async (data) => {
    //navigate(`/updateprofile/${data._id}`);
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

/*   const getProfiletype = (type) => {
    getProfiletypeData(type);
  }; */

  // Update Status
  const changeStatus = async (data) => {
    setLoading(true);
    let res = await httpPut(`${AUTH_ENDPOINT}/contacts/${data._id}`);
    if (res.status === 200) {
      setLoading(false);
      successToaster(STATUS_CHANGED);
      getData();
    }
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
      <div className="main-content">
        <div className="tab-search-wrap">
          <TabContainer
            id="left-tabs-example"
            defaultActiveKey={activeMenu}
            activeKey={activeMenu}
          >         
            <div className="tabing-content">
              <div className="tabing-content-inner">
                <Tab.Content>
                  <Tab.Pane eventKey="first">
                    <div className="">
                      <Table responsive className="porfile-list">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Subject</th>         
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {showContacts?.map((item, key) => {
                            return (
                              <tr key={key} >
                                <td>{key + 1} </td>
                                <td>{convertToData(item?.createdAt)}</td>
                                <td onClick={() => editContact(item)}>{item.fullName ? item.fullName : "Null"}</td>
                                <td onClick={() => editContact(item)}>{item.phone ? item.phone : "Null"}</td>
                                <td onClick={() => editContact(item)}>
                                    <p>{item?.message ? item?.message: "Null"}</p>
                                </td>                            
                                <td onClick={() => editContact(item)}
                                className={(item.subscription === 'pro' && "pro-btn")|| (item.subscription === 'lite' && "lite-btn") || (item.subscription === 'free' && "free-btn")}  > </td>
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
export default Contacts;
