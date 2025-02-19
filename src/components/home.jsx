// src/pages/Home.jsx
import React from "react";
import Album from "../components/albums";
import Cart from "../components/Cart";
import LeftSection from "../components/leftsection";
import Navbar from "./navbar";
import FavoriteSongs from "./favorites";
import NewReleasesSlider from "./newRelease";
import Bollywood from "./Bollywood_&_Indian";

const Home = () => {
  return (
    <div className=" h-screen">
     
      <div className="flex flex-col ">
      {/* <div style={{ backgroundColor: "#121212", minHeight: "100vh" }}>
      <NewReleasesSlider />
    </div> */}
       <NewReleasesSlider/>
        <Album />
        <Bollywood/>
        <Cart />
      </div>
    </div>
  );
};

export default Home;
