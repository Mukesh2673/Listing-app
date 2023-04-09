import { Button, Modal } from "react-bootstrap";
import "./style.scss";
import gold from "../../assets/images/gold.svg";
import silver from "../../assets/images/silver.svg";
import bronze from "../../assets/images/bronze.svg";
import worker from "../../assets/images/worker.png";
import barLogo from "../../assets/images/probar.svg";
import "react-toastify/dist/ReactToastify.css";
import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import * as htmlToImage from "html-to-image";
import Loader from "../../components/Loader";
import { QRCode } from "react-qrcode-logo";
const Cardview = forwardRef((props, ref) => {
  const [activeLoader, setActiveLoader] = useState(false);
  const [profileData, setProfileData] = useState("");
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [profileImage, setProfileImage] = useState('null')
  const domEl = useRef(null);
  const downloadImage = async () => {
    setActiveLoader(true);
    const dataUrl = await htmlToImage.toPng(domEl.current);
    const link = document.createElement("a");
    link.download = "html-to-img.png";
    link.href = dataUrl;
    link.click();
    setActiveLoader(false);
    setShowDownloadModal(false);
  };
  useImperativeHandle(ref, () => ({
    downloadCard(data) {
      if (data.file !== 'null') {
        let Image1 = URL.createObjectURL(data.file);
        setProfileImage(Image1)
      }
     setProfileData(data);
      setShowDownloadModal(true);
    },
  }));
  const closeDownload = () => {
    setShowDownloadModal(false);
  };
  return (
    <>
      {activeLoader && <Loader />}
      <Modal
        show={showDownloadModal}
        onHide={closeDownload}
        className="image_view_modal"
      >
        <div className="cardView_Wrap">
          <div className="card_outer">
            <div className="cartd_inner" id="domEl" ref={domEl} ss>
              <div className="main_card">
                <div className="upperblock upperblock_wrap">
                  <div className="d-flex">
                    <div className="medals">
                      <ul>
                        <li>
                          <a href="#">
                            <img src={gold} alt="gold image" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src={silver} alt="silver" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src={bronze} alt="bronze" />
                          </a>
                        </li>
                      </ul>
                    </div>
                    {profileImage !== 'null'
                      ? <div className="dynamicImg">
                        <img src={profileImage} alt="" />
                      </div>
                      : <div className="view_img"><img src={worker} alt="" /> </div>}





                  </div>
                  <h3 className="text-center">
                    {profileData.title
                      ? profileData.title
                      : "יוסי כהן מיזוג ואלקטרוניקה"}
                  </h3>
                  <ul className="categories d-flex justify-content-center">
                    {profileData?.category?.map((number, i) => (
                      <li key={i}>{number.value}</li>
                    ))}
                  </ul>
                  <div className="d-flex align-items-center justify-content-center">
                    <h4>{profileData.vat ? profileData.vat : 98403}</h4>
                  </div>
                </div>
                <div className="text-center">
                  <button className="rank_btn">
                    <img src={gold} alt="" />
                    דרגו אותי
                  </button>
                  <div className="img_wrap">
                    {/* <img src={barImg} alt=""/> */}
                    <div
                      style={{
                        height: "auto",
                        margin: "0 auto",
                        maxWidth: "100%",
                        width: "100%",
                      }}
                    >
                    
                      {<QRCode
                            //logoImage={'https://listing-upload.s3.us-east-2.amazonaws.com/static/logo.svg'} //need to add s3 image url here
                            logoImage={barLogo}
                            fgColor="#6db0e1"
                            logoWidth={58}
                            logoHeight={50} 
                            qrStyle="dots"
                            eyeRadius={8}
                            size={285}
                            //removeQrCodeBehindLogo={true}
                            value={`http://pcard.pro`}
                          />}
                    </div>
                    <button className="pcardBtn">www.PCARD.com</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal.Footer>
          <Button className="save" variant="primary" onClick={downloadImage}>
            Download
          </Button>
          <Button className="save" variant="primary" onClick={closeDownload}>
            {" "}
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
});

export default Cardview;
