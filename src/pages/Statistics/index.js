import React from 'react'
import { Nav, TabContainer, Form, Button, Row, Col } from 'react-bootstrap';
import './style.scss';
import '../../assets/scss/main.scss';
import goldMedalIcon from '../../assets/images/goldMedalIcon.svg';
import silverMedalIcon from '../../assets/images/silverMedalIcon.svg';
import bronzeMedalIcon from '../../assets/images/bronzeMedalIcon.svg';
import { useState, useEffect } from 'react';
import exportIcon from '../../assets/images/exportIcon.svg';
import { BASE_URL } from '../../config/endPoints'
import { httpGet } from '../../utils/http'
import Loader from '../../components/Loader';
// import DropdownItem from 'react-bootstrap/esm/DropdownItem';

function Statistic() {
  const [loading,setLoading]=useState(false);

  const [totalRecords,setTotalRecords]=useState({})
  useEffect(() => {
    getData();
  }, [])


  function getData() {
    httpGet(`${BASE_URL}/auth/statistics`).then(res => {
      setLoading(true)
      if (res?.data?.totalRecord) {
      setLoading(false) 
        let data = res?.data?.totalRecord
        setTotalRecords(data);
       
        }
    })
  }




  return (
    
    <div className='main-content'>
      {loading && <Loader/>} 
      <div className='main-content-inner'>
        <div className='statistics-wrap'>
          <TabContainer id="left-tabs-example" defaultActiveKey="first">
            <div className='tabs-btn justify-content-between'>
              
              <div className='tab-search'>
                <Nav variant="pills">
                  <Nav.Item>
                    <Nav.Link eventKey="first">All</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="second">Day</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="third">Week</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="fourth">month</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="fifth">Dates</Nav.Link>
                  </Nav.Item>
                </Nav>
                
              </div>
              <Button 
                // onClick={locationsOpen}
                 className='new-btn'>
                  <img src={exportIcon} alt=""/>
                 </Button>
            </div>
            <div className='stat-content'>
              <Row>
                <Col lg={8}>
                  <Row>
                    <Col md={6} className="pr-0">
                      <div className='stat-block'>
                        <div className='heading-block d-flex'>
                          <h2>PROFILES</h2>
                          <h2 className='price'>{totalRecords.profile?.total ?totalRecords.profile?.total:0 }</h2>
                        </div>
                        <div className='content-block'>
                          <span className='pro-badge'>PRO</span>
                          <h2>{totalRecords.profile?.pro ?totalRecords.profile?.pro:0 }</h2>
                        </div>
                      </div>
                      <div className='stat-block'>
                        <div className='content-block'>
                          <span className='pro-badge'>LITE</span>
                          <h2>{totalRecords.profile?.lite ?totalRecords.profile?.lite:0 }</h2>
                        </div>
                      </div>
                      <div className='stat-block'>
                        <div className='content-block'>
                          <span className='pro-badge'>FREE</span>
                          <h2>{totalRecords.profile?.free ?totalRecords.profile?.free:0 }</h2>
                        </div>
                      </div>
                    </Col>
                    <Col md={6} className="pl-2">
                      <div className='stat-block'>
                        <div className='heading-block d-flex'>
                          <h2>CLICKS</h2>
                          <h2 className='price'>100,000</h2>
                        </div>
                        <div className='content-block'>
                          <span className='pro-badge'>PRO</span>
                          <h2>60,000</h2>
                        </div>
                      </div>
                      <div className='stat-block'>
                        <div className='content-block'>
                          <span className='pro-badge'>LITE</span>
                          <h2>40,000</h2>
                        </div>
                      </div>
                      <div className='stat-block'>
                        <div className='content-block'>
                          <span className='pro-badge'>LITE</span>
                          <h2>40,000</h2>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  {/* <Row>
                    <Col md={6}>
                      <div className='stat-block'>
                        <div className='heading-block d-flex'>
                          <h2>CATEGORIES</h2>
                          <h2 className='price'>130</h2>
                        </div>
                      </div>
                      <div className='stat-block'>
                        <div className='heading-block d-flex'>
                          <h2>PRO BADGE</h2>
                          <h2 className='price'>130</h2>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className='stat-block'>
                        <div className='heading-block d-flex'>
                          <h2>POSTS</h2>
                          <h2 className='price'>130</h2>
                        </div>
                      </div>
                      <div className='stat-block'>
                        <div className='heading-block d-flex'>
                          <h2>CITIES</h2>
                          <h2 className='price'>130</h2>
                        </div>
                      </div>
                    </Col>
                  </Row> */}
                </Col>
                <Col lg={4} className="pl-0 feedbackBlock">
                  <div className='stat-block'>
                    <div className='heading-block d-flex'>
                      <h2>FEEDBACKS</h2>
                      <h2 className='price'>100,000</h2>
                    </div>
                    <div className='content-block medal-block'>
                      <Row className='medalOuter'>
                      <Col xs={4} className="pr-2 mb-4">
                          <div className='medal-wrap'>
                            <div className='d-flex medalText align-items-center'>
                                <img src={goldMedalIcon} alt="goldMedalIcon" />
                                <div className='medal-price'>
                                  <h3>100,000</h3>
                                </div>
                            </div>
                          </div>
                        </Col>
                        <Col xs={4} className="pl-0 pr-0  mb-4">
                          <div className='medal-wrap'>
                            <div className='d-flex medalText align-items-center'>
                                <img src={goldMedalIcon} alt="goldMedalIcon" />
                                <div className='medal-price'>
                                  <h3>100,000</h3>
                                </div>
                            </div>
                          </div>
                        </Col>
                        <Col xs={4} className="pl-2  mb-4">
                          <div className='medal-wrap'>
                            <div className='d-flex medalText align-items-center'>
                                <img src={goldMedalIcon} alt="goldMedalIcon" />
                                <div className='medal-price'>
                                  <h3>100,000</h3>
                                </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <div className='medal-wrap'>
                        <Row>
                          <Col xs={6}>
                            <div className='heading-block d-flex'>
                              <h2>REVIEWS</h2>
                            </div>
                            <div className='reviewText'>
                              <h3>130</h3>
                            </div>
                          </Col>
                          <Col xs={6}>
                            <div className='heading-block d-flex'>
                              <h2>WAITING</h2>
                            </div>
                            <div className='reviewText'>
                              <h3>130</h3>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <div className='medal-wrap'>
                        <Row>
                          <Col xs={6}>
                            <div className='heading-block d-flex'>
                              <h2>CATEGORIES</h2>
                            </div>
                            <div className='reviewText'>
                              <h3>{totalRecords.category ?totalRecords.category:0 }</h3>
                            </div>
                          </Col>
                          <Col xs={6}>
                            <div className='heading-block d-flex'>
                              <h2>CITY</h2>
                            </div>
                            <div className='reviewText'>
                              <h3>{totalRecords.location ?totalRecords.location:0 }</h3>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <div className='medal-wrap'>
                        <Row>
                          <Col xs={6}>
                            <div className='heading-block d-flex'>
                              <h2>POSTS</h2>
                            </div>
                            <div className='reviewText'>
                              <h3>{totalRecords.post ?totalRecords.post:0 }</h3>
                            </div>
                          </Col>
                          <Col xs={6}>
                            <div className='heading-block d-flex'>
                              <h2>SITE SESSION</h2>
                            </div>
                            <div className='reviewText'>
                              <h3>130</h3>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <div className='medal-wrap'>
                        <Row>
                          <Col xs={6}>
                            <div className='heading-block d-flex'>
                              <h2>PRO BAGE</h2>
                            </div>
                            <div className='reviewText'>
                              <h3>130</h3>
                            </div>
                          </Col>
                          <Col xs={6}>
                            <div className='heading-block d-flex'>
                              <h2>EXPIERD USERS</h2>
                            </div>
                            <div className='reviewText'>
                              <h3>130</h3>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      {/* <div className='medal-wrap'>
                        <Row>
                          <Col xs={5}>
                            <img src={bronzeMedalIcon} alt="bronzeMedalIcon" />
                          </Col>
                          <Col xs={7}>
                            <div className='medal-price'>
                              <h3>100,000</h3>
                            </div>
                          </Col>
                        </Row>
                      </div> */}
                    </div>
                  </div>
                  {/* <div className='stat-block expired-block'>
                    <div className='heading-block d-flex'>
                      <h2>EXPIERD</h2>
                      <h2 className='price'>30</h2>
                    </div>
                    <div className='content-block medal-block'>
                      <div className='medal-wrap'>
                        <Row>
                          <Col xs={4}>
                            <span className='expired-badge'>PRO</span>
                          </Col>
                          <Col xs={4}>
                            <div className='medal-price justify-content-center'>
                              <h3>30</h3>
                            </div>
                          </Col>
                          <Col xs={4}>
                            <div className='view-wrap'>
                              <Button className='view-btn'>View</Button>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <div className='medal-wrap'>
                        <Row>
                          <Col xs={4}>
                            <span className='expired-badge'>LITE</span>
                          </Col>
                          <Col xs={4}>
                            <div className='medal-price justify-content-center'>
                              <h3>100</h3>
                            </div>
                          </Col>
                          <Col xs={4}>
                            <div className='view-wrap'>
                              <Button className='view-btn'>View</Button>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div> */}
                  {/* <div className='stat-block'>
                    <div className='heading-block d-flex'>
                      <h2>REVIEWS</h2>
                      <h2 className='price'>30</h2>
                    </div>
                    <div className='content-block medal-block'>
                      <div className='medal-wrap'>
                        <Row>
                          <Col xs={4}>
                            <span className='post-badge'>POSTED</span>
                          </Col>
                          <Col xs={4}>
                            <div className='medal-price justify-content-center'>
                              <h3>30</h3>
                            </div>
                          </Col>
                          <Col xs={4}>
                            <div className='view-wrap'>
                              <Button className='view-btn'>View</Button>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <div className='medal-wrap'>
                        <Row>
                          <Col xs={4}>
                            <span className='wait-badge'>WAITING</span>
                          </Col>
                          <Col xs={4}>
                            <div className='medal-price justify-content-center'>
                              <h3>100</h3>
                            </div>
                          </Col>
                          <Col xs={4}>
                            <div className='view-wrap'>
                              <Button className='view-btn'>View</Button>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                  <div className='stat-block title-wrp'>
                    <div className='heading-block d-flex'>
                        <h2>TITLE</h2>
                        <h2 className='price'>130</h2>
                      </div>
                   </div> */}
                   {/* <div className='stat-block'>
                    <div className=''>
                        <Button className='main-export'>Export</Button>
                      </div>
                   </div> */}
                </Col>
              </Row>
            </div>
          </TabContainer>
        </div>
      </div>
    </div>
  )
}

export default Statistic