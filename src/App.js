//Hooks
import { useEffect, useState } from 'react' 
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Section from './components/Section'
import Product from './components/Product'

// ABIs
import RKart from './abis/RKart.json'

// Config
import config from './config.json'
import itemsData from './items.json';


function App() {

  const [provider, setProvider] = useState(null);
  const [rkart, setRkart] = useState(null);
    
  const [account, setAccount] = useState(null);

  const [item, setItem] = useState({});
  const [toggle, setToggle] = useState(false);

  const [gadgets, setGadgets] = useState(null);
  const [toys, setToys] = useState(null);
  const [fashionwear, setFashionwear] = useState(null);
  
  // On Product Image click , toggle 
  const togglePop = (item) => {
    setItem(item);
    toggle ? setToggle(false) : setToggle(true);
  }

  const loadBlockchainData = async () => {
    // Load Provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    
    try {
      // Load Networks
      const network = await provider.getNetwork();

      //Connect to JS Version of smart contract  ( Get ID from json file)
      const rkart = new ethers.Contract(config[network.chainId].rkart.address, RKart, provider);
      setRkart(rkart);
    
      // Load Products
      const items = [];

      for (var i = 0; i < 9; i++) {
        const item = await rkart.items(i + 1);
        items.push(item);
      }
      
      // Filter categories
      const gadgets = items.filter((item) => item.category === 'gadgets');
      const toys = items.filter((item) => item.category === 'toys');
      const fashionwear = items.filter((item) => item.category === 'fashionwear');
      
      // Set Categories
      setGadgets(gadgets);
      setToys(toys);
      setFashionwear(fashionwear);
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    if (window.ethereum) {
      loadBlockchainData()
    }
  }, [])
  

  return (
    <div>
      
      {/* Account set on Navigation */}
      <Navigation account={account} setAccount={setAccount} />

      <h2>Welcome to RKart!</h2>

      {gadgets && toys && fashionwear && (
        <>
        <Section title={"Gadgets"} items={gadgets} togglePop={togglePop} />
        <Section title={"Toys"} items={toys} togglePop={togglePop} />
        <Section title={"Fashionwear"} items={fashionwear} togglePop={togglePop} />
        </>
      )}
      
      {/* Toggle Products */}
      {toggle && rkart && account && provider && (
        <Product 
          item={item} 
          provider={provider} 
          account={account} 
          rkart={rkart} 
          togglePop={togglePop} 
        />
      )}  
      <div className="footer__copyright">
          <small>&copy; RAKESH KAMBLE. All Rights Reserved.</small>
        </div> 
    </div>

    
  );
  
}

export default App;
