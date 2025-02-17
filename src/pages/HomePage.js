import React, { useContext, useRef } from 'react';
import AuthContext from '../authorization/AuthContext';
import "@fontsource/aileron";
import "@fontsource/lato";
import '../static/css/font.css';
import '../static/css/Button.css';
import '../static/css/card.css'; 
import '../static/css/HomePage.css';
import { useNavigate } from 'react-router-dom';
import landPic from '../assets/img/landing.png';

const HomePage = () => {
  let { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const handleNavigateToClients = () => {
    navigate('/client');
  };

  const handleNavigateToServices = () => {
    navigate('/product');
  };

  const handleNavigateToReports = () => {
    navigate('/reports');
  };

  const handleGetStarted = () => {
    menuRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className='content-home'>
      <div className='d-flex landing-page'>
        <img className='img-landpage' src={landPic} alt="CRM" style={{width:'45%'}}/>
        <div className='space' style={{width:'10%'}}>
        </div>
        <div className='justify-content-start'>
          <h1 style={{color:'white', textAlign:'left', marginTop:130}} className='h1-welcome'>Welcome,</h1>
          <h1 style={{color:'white', textAlign:'left', marginBottom:50}} className='h1-user'>{user.name}!</h1>
          <p style={{fontSize:"0.9rem", color:'black', textAlign:'left', width:'85%', opacity:'40%', marginBottom:70}}>Increase efficiency and productivity with automated workflows. Stay organized and deliver exceptional customer service at every touchpoint.</p>
          <button className="card-button" onClick={handleGetStarted} style={{padding:'10px 50px'}}>Get Started</button>
        </div>
      </div>
      <div className='d-flex justify-content-center gradient-page' id='menu' ref={menuRef}>
      <div className='intro'>
        <div className='i-center'>
          <div className='i-name'>
            <h1 style={{fontSize:'3rem'}}>Insight Haloka</h1>
          </div>
          <div className="cards">
            <div className="card-home" onClick={handleNavigateToClients}>
              <h3>Clients</h3>
              <p>Manage your client information and interactions with ease.</p>
              <button className="card-button">
                Go to Clients
              </button>
            </div>
            
          {user.group.find(role=>['Manager','Partnership'].includes(role)) ? 
            <div className="card-home" onClick={handleNavigateToServices}>
              <h3>Services</h3>
              <p>Offer a wide range of services and keep track of services.</p>
              <button className="card-button">Go to Services</button>
            </div>
          : null}
            
            
          {user.group.find(role=>['Manager','Partnership'].includes(role)) ?
            <div className="card-home" onClick={handleNavigateToReports}>
              <h3>Reports</h3>
              <p>Generate comprehensive reports to gain valuable insights.</p>
              <button className="card-button">Go to Reports</button>
            </div>
          : null}
            
          </div>
        </div>
      </div>
      </div>
      
    </div>
  );
};

export default HomePage;
