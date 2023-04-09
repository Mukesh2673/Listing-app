import Spinner from "react-bootstrap/Spinner";
import "./style.scss";
function Loader() {
  return (
    <>
      <div className="loaderWrap">
        <Spinner animation="border" className="loader" />
      </div>
    </>
  );
}

export default Loader;
