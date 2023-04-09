import { Button, Form } from 'react-bootstrap';
import './style.scss';
import gold from '../../assets/images/gold.svg';
import silver from '../../assets/images/silver.svg';
import bronze from '../../assets/images/bronze.svg';
import worker from '../../assets/images/worker.png';
import barImg from '../../assets/images/barImg.png';
import 'react-toastify/dist/ReactToastify.css'
import React, { useState } from 'react'

const Cardview = () => {

  return (
    <>
      <div className='cardView_Wrap'>
          <div className='card_outer'>
            <div className='cartd_inner'>
              <div className='main_card'>
                  <div className='upperblock upperblock_wrap'>
                    <div className='d-flex'>
                        <div className='medals'>
                            <ul>
                              <li><a href="#"><img src={gold} alt="gold image"/></a></li>
                              <li><a href="#"><img src={silver} alt="silver"/></a></li>
                              <li><a href="#"><img src={bronze} alt="bronze"/></a></li>
                            </ul>
                        </div>
                        <div className='view_img'>
                          <img src={worker} alt=""/>
                        </div>
                    </div>
                      <h3 className='text-center'>יוסי כהן מיזוג ואלקטרוניקה</h3>
                      <ul className='categories d-flex justify-content-center'>
                        <li>אלקטרוניקה</li>
                        <li>חשמל</li>
                        <li>מיזוג</li>
                      </ul>
                      <h4>98403</h4>
                  </div>
                  <div className='text-center'>
                      <button className='rank_btn'><img src={gold} alt=""/>דרגו אותי</button>
                      <div className='img_wrap'>
                        <img src={barImg} alt=""/>
                      </div>
                  </div>

              </div>
            </div>
          </div>
      </div>
    </>
  )
}

export default Cardview
