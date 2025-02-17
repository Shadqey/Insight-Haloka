import React from 'react';
import '../../static/css/font.css';
import '../../static/css/Button.css';
import '../../static/css/card.css'; 
import '../../static/css/Footer.css';
import { AiOutlineCopyright } from 'react-icons/ai';

const Footer = () => {
  return (
    <footer className="footer">
      <p>
        Copyright
      <span><AiOutlineCopyright /></span>
      {'2023 Propensiw | Haloka Grup Indonesia'}
      </p>
    </footer>
  );
};

export default Footer;