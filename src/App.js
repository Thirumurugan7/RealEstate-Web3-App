import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Components
import Navigation from "./components/Navigation";
import Search from "./components/Search";
import Home from "./components/Home";

// ABIs
import RealEstate from "./abis/RealEstate.json";
import Escrow from "./abis/Escrow.json";

// Config
import config from "./config.json";

function App() {
  const [provider, setProvider] = useState(null);
  const [escrow, setEscrow] = useState(null);
  const [account, setAccount] = useState(null);
  const [homes, setHomes] = useState(null);

  const loadBlockchainData = async () => {
    console.log(config);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    const network = await provider.getNetwork();
    const realEstate = new ethers.Contract(
      config[network.chainId].realEstate.address,
      RealEstate,
      provider
    );
    console.log(realEstate);
    console.log(config[network.chainId].realEstate.address);
    console.log(config[network.chainId].escrow.address);
    // console.log(new ethers.Contract(config[network.chainId].escrow.address));
    //
    const totalSupply = await realEstate.totalSupply();

    console.log(totalSupply.toString());
    const homes = [];

    for (var i = 1; i <= totalSupply; i++) {
      const uri = await realEstate.tokenURI(i);
      const response = await fetch(uri);
      const metadata = await response.json();
      homes.push(metadata);
      console.log(homes);
    }
    setHomes(homes);
    // console.log(homes);

    const escrow = new ethers.Contract(
      config[network.chainId].escrow.address,
      Escrow,
      provider
    );
    setEscrow(escrow);
    console.log(totalSupply);
    window.ethereum.on("accountChanged", async () => {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = ethers.utils.getAddress(accounts[0]);
      setAccount(account);
    });
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const toggleProp = (home) => {
    console.log(home);
  };

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <Search />
      <div className="cards__section">
        <h3>Homes for you</h3>
        <hr />

        <div className="cards">
          {homes.map((home, index) => (
            <div className="card" key={index}>
              <div className="card__image">
                <img src={home.image} alt="Home" />
              </div>
              <div className="card__info">
                <h4>{home.attributes[0].value} ETH</h4>
                <p>
                  <strong>{home.attributes[2].value}</strong> bds |
                  <strong>{home.attributes[3].value}</strong> ba |
                  <strong>{home.attributes[4].value}</strong> sqft
                </p>
                <p>{home.address}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
