import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className=" w-full h-4 flex items-center justify-between border-t border-black  "  style={{ paddingTop: "12px" }} >
      <div
        style={{
            
          color: "red",
          fontWeight: "bold",
          fontSize: "15px",
          cursor: "pointer",
        }}
      >
        Made By<span style={{ color: "black" }}> Tanmay</span>
      </div>

          <div className="flex  items-center justify-center gap-6 ">
              <Link to={"/"} className="text-blue-700 text-sm">
                  Home
              </Link> 
              
              <Link to={"/"} className="text-blue-700 text-sm">
                  Contact Me
              </Link>  
              
      </div>
    </div>
  );
};

export default Footer;
