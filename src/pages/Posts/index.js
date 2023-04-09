import Select from "react-select";
import { Form, FormControl, Button, Table, Modal } from "react-bootstrap";
import "./style.scss";
import "../../assets/scss/main.scss";
import searchIcon from "../../assets/images/searchIcon.svg";
import exportIcon from "../../assets/images/exportIcon.svg";
import cancelIcon from "../../assets/images/cancel.png";

import { useEffect, useState, useRef } from "react";
import { BASE_URL, IMAGE_URL, POSTS_ENDPOINT } from "../../config/endPoints";
import {
  httpDelete,
  httpGet,
  httpPut,
  httpPostFormData,
  httpPutFormData,
} from "../../utils/http";
import { useFormik } from "formik";
import { errorToaster, successToaster } from "../../components/Toaster";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CSVLink } from "react-csv";
import editIcon from "../../assets/images/editIcon.svg";
import closeIcon from "../../assets/images/closeIcon.svg";
import deleteIcon from "../../assets/images/deleteIcon.svg";
import fileuploadIcon from "../../assets/images/fileuploadIcon.svg";
import { useDebounce } from "use-debounce";
import {
  ADDED,
  DELETED,
  DELETE_CONFIRMATION,
  MANDATORY,
  SOMETHING_WENT_WRONG,
  STATUS_CHANGED,
} from "../../config/const";
import Loader from "../../components/Loader";
import CustomPagination from "../../components/Pagination";

function Posts() {
  // Category usestate St
  const [addClass, setaddClass] = useState("");
  const [updateId, setUpdateId] = useState();
  const [showPost, setShowPost] = useState(false);
  const [posts, setPosts] = useState([]);
  const [searchField, setSearchField] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [categoryId, setcategoryId] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [exportData, setExportData] = useState([]);
  const [searchValue] = useDebounce(searchField, 1000);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [offSet, setOffSet] = useState(0);
  const [pages, setPages] = useState(0);
  const csvLink = useRef(null);

  //Open Post

  const postOpen = (type) => {
    if (type == "new") {
      formik.resetForm();
      setSelectedCategory("");
      setUpdateId();
      setShowPost(true);
    } else {
      setShowPost(true);
    }
  };

  //close Post
  const postClose = () => {
    setShowPost(false);
    setPreviewImage("");
  };

  // Delete modal Open
  const deleteModalOpen = (id) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  };

  const closeDeleteModal = () => setShowDeleteModal(false);

  // Create Post
  const createPost = async (data) => {
    setLoading(true);
    let res = await httpPostFormData(`${POSTS_ENDPOINT}`, data);
    if (res.status === 200) {
      setLoading(false);

      setShowPost(false);
      setPreviewImage("");
      successToaster(ADDED);
      getPosts();
      setcategoryId([]);
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

  // Get posts
  const getPosts = (offSet = 0) => {
    setLoading(true);
    httpGet(`${POSTS_ENDPOINT}?offSet=${offSet}&limit=${limit}`).then((res) => {
      if (res?.data?.data) {
        setLoading(false);
        let data = res?.data?.data;
        setPosts(data);
        let arr = [];
        let exp = data.map((item, index) => {
          arr[index] = {
            createdAt: item.createdAt,
            category: item.category ? item.category : "Null",
            text: item.text ? item.text : "Null",
            title: item.title ? item.title : "Null",
            updatedAt: item.updatedAt,
          };
        });
        setExportData(arr);
        setPages(res?.data?.pages);
      }
    });
  };

  // Get posts and category when page loads for the first time
  useEffect(() => {
    getPosts();
    getCategory("");
  }, []);

  // Update post
  const updatePost = async (data) => {
    setLoading(true);

    let res = await httpPutFormData(`${POSTS_ENDPOINT}/${updateId}`, data);
    if (res.status === 200) {
      setLoading(false);

      setShowPost(false);
      setPreviewImage("");
      successToaster(ADDED);

      getPosts();
      setcategoryId([]);
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

  // set search state
  const handleSearch = (e) => {
    setSearchField(e.target.value);
  };

  // Get search data everytime search value changes
  useEffect(() => {
    if (searchValue.length === 0) {
      getPosts();
    } else {
      getSearchData();
    }
  }, [searchValue]);

  //change status
  const changeStatus = async (data, e) => {
    setLoading(true);

    let res = await httpPut(`${POSTS_ENDPOINT}/status/${data._id}`);
    if (res.status === 200) {
      setLoading(false);

      successToaster(STATUS_CHANGED);
      getPosts();
    } else {
      errorToaster(SOMETHING_WENT_WRONG);
      setTimeout(() => {
        toast.dismiss();
      }, 1000);
    }
  };

  // get search data
  const getSearchData = async (offSet = 0) => {
    setLoading(true);

    let res = await httpGet(
      `${POSTS_ENDPOINT}/search?text=${searchValue}&offSet=${offSet}&limit=${50}`
    );
    setLoading(false);

    let response = res?.data?.data;
    setPosts(response);
  };

  // Get category
  const getCategory = (categoryArr) => {
    let arr = [];
    if (categoryArr?.length > 0) {
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

  const handleCategoryChange = (newSelection) => {
    formik.setFieldValue("category", newSelection.value);
    setcategoryId(newSelection);
  };

  const editButton = async (data) => {
    postOpen();
    setUpdateId(data._id);
    getCategory(data.categoryId);
    if (!data.image) {
      setPreviewImage("");
    } else {
      setPreviewImage(IMAGE_URL + `post/${data.image}`);
    }
    let category = data.category.toUpperCase();
    setSelectedCategory(category);
    formik.setFieldValue("title", data?.title);
    formik.setFieldValue("text", data?.text);
    setaddClass("uploadImage");
  };
  const del = async (data) => {
    setLoading(true);

    let res = await httpDelete(`${POSTS_ENDPOINT}/${deleteId}`);
    if (res?.status === 200) {
      setLoading(false);

      getPosts();
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

  const validate = (values) => {
    const errors = {};
    if (!values.title) {
      errors.title = MANDATORY;
    }
    if (!values.text) {
      errors.text = MANDATORY;
    }
    if (values.category.length < 1) {
      errors.category = MANDATORY;
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      image: "",
      category: [],
      title: "",
      text: "",
    },
    validate,
    onSubmit: async (values) => {
      let formData = new FormData();
      formData.append("image", values.image);
      formData.append("category", values.category);
      formData.append("title", values.title);
      formData.append("text", values.text);
      if (updateId) {
        updatePost(formData);
      } else {
        createPost(formData);
      }
    },
  });

  //upload post Image
  const uploadPostImg = async (event) => {
    let img = URL.createObjectURL(event.target.files[0]);
    formik.setFieldValue("image", event.target.files[0]);
    setPreviewImage(img);
  };
  const PaginationHandleClick = (offset, page) => {
    setOffSet(offset);
    setCurrentPage(page);
    getPosts(offset);
  };
  const getPostAllData = async () => {
    setLoading(true);
    await httpGet(`${POSTS_ENDPOINT}?offSet=${0}&limit=${limit * pages}`).then(
      (res) => {
        if (res?.data?.data) {
          let obj = res?.data?.data;
          let arr = [];
          obj.map((response, index) => {
            arr[index] = {
              text: response?.text ? response?.text : "Null",
              title: response?.title ? response?.title : "Null",
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
      }
    );
  };
  return (
    <>
      {/* Header HTML End */}

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
                  onChange={handleSearch}
                  value={searchField}
                />
                <Button variant="outline-success">
                  <img src={searchIcon} alt="" />
                </Button>

                <Button
                  onClick={getPostAllData}
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
              <Button onClick={() => postOpen("new")} className="new-btn">
                New
              </Button>
            </div>
            <div className="listing-content-table">
              <Table responsive className="porfile-list">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Image</th>
                    <th>Category</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((item, key) => {
                    return (
                      <tr key={key}>
                        <td onClick={(e) => editButton(item)}>{key + 1}</td>
                        <td onClick={(e) => editButton(item)}>{item.title}</td>
                        <td onClick={(e) => editButton(item)}>
                          {item.image ? (
                            <img
                              src={IMAGE_URL + `post/${item.image}`}
                              alt="post"
                              className="post"
                            />
                          ) : (
                            "Null"
                          )}
                        </td>
                        <td onClick={(e) => editButton(item)}>{item.category}</td>
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
      <Modal show={showPost} onHide={postClose} className="posts-modal">
        <form onSubmit={formik.handleSubmit}>
          <div className="crossBtnwrap d-flex justify-content-end">
            <Button onClick={postClose}>
              <img src={closeIcon} alt="close" />
            </Button>
          </div>
          <Modal.Body>
            <div className="image-upload">
              <div className={`fileupload ${addClass}`}>
                {previewImage && (
                  <>
                    <button
                      className="crossBtn"
                      onClick={() => {
                        setPreviewImage("");
                        formik.setFieldValue("image", "");
                      }}
                    >
                      <img src={cancelIcon} alt="" />
                    </button>
                    <div className="previewImg">
                      <img
                        className="profilePreviewImg"
                        src={previewImage}
                        alt=""
                      />
                    </div>
                  </>
                )}

                {!previewImage && (
                  <>
                    <input
                      type="file"
                      label="Example file input"
                      onChange={(e) => {
                        uploadPostImg(e);
                        setaddClass("uploadImage");
                      }}
                      accept="image/*"
                    />

                    <Button className="folder-upload">
                      <img src={fileuploadIcon} alt="" />
                      <input
                        type="file"
                        label="Example file input"
                        onChange={(e) => {
                          uploadPostImg(e);
                          setaddClass("uploadImage");
                        }}
                        accept="image/*"
                      />
                    </Button>
                  </>
                )}
              </div>
            </div>
            <Form.Group className="form-group" controlId="categoryName">
              <Select
                value={categoryId}
                onChange={handleCategoryChange}
                name="category"
                options={category}
                className="basic-multi-select"
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
                placeholder="Title"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
                name="title"
              />
              {formik.errors.title && formik.touched.title ? (
                <div className="text-danger">{formik.errors.title}</div>
              ) : null}
            </Form.Group>
            <Form.Group className="form-group" controlId="servicetext">
              <Form.Control
                as="textarea"
                rows={3}
                type="text"
                placeholder="Text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.text}
                name="text"
              />
              {formik.errors.text ? (
                <div className="text-danger">{formik.errors.text}</div>
              ) : null}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button className="save" type="submit" variant="primary">
              {" "}
              {updateId ? "Update" : "Save"}{" "}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
      {/* Modal Category HTML End */}

      {/*Delete modal starts here */}
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
      {/*Delete modal ends here */}
    </>
  );
}

export default Posts;
