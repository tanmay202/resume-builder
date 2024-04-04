import React from "react";
import {RingLoader} from "react-spinners"
const MainSpinner = () => {
    return <div className=" w-screen h-screen flex items-center justify-center" >
      <RingLoader
  color="rgba(245, 44, 44, 1)"
  speedMultiplier={0.5} size={80}
/>
  </div>;
};

export default MainSpinner;
