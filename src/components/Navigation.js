import { ethers } from 'ethers';

const Navigation = ({ account, setAccount }) => {
    
    const connectHandler = async () => {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = ethers.utils.getAddress(accounts[0]);
            setAccount(account);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <nav>

            <div className='nav__brand'>
                <h1>R Kart</h1>
            </div>

            <input
                type="text"
                className="nav__search"
            />
            
            {account ? (
                <button
                    type="button"
                    className='nav__connect'
                >            
                    {/* Shows first 6 and last 4 digits of account */}
                    {account.slice(0, 6) + '...' + account.slice(38, 42)}
                </button>

            ) : (

                <button
                    type="button"
                    className='nav__connect'
                    onClick={connectHandler}
                >
                    Connect Wallet
                </button>

            )}
            
            <br></br>            
            <p className='label'><strong>Smart Contracts Deployed on Sepolia Ethereum Test Net</strong></p>                                    
            <br></br>
            <br></br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <ul className='nav__links'>
                <li> <a href="#Gadgets">Gadgets</a> </li>
                <li> <a href="#Toys">Toys</a> </li>
                <li> <a href="#Fashionwear">Fashionwear</a> </li>
                
            </ul>

        </nav>
    );
}

export default Navigation;
