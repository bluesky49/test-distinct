import React from "react";
import "./style.css";

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="footer-text">Copyright © {new Date().getFullYear()} By Ming Wang</div>
      <div className="footer-text">All rights reserved</div>
    </footer>
  )
}
export default Footer;
