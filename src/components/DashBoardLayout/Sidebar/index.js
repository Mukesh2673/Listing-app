import React, { useContext } from "react";
import { Nav, Accordion } from "react-bootstrap";
import "./style.scss";
// import logo from "../../../assets/images/logo.svg";
import arrowDown from "../../../assets/images/arrowDown.png";
import { AppContext } from "../../../App";
import { Link, NavLink } from "react-router-dom";

function Sidebar() {
  const { activeMenu } = useContext(AppContext);

  return (
    activeMenu && (
      <div className="main-sidebar">
        {/* <div className="logo-wrap">
          <Nav.Link as={Link} to="/profile">
            <img src={logo} alt="Logo" />
          </Nav.Link>
        </div> */}
         <Nav defaultActiveKey="/profile" className="flex-column">
        <Accordion defaultActiveKey="0">
         
           
            <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <Nav.Link eventKey="link-1" className="manage">
                    Manage <img src={arrowDown} alt="arrowDown" />
                  </Nav.Link>
              </Accordion.Header>
              <Accordion.Body>
                <ul>
                  <Nav.Link as={NavLink} to="/profile" eventKey="link-2">
                    Profile
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/pricecatalog" eventKey="link-3">
                    Price Catalog
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/city" eventKey="link-4">
                    City
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/category" eventKey="link-5">
                    Category
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/post" eventKey="link-6">
                    Post
                  </Nav.Link>
                </ul>
              </Accordion.Body>
              </Accordion.Item>
              <Nav.Link
                as={Link}
                className="review"
                eventKey="link-8"
                to="/review"
              >
                Reviews
              </Nav.Link>
              <Nav.Link
                as={Link}
                className="statistic"
                eventKey="link-9"
                to="/statistics"
              >
                Statistics
              </Nav.Link>
              <Accordion.Item eventKey="2">
              <Accordion.Header>
                <Nav.Link eventKey="link-11" className="manage message">
                  Message <img src={arrowDown} alt="arrowDown" />
                </Nav.Link>
              </Accordion.Header>
              <Accordion.Body>
                <ul>
                  <Nav.Link as={Link} className="statistic contact" eventKey="link-10" to="/contact" >
                    Contacts
                  </Nav.Link>
                </ul>
              </Accordion.Body> 
              </Accordion.Item>
        </Accordion>
            </Nav>
          
        
      </div>
    )
  );
}
export default Sidebar;
