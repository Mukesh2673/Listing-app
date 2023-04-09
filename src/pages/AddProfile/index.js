import React, { useState, useEffect, useRef } from "react";
import { Button, Row, Col, Form, Modal } from "react-bootstrap";
import "./style.scss";
import "../../assets/scss/main.scss";
import logo from "../../assets/images/logo.svg";
import plusIcon from "../../assets/images/plusIcon.svg";
import medalIcon from "../../assets/images/medalIcon.svg";
import angleBottom from "../../assets/images/angleBottom.svg";
import cancelIcon from "../../assets/images/cancel.png";
import fileuploadIcon from "../../assets/images/fileuploadIcon.svg";
import { useFormik } from "formik";
import { AUTH_ENDPOINT } from "../../config/endPoints";
import { errorToaster, successToaster } from "../../components/Toaster";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import { httpGet, httpPut, httpPostFormData } from "../../utils/http";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import TimePicker from "react-time-picker";
import { BASE_URL, IMAGE_URL } from "../../config/endPoints";
import DatePicker from "react-date-picker";
import {
  ADDED,
  INVALID_EMAIL,
  INVALID_MOBILE_NUMBERS,
  MANDATORY,
  SOMETHING_WENT_WRONG,
  UPDATED,
} from "../../config/const";
import Loader from "../../components/Loader";
import Cardview from "../CardView/index";
function Addprofile() {
  const [startDateValue, setStartDateValue] = useState();
  const [selectedstartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [endDateValue, setEndDateValue] = useState("");
  const [isStartPickerOpen, setIsStartPickerOpen] = useState(false);
  const [isEndPickerOpen, setIsEndPickerOpen] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [subscription, setSubscription] = useState("pro");
  const handleShow = () => setShowModal(true);
  const [showTime, setShowTime] = useState(false);
  const [faqList, setFaqList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [activeDay, setActiveDay] = useState("Sunday");
  const [startTimeValue, setStartTimeValue] = useState("10:00");
  const [endTimeValue, setEndTimeValue] = useState("10:00");
  const [imgClass, setImgClass] = useState("");
  const [locations, setLocations] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [service, setService] = useState([]);
  const [selectedService, setSlectedService] = useState("");
  const [faqupdate, setfaqUpdate] = useState({ update: false, id: "" });
  const [loading, setLoading] = useState(false);
  const childRef = useRef();
  const [availableTimeIndex, setAvailableTimeIndex] = useState(0);
  const [availableTime, setAvailableTime] = useState([
    {
      day: 'sunday',
      startTime: null,
      endTime: null,
      status: false
    },
    {
      day: 'monday',
      startTime: null,
      endTime: null,
      status: false
    },
    {
      day: 'tuesday',
      startTime: null,
      endTime: null,
      status: false
    },
    {
      day: 'wednesday',
      startTime: null,
      endTime: null,
      status: false
    },
    {
      day: 'thursday',
      startTime: null,
      endTime: null,
      status: false
    },
    {
      day: 'friday',
      startTime: null,
      endTime: null,
      status: false
    },
    {
      day: 'saturday',
      startTime: null,
      endTime: null,
      status: false
    },

  ])
  useEffect(() => {
    if (params.id) {
      getSingleData(params.id);
    }
  }, [params]);

  useEffect(() => {
    getCategory("");
    getService();
    getCity();
  }, []);

  const handleClose = () => {
    setfaqUpdate({ update: false, id: "" });
    setShowModal(false);
  };

  const timeClose = () => {
    setShowTime(false);
  };
  const timeOpen = () => {
    setShowTime(true);
  };
  const validate = (values) => {
    const errors = {};
    if (!values.title) {
      errors.title = MANDATORY;
    }

    if (subscription === ("pro" || "lite") && !values.description) {
      errors.description = MANDATORY;
    }

    if (!values.city) {
      errors.city = MANDATORY;
    }

    if (!values.email) {
      errors.email = MANDATORY;
    }
    if (!values.startDate) {
      errors.startDate = MANDATORY;
    }
    if (!values.expiredDate) {
      errors.expiredDate = MANDATORY;
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = INVALID_EMAIL;
    }
    if (!values.phone) {
      errors.phone = MANDATORY;
    } else if (values.phone) {
      var phoneno =
        /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3}|[0-9]{4})$/;
      if (!values.phone.match(phoneno)) {
        errors.phone = INVALID_MOBILE_NUMBERS;
      }
    }
    return errors;
  };

  const faqValidate = (values) => {
    const errors = {};
    if (!values.question) {
      errors.question = MANDATORY;
    }
    if (!values.answer) {
      errors.answer = MANDATORY;
    }
    return errors;
  };
  // FAQ Formik
  const faqFormik = useFormik({
    initialValues: {
      question: "",
      answer: "",
    },
    validate: faqValidate,
    onSubmit: (values) => {
      if (Object.keys(values).length && faqupdate.update) {
        let index = faqupdate.id;
        faqList[index].question = values.question;
        faqList[index].answer = values.answer;
      } else {
        let faq = [...faqList, values];
        setFaqList(faq);
      }
      handleClose();
      faqFormik.resetForm();
    },
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      vat: "",
      description: "",
      city: [],
      category: [],
      service: [],
      address: "",
      phone: "",
      email: "",
      startDate: "",
      expiredDate: "",
      profileImg: "",
      proBadge: false,
      sunday: false,
      monday: false,
      tuesday: false,
      wednesday: false,
      thrusday: false,
      friday: false,
      saturday: false,
    },
    validate,
    onSubmit: async (values) => {
      let activeDays = [
        {
          sunday: values.sunday,
          monday: values.monday,
          tuesday: values.tuesday,
          wednesday: values.wednesday,
          thrusday: values.thrusday,
          friday: values.friday,
          saturday: values.saturday,
        },
      ];
      let formData = new FormData();
      formData.append("subscription", subscription);
      formData.append("title", values.title);
      formData.append("vat", values.vat);
      formData.append("description", values.description);
      formData.append("city", JSON.stringify(values.city));
      formData.append("address", values.address);
      formData.append("phone", values.phone);
      formData.append("email", values.email);
      formData.append("category", JSON.stringify(values.category));
      formData.append("faq", JSON.stringify(faqList));
      formData.append("service", JSON.stringify(values.service));
      formData.append("startDate", values.startDate);
      formData.append("expiredDate", values.expiredDate);
      formData.append("profileImg", values.profileImg);
      formData.append("proBadge", values.proBadge);
      formData.append("availableTime", JSON.stringify(availableTime));

      if (params.id) {
        updateProfile(formData, params.id);
      } else {
        addProfile(formData);
      }
    },
  });
  //upload profile image
  const uploadProfileImg = async (event) => {
    let file = event.currentTarget.files[0];
    if (file) {
      // var sizemb = (event.currentTarget.files[0].size / (1024 * 1024)).toFixed(
      // 2
      // )
      // if (sizemb > 1) {
      //   console.log('invalid image size')
      // }
      formik.setFieldValue("profileImg", file);
      let Image1 = URL.createObjectURL(file);
      setPreviewImage(Image1);
    }
  };

  //add Profile

  const addProfile = async (formData) => {
    setLoading(true);
    let res = await httpPostFormData(`${AUTH_ENDPOINT}/profile`, formData);
    if (
      (res?.status === 200 || res?.statusText === "ok") &&
      res?.data.responseCode !== 400
    ) {
      setLoading(false);
      successToaster(ADDED);
      setTimeout(() => {
        navigate("/profile");
        toast.dismiss();
      }, 1000);
    } else {
      setLoading(false);
      errorToaster(SOMETHING_WENT_WRONG);
      setTimeout(() => {
        toast.dismiss();
      }, 1000);
    }

    if (res?.data?.responseCode === 400) {
      setLoading(false);
      errorToaster(res.data.message);
      setTimeout(() => {
        toast.dismiss();
      }, 3000);
    }
  };

  //update Profile
  const updateProfile = async (alldata, id) => {
    setLoading(true);
    let res = await httpPut(`${AUTH_ENDPOINT}/profile/${id}`, alldata);
    if (res?.status === 200) {
      setLoading(false);
      successToaster(UPDATED);
      setTimeout(() => {
        navigate("/profile");
        toast.dismiss();
      }, 1000);
    } else {
      errorToaster(SOMETHING_WENT_WRONG);
      setLoading(false);
      setTimeout(() => {
        toast.dismiss();
      }, 1000);
    }
    if (res?.data?.responseCode === 400) {
      setLoading(false);
      errorToaster(res.data.message);
      setTimeout(() => {
        toast.dismiss();
      }, 3000);
    }
  };

  //get record by id
  async function getSingleData(id) {
    setLoading(true);
    let res = await httpGet(`${AUTH_ENDPOINT}/profile/${id}`);
    setLoading(false);
    if (res.data?.responseCode === 400 || !res) {
      setLoading(false);
      navigate("/profile");
    }
    if (res?.data?.data) {
      if (res?.data?.data?.availableTime?.length > 0) {
        let data = res.data.data.availableTime
        formik.setFieldValue("sunday", data[0].status);
        formik.setFieldValue("monday", data[1].status);
        formik.setFieldValue("tuesday", data[2].status);
        formik.setFieldValue("wednesday", data[3].status);
        formik.setFieldValue("thrusday", data[4].status);
        formik.setFieldValue("friday", data[5].status);
        formik.setFieldValue("saturday", data[6].status);
        setAvailableTime(data);
        setActiveDay("Sunday");
        setStartTimeValue(data[0].startTime);
        setEndTimeValue(data[0].endTime);
      }
      if (res.data.data.startDate) {
        var start = new Date(res.data.data.startDate);
        setStartDateValue(start);
      }
      if (res.data.data.expireDate) {
        var end = new Date(res.data.data.expireDate);
        setEndDateValue(end);
      }
      setImgClass("uploadImage");
      let city = res.data.data.city[0].value;
      let label = res.data.data.city[0].value?.toUpperCase();
      setSelectedCity({ value: city, label: label, id: res.data.data.city[0].id, cityEnglish: res.data.data.city[0].cityEnglish });
      setSelectedCategory(res.data.data.category);
      setSlectedService(res.data.data.service);
      setFaqList(res.data.data.faq);
      setSelectedStartDate(res.data.data.startDate);
      setSelectedEndDate(res.data.data.expiredDate);
      setSubscription(res.data.data.subscription);
      setPreviewImage(res.data.data.image);
      formik.setFieldValue("title", res.data.data.title);
      formik.setFieldValue("vat", res.data.data.vat);
      formik.setFieldValue("description", res.data.data.description);
      formik.setFieldValue("category", res.data.data.category);
      formik.setFieldValue("city", res.data.data.city);
      formik.setFieldValue("address", res.data.data.address);
      formik.setFieldValue("phone", res.data.data.phone);
      formik.setFieldValue("email", res.data.data.email);
      formik.setFieldValue("service", res.data.data.service);
      faqFormik.setFieldValue("question", res.data.data.question);
      faqFormik.setFieldValue("answer", res.data.data.answer);
      formik.setFieldValue("startDate", res.data.data.startDate);
      formik.setFieldValue("expiredDate", res.data.data.expiredDate);
      formik.setFieldValue("profileImg", res.data.data.image);
      res.data.data.image &&
        setPreviewImage(IMAGE_URL + "profile/" + res.data.data.image);
    }
  }
  const handleCityChange = (newSelection) => {
    formik.setFieldValue("city", newSelection);
    setSelectedCity([newSelection]);
  };

  const handleCategoryChange = (newSelection) => {
    formik.setFieldValue("category", newSelection);
    setSelectedCategory(newSelection.slice(0, 5));
  };
  const handleSingleCategoryChange = (newSelection) => {
    formik.setFieldValue("category", [newSelection]);
    setSelectedCategory([newSelection].slice(0, 1));
  };

  const handleServiceChange = (newSelection) => {
    formik.setFieldValue("service", newSelection);
    setSlectedService(newSelection.slice(0, 10));
  };

  // Get Service List
  const getService = () => {
    httpGet(`${BASE_URL}/priceCatalog`).then((res) => {
      let response = res?.data?.data;
      if (response?.length > 0) {
        let arr = [];
        for (let i = 0; i < response.length; i++) {
          arr.push({
            value: response[i].serviceName
              ? response[i].serviceName.toLowerCase()
              : "ocean",
            label: response[i].serviceName
              ? response[i].serviceName.toUpperCase()
              : "Ocean",
            id: response[i]._id ? response[i]._id : "1",
          });
        }
        setService(arr);
      }
    });
  };

  // Get Category List
  const getCategory = () => {
    httpGet(`${BASE_URL}/category`).then((res) => {
      if (res?.data?.data?.length > 0) {
        let data = res?.data?.data;
        let arr = [];
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
  };

  // Update/Edit FAQ form data
  const updateFaq = (t) => {
    let data = faqList[t];
    setfaqUpdate({ update: true, id: t });
    faqFormik.setFieldValue("question", data.question);
    faqFormik.setFieldValue("answer", data.answer);
    handleShow();
  };

  // Delete FAQ
  const deleteFaq = (faq, i, event) => {
    event.stopPropagation();
    let filter = faqList.filter((word, index) => {
      return word !== faqList[i];
    });
    setFaqList(filter);
  };

  // Get city data
  const getCity = () => {
    httpGet(`${BASE_URL}/auth/location`).then((res) => {
      if (res?.data?.records?.length > 0) {
        let data = res?.data?.records;
        var activeCity = data.filter((item, i) => {
          return item?.status;
        });
        let arr = [];
        for (let i = 0; i < activeCity.length; i++) {
          arr.push({
            value: activeCity[i].cityHebrew
              ? activeCity[i].cityHebrew.toLowerCase()
              : "null",
            label: activeCity[i].cityHebrew
              ? activeCity[i].cityHebrew.toUpperCase()
              : "null",
            id: activeCity[i]._id ? activeCity[i]._id : "1",
            cityEnglish: activeCity[i].city ? activeCity[i].city : 'null'
          });
        }
        setLocations(arr);
      }
    });
  };

  const startDateChange = (val) => {
    let d = new Date(val);
    var formateDate = d.setDate(d.getDate() + 1);
    let formatedDates = new Date(formateDate).toISOString().split("T")[0];
    setStartDateValue(val);
    setSelectedStartDate(formatedDates);
    formik.setFieldValue("startDate", formatedDates);
  };

  const endDateChange = (val) => {
    let d = new Date(val);
    var formateDate = d.setDate(d.getDate() + 1);
    let formatedDates = new Date(formateDate).toISOString().split("T")[0];
    setEndDateValue(val);
    setSelectedEndDate(formatedDates);
    formik.setFieldValue("expiredDate", formatedDates);
  };
  const downloadCard = () => {
    var cardData = {
      title: formik.values.title ? formik.values.title : null,
      vat: formik.values.vat ? formik.values.vat : null,
      category:
        formik.values.category.length > 0 ? formik.values.category : null,
      file: formik.values.profileImg ? formik.values.profileImg : 'null'
    };
    const isValue = Object.values(cardData).some((value) => {
      if (value === null) {
        return true;
      }
    });
     if (isValue) {
      errorToaster("Title, VAT, Category fields are Mandatory");
    } else {
      childRef.current.downloadCard(cardData);
    }
  };

  const saveTime = () => {
    timeClose();
  }

  const changeStartTime = (time) => {
    availableTime[availableTimeIndex].startTime = time

  }
  const changeEndTime = (time) => {
    availableTime[availableTimeIndex].endTime = time

  }



  return (
    <>
      <Cardview ref={childRef} />
      {loading && <Loader />}
      <div className="main-content">
        <div className="add-profile">
          <div className="profile-type">
            <Button
              className={subscription === "free" ? "active" : ""}
              onClick={() => {
                setSubscription("free");
              }}
            >
              FREE
            </Button>
            <Button
              className={subscription === "lite" ? "active" : ""}
              onClick={() => {
                setSubscription("lite");
              }}
            >
              LITE
            </Button>
            <Button
              className={subscription === "pro" ? "active" : ""}
              onClick={() => {
                setSubscription("pro");
              }}
            >
              PRO
            </Button>
            {subscription === "pro" && (
              <div className="badge-block">
                <img src={medalIcon} alt="" />
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={(event) => {
                      formik.setFieldValue("proBadge", event.target.checked);
                    }}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            )}
            {subscription === "pro" && (
              <div className="badge-block businessCard">
                <img src={logo} alt="" />
                <Button
                  className="downloadBtn"
                  onClick={() => {
                    downloadCard();
                  }}
                >
                  Download
                </Button>
              </div>
            )}
          </div>
          <div className="profile-form">
            <Form onSubmit={formik.handleSubmit}>
              <Row>
                <Col lg={7}>
                  <Form.Group className="form-group" controlId="title">
                    <label className="labelTextext">Title</label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.title}
                    />
                    {formik.errors.title && formik.touched.title ? (
                      <div className="text-danger">{formik.errors.title}</div>
                    ) : null}
                  </Form.Group>
                  {formik.errors.userName ? (
                    <div className="text-danger">{formik.errors.userName}</div>
                  ) : null}

                  <Form.Group className="form-group" controlId="vat">
                    <label className="labelTextext">VAT</label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.vat}
                    />
                    {formik.errors.vat && formik.touched.vat ? (
                      <div className="text-danger">{formik.errors.vat}</div>
                    ) : null}
                  </Form.Group>
                  {subscription === "lite" && (
                    <Form.Group className="form-group" controlId="description">
                      <label className="labelTextext">Description</label>
                      <Form.Control
                        as="textarea"
                        placeholder=""
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.description}
                      />
                      {formik.errors.description &&
                        formik.touched.description ? (
                        <div className="text-danger">
                          {formik.errors.description}
                        </div>
                      ) : null}
                    </Form.Group>
                  )}

                  {subscription === "pro" && (
                    <Form.Group className="form-group" controlId="description">
                      <label className="labelTextext">Description</label>
                      <Form.Control
                        as="textarea"
                        placeholder=""
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.description}
                      />
                      {formik.errors.description &&
                        formik.touched.description ? (
                        <div className="text-danger">
                          {formik.errors.description}
                        </div>
                      ) : null}
                    </Form.Group>
                  )}

                  <Form.Group
                    className="form-group controlField"
                    controlId="city"
                  >
                    <div className="form-controlWrap">
                      <label className="labelTextext">City &nbsp;&nbsp;</label>

                      <div className="dropdownWrapper">
                        <Select
                          onChange={handleCityChange}
                          value={selectedCity}
                          defaultValue={selectedCity}
                          name="city"
                          options={locations}
                          className="basic-single"
                          classNamePrefix="select"
                          placeholder=""
                        />
                      </div>
                    </div>
                  </Form.Group>

                  <Form.Group className="form-group" controlId="address">
                    <label className="labelTextext">Address</label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.address}
                    />
                  </Form.Group>
                  <Form.Group className="form-group" controlId="phone">
                    <label className="labelTextext">Phone</label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.phone}
                    />
                    {formik.errors.phone && formik.touched.phone ? (
                      <div className="text-danger">{formik.errors.phone}</div>
                    ) : null}
                  </Form.Group>
                  <Form.Group className="form-group" controlId="email">
                    <label className="labelTextext">Email</label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                    />
                    {formik.errors.email && formik.touched.email ? (
                      <div className="text-danger">{formik.errors.email}</div>
                    ) : null}
                  </Form.Group>
                  <Form.Group
                    className="form-group controlField"
                    controlId="category"
                  >
                    <div className="form-controlWrap">
                      <label className="labelTextext">Category &nbsp;</label>

                      {subscription === "free" && (
                        <div className="dropdownWrapper">
                          <Select
                            onChange={handleSingleCategoryChange}
                            value={selectedCategory}
                            defaultValue={selectedCategory}
                            name="category"
                            options={category}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder=""
                          />
                        </div>
                      )}

                      {(subscription === "lite" || subscription === "pro") && (
                        <div className="dropdownWrapper">
                          <Select
                            onChange={handleCategoryChange}
                            value={selectedCategory}
                            defaultValue={selectedCategory}
                            name="category"
                            options={category}
                            className="basic-single"
                            classNamePrefix="select"
                            isMulti
                            placeholder=""
                          />
                        </div>
                      )}
                    </div>
                    {formik.errors.city && formik.touched.city ? (
                      <div className="text-danger">{formik.errors.city}</div>
                    ) : null}
                  </Form.Group>

                  {subscription === "pro" && (
                    <Form.Group
                      className="form-group controlField"
                      controlId="city"
                    >
                      <div className="form-controlWrap">
                        <label className="labelTextext">FAQ &nbsp;</label>
                        <div className="dropdownWrapper">
                          <div className="category-list">
                            <div className="faqQuestion d-flex">
                              {faqList.length > 0 &&
                                faqList?.slice(0, 5).map((faq, i) => {
                                  return (
                                    <span
                                      className="faq"
                                      key={i}
                                      onClick={() => updateFaq(i)}
                                    >
                                      {i + 1}
                                      <Button
                                        onClick={(event) => {
                                          deleteFaq(faq, i, event);
                                        }}
                                      >
                                        <svg
                                          height="14"
                                          width="14"
                                          viewBox="0 0 20 20"
                                          aria-hidden="true"
                                          focusable="false"
                                          className="css-tj5bde-Svg"
                                        >
                                          <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path>
                                        </svg>
                                      </Button>
                                    </span>
                                  );
                                })}
                            </div>

                            <Button
                              onClick={faqList.length < 5 && handleShow}
                              className="addCategory"
                            >
                              <img src={plusIcon} alt="" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      {formik.errors.city && formik.touched.city ? (
                        <div className="text-danger">{formik.errors.city}</div>
                      ) : null}
                    </Form.Group>
                  )}

                  {subscription === "pro" && (
                    <Form.Group
                      className="form-group controlField"
                      controlId="city"
                    >
                      <div className="form-controlWrap">
                        <label className="labelTextext">Service &nbsp;</label>

                        <div className="dropdownWrapper">
                          <Select
                            onChange={handleServiceChange}
                            name="category"
                            options={service}
                            className="basic-single"
                            classNamePrefix="select"
                            isMulti
                            value={selectedService}
                            defaultInputValue={selectedService}
                            placeholder=""
                          />
                        </div>
                      </div>
                      {formik.errors.city && formik.touched.city ? (
                        <div className="text-danger">{formik.errors.city}</div>
                      ) : null}
                    </Form.Group>
                  )}
                </Col>
                <Col lg={5}>
                  <div className="row">
                    <div className="col-6">
                      <Form.Group className="form-group" controlId="startDate">
                        <div className="bg">
                          <Button
                            className="datePick"
                            onClick={() =>
                              setIsStartPickerOpen(!isStartPickerOpen)
                            }
                          >
                            {selectedstartDate.length > 0
                              ? selectedstartDate.split("-").reverse().join("-")
                              : "Start Date"}
                          </Button>
                          <DatePicker
                            isOpen={isStartPickerOpen}
                            onChange={startDateChange}
                            onCalendarClose={() => setIsStartPickerOpen(false)}
                            value={startDateValue}
                            TextFieldComponent={() => null}
                          />
                        </div>
                      </Form.Group>
                      {formik.errors.startDate && formik.touched.startDate ? (
                        <div className="text-danger">
                          {formik.errors.startDate}
                        </div>
                      ) : null}
                    </div>
                    <div className="col-6">
                      <Form.Group
                        className="form-group"
                        controlId="expiredDate"
                      >
                        <div className="bg">
                          <Button
                            className="datePick"
                            onClick={() => setIsEndPickerOpen(!isEndPickerOpen)}
                          >
                            {selectedEndDate?.length > 0
                              ? selectedEndDate.split("-").reverse().join("-")
                              : "Expiry Date"}
                          </Button>
                          <DatePicker
                            isOpen={isEndPickerOpen}
                            onChange={endDateChange}
                            onCalendarClose={() => setIsEndPickerOpen(false)}
                            value={endDateValue}
                            minDate={startDateValue}
                            TextFieldComponent={() => null}
                          />
                        </div>
                      </Form.Group>
                      {formik.errors.expiredDate &&
                        formik.touched.expiredDate ? (
                        <div className="text-danger">
                          {formik.errors.expiredDate}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="image-upload-block">
                    <div className="image-upload">
                      <div className={`fileupload ${imgClass}`}>
                        {previewImage && (
                          <>
                            <button
                              type="button"
                              className="crossBtn"
                              onClick={() => {
                                setPreviewImage("");
                                formik.setFieldValue("profileImg", "");
                              }}
                            >
                              <img src={cancelIcon} alt="" />
                            </button>

                            <div className="imgUpload">
                              <img
                                className="profilePreviewImg"
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
                            uploadProfileImg(e);
                            setImgClass("uploadImage");
                          }}
                          accept="image/*"
                        />

                        {!previewImage && (
                          <Button className="folder-upload">
                            <img src={fileuploadIcon} alt="" />
                            <p>Upload</p>
                            <input
                              type="file"
                              label="Example file input"
                              onChange={(e) => {
                                uploadProfileImg(e);
                                setImgClass("uploadImage");
                              }}
                              accept="image/*"
                            />
                          </Button>
                        )}
                      </div>
                    </div>

                    {(subscription === "pro" || subscription === "lite") && (
                      <Form.Group className="form-group">
                        <div className="category-list weeklyhours">
                          <div className="mb-3">
                            <Button
                              onClick={() => timeOpen()}
                              className="dayWrap"
                            >
                              Hours
                              <img src={angleBottom} alt="angle" />
                            </Button>
                          </div>
                          <div className="d-flex justify-content-between mt-2 mb-2 ml-4 mr-4">
                            <h3>Sunday</h3>
                            <label className="switch">
                              <input
                                type="checkbox"
                                onChange={(event) => {
                                  formik.setFieldValue(
                                    "sunday",
                                    event.target.checked
                                  );
                                  availableTime[0].status = event.target.checked
                                }}
                                checked={formik.values.sunday}
                              />
                              <span className="slider"></span>
                            </label>
                          </div>
                          <div className="d-flex justify-content-between mt-2 mb-2 ml-4 mr-4">
                            <h3>Monday</h3>
                            <label className="switch">
                              <input
                                type="checkbox"
                                onChange={(event) => {
                                  formik.setFieldValue(
                                    "monday",
                                    event.target.checked
                                  );
                                  availableTime[1].status = event.target.checked
                                }
                                }
                                checked={formik.values.monday}
                              />
                              <span className="slider"></span>
                            </label>
                          </div>
                          <div className="d-flex justify-content-between mt-2 mb-2 ml-4 mr-4">
                            <h3>Tuesday</h3>
                            <label className="switch">
                              <input
                                type="checkbox"
                                onChange={(event) => {
                                  formik.setFieldValue(
                                    "tuesday",
                                    event.target.checked
                                  );
                                  availableTime[2].status = event.target.checked
                                }}
                                checked={formik.values.tuesday}
                              />
                              <span className="slider"></span>
                            </label>
                          </div>
                          <div className="d-flex justify-content-between mt-2 mb-2 ml-4 mr-4">
                            <h3>Wednesday</h3>
                            <label className="switch">
                              <input
                                type="checkbox"
                                onChange={(event) => {
                                  formik.setFieldValue(
                                    "wednesday",
                                    event.target.checked
                                  );
                                  availableTime[3].status = event.target.checked

                                }

                                }
                                checked={formik.values.wednesday}
                              />
                              <span className="slider"></span>
                            </label>
                          </div>
                          <div className="d-flex justify-content-between mt-2 mb-2 ml-4 mr-4">
                            <h3>Thursday</h3>
                            <label className="switch">
                              <input
                                type="checkbox"
                                onChange={(event) => {
                                  formik.setFieldValue(
                                    "thrusday",
                                    event.target.checked
                                  );
                                  availableTime[4].status = event.target.checked
                                }}
                                checked={formik.values.thrusday}
                              />
                              <span className="slider"></span>
                            </label>
                          </div>
                          <div className="d-flex justify-content-between mt-2 mb-2 ml-4 mr-4">
                            <h3>Friday</h3>
                            <label className="switch">
                              <input
                                type="checkbox"
                                onChange={(event) => {
                                  formik.setFieldValue(
                                    "friday",
                                    event.target.checked
                                  );
                                  availableTime[5].status = event.target.checked

                                }

                                }
                                checked={formik.values.friday}
                              />
                              <span className="slider"></span>
                            </label>
                          </div>
                          <div className="d-flex justify-content-between mt-2 mb-2 ml-4 mr-4">
                            <h3>Saturday</h3>
                            <label className="switch">
                              <input
                                type="checkbox"
                                onChange={(event) => {
                                  formik.setFieldValue(
                                    "saturday",
                                    event.target.checked
                                  );
                                  availableTime[6].status = event.target.checked


                                }
                                }
                                checked={formik.values.saturday}
                              />
                              <span className="slider"></span>
                            </label>
                          </div>
                        </div>
                      </Form.Group>
                    )}
                    <Form.Group>
                      <div className="saveWrap">
                        {params.id ? (
                          <Button type="submit" className="save-submit">
                            Update
                          </Button>
                        ) : (
                          <Button type="submit" className="save-submit">
                            Save
                          </Button>
                        )}
                      </div>
                    </Form.Group>
                  </div>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </div>

      {/* Modal Faq HTML Start */}
      <Modal show={showModal} onHide={handleClose} className="faq-modal">
        <Form onSubmit={faqFormik.handleSubmit}>
          <Modal.Body>
            <Form.Group className="form-group" controlId="question">
              <Form.Control
                type="text"
                placeholder="Question"
                onChange={faqFormik.handleChange}
                onBlur={faqFormik.handleBlur}
                value={faqFormik.values.question}
              />
              {faqFormik.errors.question && faqFormik.touched.question ? (
                <div className="text-danger">{faqFormik.errors.question}</div>
              ) : null}

            </Form.Group>
            <Form.Group className="form-group" controlId="answer">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Answer"
                onChange={faqFormik.handleChange}
                onBlur={faqFormik.handleBlur}
                value={faqFormik.values.answer}
              />
              {faqFormik.errors.answer && faqFormik.touched.answer ? (
                <div className="text-danger">{faqFormik.errors.answer}</div>
              ) : null}


            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="submit"
              className="save"
              variant="primary" /*  onClick={handleClose} */
            // disabled

            >
              {" "}
              {faqupdate.update ? "Update" : "Save"}{" "}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal show={showTime} onHide={timeClose} className="weekly-modal">
        <form>
          <Modal.Body>
            <Form.Group className="form-group" controlId="category">
              <div className="weeklyName">
                <ul>
                  <li
                    className={activeDay === "Sunday" ? "active" : "dayWrap"}
                    onClick={() => {
                      setActiveDay("Sunday");
                      setAvailableTimeIndex(0);



                    }}
                  >
                    S
                  </li>
                  <li
                    className={activeDay === "Monday" ? "active" : "dayWrap"}
                    onClick={() => {
                      setActiveDay("Monday");
                      setAvailableTimeIndex(1);
                    }}
                  >
                    M
                  </li>
                  <li
                    className={activeDay === "Tuesday" ? "active" : "dayWrap"}
                    onClick={() => {
                      setActiveDay("Tuesday");
                      setAvailableTimeIndex(2);
                    }}
                  >
                    T
                  </li>
                  <li
                    className={activeDay === "Wednesday" ? "active" : "dayWrap"}
                    onClick={() => {
                      setActiveDay("Wednesday");
                      setAvailableTimeIndex(3);

                    }}
                  >
                    W
                  </li>
                  <li
                    className={activeDay === "Thursday" ? "active" : "dayWrap"}
                    onClick={() => {
                      setActiveDay("Thursday");
                      setAvailableTimeIndex(4);

                    }}
                  >
                    T
                  </li>
                  <li
                    className={activeDay === "Friday" ? "active" : "dayWrap"}
                    onClick={() => {
                      setActiveDay("Friday");
                      setAvailableTimeIndex(5);

                    }}
                  >
                    F
                  </li>
                  <li
                    className={activeDay === "Saturday" ? "active" : "dayWrap"}
                    onClick={() => {
                      setActiveDay("Saturday");
                      setAvailableTimeIndex(6);

                    }}
                  >
                    S
                  </li>
                </ul>
              </div>
            </Form.Group>
            <Form.Group className="mt-5 mb-5">
              <div className="row">
                <div className="col-6">
                  <div className="hourlyTime">
                    <TimePicker
                      onChange={changeStartTime}
                      value={startTimeValue}
                      locale="sv-sv"
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="hourlyTime">
                    <TimePicker
                      onChange={changeEndTime}
                      value={endTimeValue}
                      locale="sv-sv"
                    />
                  </div>
                </div>
              </div>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button className="save" variant="primary" onClick={saveTime}>
              {" "}
              Save
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

export default Addprofile;
