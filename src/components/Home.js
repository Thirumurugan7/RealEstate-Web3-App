import { ethers } from "ethers";
import { useEffect, useState } from "react";

import close from "../assets/close.svg";

const Home = ({ home, provider, escrow, togglePop }) => {
  return (
    <div className="home">
      <div className="home__details">
        <div className="home__image">
          <img src={home.image} alt="home" />
        </div>
      </div>
    </div>
  );
};

export default Home;
