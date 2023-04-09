import { useEffect, useState, useRef } from "react"; 
import { Form, FormControl, Button, Table, Modal } from "react-bootstrap"; 
import cancelIcon from "../../assets/images/cancel.png";
import searchIcon from "../../assets/images/searchIcon.svg";
import editIcon from "../../assets/images/editIcon.svg";
import deleteIcon from "../../assets/images/deleteIcon.svg";
import closeIcon from "../../assets/images/closeIcon.svg";
import exportIcon from "../../assets/images/exportIcon.svg";
import fileuploadIcon from "../../assets/images/fileuploadIcon.svg";
import { useFormik } from "formik";
import {
  BASE_URL,
  DELETE_CATEGORY_ENDPOINT,
  UPDATE_CATEGORY_ENDPOINT,
  IMAGE_URL,
} from "../../config/endPoints";
import {
  httpDelete,
  httpGet,
  httpPut,
  httpPostFormData,
  httpPutFormData,
} from "../../utils/http";
import { errorToaster, successToaster } from "../../components/Toaster";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CSVLink } from "react-csv";
import { useDebounce } from "use-debounce";
import {
  ADDED,
  CATEGORY_ALREADY_EXISTS,
  DELETED,
  DELETE_CONFIRMATION,
  MANDATORY,
  SOMETHING_WENT_WRONG,
  STATUS_CHANGED,
  UPDATED,
} from "../../config/const";
import Loader from "../../components/Loader";
import CustomPagination from "../../components/Pagination";
import "./style.scss";
import "../../assets/scss/main.scss";

function Categories() {
  const [showCategory, setShowCategory] = useState(false);
  const [updateId, setUpdateId] = useState();
  const [categoryData, setCategoryData] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [searchValue] = useDebounce(searchString, 1000);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [previewImage, setPreviewImage] = useState("");
  const [exportData, setExportData] = useState([]);
  const [imgClass, setImgClass] = useState("");
  const closeDeleteModal = () => setShowDeleteModal(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [offSet, setOffSet] = useState(0);
  const [pages, setPages] = useState(0);
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(false);
  const csvLink = useRef(null);


   // To get categories in table when app loads for the first time
   useEffect(() => {
    getCategories();
  }, []);

  //search categories Data
  useEffect(() => {
    if (searchValue.length === 0) {
      getCategories();
    } else {
      let data = getSearchData();
    }
  }, [searchValue]);


  const deleteModalOpen = (id) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  };

  const categoryOpen = (type) => {
    if (type == "new") {
      formik.resetForm();
      setUpdateId();
      setShowCategory(true);
    } else {
      setShowCategory(true);
    }
  };


  // Get categories
  const getCategories = async () => {
    setLoading(true);
    await httpGet(`${BASE_URL}/category?offSet=${offSet}&limit=${limit}`).then(
      (res) => {
        if (res?.data?.data) {
          setLoading(false);
          let data = res?.data?.data;
          setCategoryData(data);
          let arr = [];
         data.map((item, index) => {
            arr[index] = {
              createdAt: item.createdAt,
              name: item.name,
              updatedAt: item.updatedAt,
            };
          });
          setExportData(arr);
          setPages(res?.data?.pages);
        }
      }
    );
  };

 
  //close category
  const categoryClose = () => {
    setShowCategory(false);
    setPreviewImage("");
  };

  // on edit button on table rows
  const editButton = async (data) => {
    categoryOpen();
    setUpdateId(data._id);
    setPreviewImage(IMAGE_URL + `category/${data.image}`);
    formik.setFieldValue("categoryName", data?.name);
    formik.setFieldValue("categoryImg", data.image);
    setImgClass("uploadImage");
  };

  // to delete a table entry

  const del = async (id) => {
    try {
      setLoading(true);

      const res = await categoryData.filter((category) => category._id !== id);
      setCategoryData(res);
      await httpDelete(
        `${DELETE_CATEGORY_ENDPOINT}/${deleteId}`
      );

      setLoading(false);
      successToaster(DELETED);
      setTimeout(() => {
        toast.dismiss();
        getCategories();
      }, 1000);
    } catch (error) {
      errorToaster(SOMETHING_WENT_WRONG);
      setTimeout(() => {
        toast.dismiss();
        getCategories();
      }, 1000);
    }
    closeDeleteModal();
  };


  const validate = (values) => {
    const errors = {};
    if (!values.categoryName) {
      errors.categoryName = MANDATORY;
    }
    return errors;
  };


  const formik = useFormik({
    initialValues: {
      categoryName: "",
      categoryImg: "",
    },
    validate,
    onSubmit: async (values) => {
      let formData = new FormData();
      formData.append("categoryImg", values.categoryImg);
      formData.append("name", values.categoryName);
      if (updateId) {
        setLoading(true);
        let res = await httpPutFormData(
          `${UPDATE_CATEGORY_ENDPOINT}/${updateId}`,
          formData
        );
        if (res.status === 200 && res.data.status !== 400) {
          setLoading(false);
          categoryClose();
          successToaster(UPDATED);
          getCategories();
          setTimeout(() => {
            toast.dismiss();
          }, 1000);
        } else if (res.data.status === 400) {
          setLoading(false);
          categoryClose();
          errorToaster(CATEGORY_ALREADY_EXISTS);
          setTimeout(() => {
            toast.dismiss();
          }, 1000);
        } else {
          errorToaster(SOMETHING_WENT_WRONG);
          setLoading(false) 
          categoryClose();
          setTimeout(() => {
            toast.dismiss();
          }, 1000);
        }
      } else {
        setLoading(true);
        let res = await httpPostFormData(`${BASE_URL}/category`, formData);
        if (res.status === 200 && res.data.status !== 400) {
          setLoading(false);
          categoryClose();
          successToaster(ADDED);
          setPreviewImage("");
          getCategories();
          setTimeout(() => {
            toast.dismiss();
          }, 1000);
        } else if (res.data.status === 400) {
          errorToaster(CATEGORY_ALREADY_EXISTS);
          categoryClose();
          setTimeout(() => {
            toast.dismiss();
            setLoading(false)
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

  //Pagination function
  const PaginationHandleClick = (offset, page) => {
    setOffSet(offset);
    setCurrentPage(page);
    getCategories(offset);
  };

    // Set Status
  const changeStatus = async (data, e) => {
    setLoading(true);
    let res = await httpPut(`${UPDATE_CATEGORY_ENDPOINT}/status/${data._id}`);
    if (res.status === 200) {
      setLoading(false);
      getCategories();
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

  //update Image Preview
  const uploadCategoryImg = async (event) => {
    let img = URL.createObjectURL(event.target.files[0]);
    formik.setFieldValue("categoryImg", event.target.files[0]);
    setPreviewImage(img);
  };
  const getSearchData = async (offSet = 0) => {
    let res = await httpGet(
      `${BASE_URL}/category/search?text=${searchValue}&offSet=${offSet}&limit=${50}`
    );
    setLoading(true);
    if (res.status === 200) {
      setLoading(false);
      setCategoryData(res.data.data);
    } else {
      errorToaster(SOMETHING_WENT_WRONG);
      setTimeout(() => {
        toast.dismiss();
      }, 1000);
    }
  };

  // Get all category Data
  const getCategoryAllData = async () => {
    setLoading(true);
    await httpGet(
      `${BASE_URL}/category?offSet=${offSet}&limit=${limit * pages}`
    ).then((res) => {
      if (res?.data?.data) {
        let obj = res?.data?.data;
        let arr = [];
        obj.map((response, index) => {
          arr[index] = {
            categoryName: response?.name ? response?.name : "Null",
            price: response?.price ? response?.price : "Null",
            profile: response?.profile ? response.profile : 0,
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
      <ToastContainer autoClose={1000} />
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
                  onClick={getCategoryAllData}
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
              <Button onClick={() => categoryOpen("new")} className="new-btn">
                New
              </Button>
            </div>

            <div className="listing-content-table">
              <Table responsive className="porfile-list">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Category</th>
                    <th>Image</th>
                    <th>Profile</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {categoryData.map((item, key) => {
                    return (
                      <tr key={key}>
                        <td onClick={(e) => editButton(item)}>{key + 1}</td>
                        <td onClick={(e) => editButton(item)}>{item.name}</td>
                        <td onClick={(e) => editButton(item)}>
                          {item.image ? (
                            <img
                              src={IMAGE_URL + `category/${item.image}`}
                              alt="post"
                              className="post"
                            />
                          ) : (
                            "Null"
                          )}
                        </td>
                        <td onClick={(e) => editButton(item)}>{item.profile ? item.profile : 0}</td>
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
                            <div className="d-flex"> 
                              <img
                                onClick={(e) => deleteModalOpen(item._id)}
                                src={deleteIcon}
                                alt="delete"
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
            <CustomPagination
              limit={limit}
              pages={pages}
              currentPage={currentPage}
              PaginationHandleClick={PaginationHandleClick}
            />
          </div>
        </div>
      </div>

      {/* Modal Category HTML Start */}
      <Modal
        show={showCategory}
        onHide={categoryClose}
        className="category-modal"
      >
        <Form onSubmit={formik.handleSubmit}>
          <div className="crossBtnwrap d-flex justify-content-end">
            <Button onClick={categoryClose}>
              <img src={closeIcon} alt="close" />
            </Button>
          </div>
          <Modal.Body>
            <Form.Group className="form-group" controlId="categoryName">
              <Form.Control
                type="text"
                placeholder="Category Name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.categoryName}
                name="categoryName"
              />
              {formik.errors.categoryName && formik.touched.categoryName ? (
                <div className="text-danger">{formik.errors.categoryName}</div>
              ) : null}
            </Form.Group>
            <div className="image-upload">
              <div className={`fileupload ${imgClass}`}>
                {previewImage && (
                  <>
                    <button
                      className="crossBtn"
                      onClick={() => {
                        setPreviewImage("");
                        formik.setFieldValue("categoryImg", "");
                      }}
                    >
                      <img src={cancelIcon} alt="" />
                    </button>
                    <div className="previewImg">
                      <img
                        className="categoryPreviewImg"
                        src={previewImage}
                        alt=""
                      />
                    </div>
                  </>
                )}
                <input
                  type="file"
                  label="Example file input"
                  onChange={(e) => {
                    uploadCategoryImg(e);
                    setImgClass("uploadImage");
                  }}
                  accept="image/*"
                />
                
                {!previewImage && (
                  <Button className="folder-upload">
                    <img src={fileuploadIcon} alt="fileuploadIcon" />
                    <input
                      type="file"
                      label="Example file input"
                      onChange={(e) => {
                        uploadCategoryImg(e);
                        setImgClass("uploadImage");
                      }}
                      accept="image/*"
                    />
                  </Button>
                )}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="submit"
              className="save"
              variant="primary"
              //onClick={categoryClose}
            >
              {" "}
              {updateId ? "Update" : "Save"}{" "}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      {/* Modal Category HTML End */}

      {/* delete modal Starts here */}
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

export default Categories;
