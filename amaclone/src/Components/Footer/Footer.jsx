// Footer.js
import React from "react";
import "./Footer.css";
import { useSelector } from "react-redux";

const Footer = ({ scrollToTop }) => {

  const {url} = useSelector((store) => store.url);
  console.log(`${url}/api/cart/add`);

 
  
  return (
    <div>
      <div className="backTotop" onClick={scrollToTop}>
        Back to top
      </div>
      <div className="footer">
        <div className="footer_content">
          <div className="footer_content_left">
            <ul>
              <li>Get to know us</li>
              <li>About us</li>
              <li>Careers</li>
              <li>Press Releases</li>
              <li>Amazon Cares</li>
              <li>Gift a Smile</li>
            </ul>
          </div>
          <div className="footer_content_right">
            <ul>
              <li>Connect with us</li>
              <li>Facebook</li>
              <li>Twitter</li>
              <li>Instagram</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
