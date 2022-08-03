import './App.css';
import React, { useEffect, useState, Fragment } from "react";
import squirrelImg from './assets/rinkeby_squirrels.gif';
import { ethers } from 'ethers';
import contract from './contracts/NFTCollectible.json';
import Footer from './components/Footer';
import Header from './components/Header';

// Constants
const OPENSEA_LINK = 'https://testnets.opensea.io/0x4833c2fb6f00787c7f5f60a7f1a8ad9e191648c8';
//const MEDIUM_LINK = 'https://medium.com/scrappy-squirrels';
const contractAddress = "0x4701Eb501c13c7958B977c7616295a09EF0F22f7";
const abi = contract.abi;
const MAX_TOTAL_MINT_COUNT = 50;

/*const EthereumMainNetworkChainId = "0x1";
const RopstenTestNetworkChainId = "0x3";
const RinkebyTestNetworkChainId = "0x4";
const GoerliTestNetworkChainId = "0x5";
const KovanTestNetworkChainId = "0x2a";*/

let ifWon = false;

const App = () => {

  const [currentAccount, setCurrentAccount] = useState(null);
  const [metamaskError, setMetamaskError] = useState(null);
  const [mineStatus, setMineStatus] = useState(null);
  /* ミント数を保存するために使用する状態変数を定義 */
  const [totalMintCount, setTotalMintCount] = useState("");
  //const [hideStatus, setHideStatus] = useState(false);
  //const [resultMessage, setResultMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!")
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });
    const network = await ethereum.request({ method: 'eth_chainId' });

    /*let chainId = await ethereum.request({ method: "eth_chainId" });
    console.log("Connected to chain " + chainId);
    switch( chainId ){
      case EthereumMainNetworkChainId: 
            alert("You are connected to the Ethereum Main Network! Could you please connect to the Rinkeby Test Network?");
            break;
      case RopstenTestNetworkChainId: 
            alert("You are connected to the Ropsten Test Network! Could you please connect to the Rinkeby Test Network?");
            break;
      case RinkebyTestNetworkChainId: 
            console.log("You are connected to the Rinkeby Test Network!");
            break;
      case GoerliTestNetworkChainId: 
            alert("You are connected to the Goerli Test Network! Could you please connect to the Rinkeby Test Network?");
            break;
      case KovanTestNetworkChainId: 
            alert("You are connected to the Kovan Test Network! Could you please connect to the Rinkeby Test Network?");
            break;
      default:
            alert("You are not connected to the Rinkeby Test Network! Could you please connect to the Rinkeby Test Network?");
            break;
    }*/

    if (accounts.length !== 0 && network.toString() === '0x13881') {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setMetamaskError(false);
      setCurrentAccount(account);
      //setupEventListener();

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(contractAddress, abi, signer);

      /* コントラクトからgetTokenIdsメソッドを呼び出す */
      let _tokenIds = await connectedContract.getTokenIds();
      setTotalMintCount( _tokenIds.toNumber() );
      console.log("checkIfWalletIsConnected setTotalMintCount!  ", _tokenIds.toNumber() );
      
      //let statement = await connectedContract.getMessage();
      //setResultMessage( statement );

    } else {
      setMetamaskError(true);
      console.log("No authorized account found");
    }

  }

  const connectWallet = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    /*if (window.ethereum.networkVersion !== RinkebyTestNetworkChainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${Number(4).toString(16)}` }]
          });
        } catch (err) {
            // This error code indicates that the chain has not been added to MetaMask
          if (err.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainName: 'Rinkeby',
                  chainId: `0x${Number(4).toString(16)}`,
                  nativeCurrency: { name: 'Rinkeby Ether', decimals: 18, symbol: 'RIN' },
                  rpcUrls: ["https://rinkeby.infura.io/v3/"],
                  blockExplorerUrls: ["https://rinkeby.etherscan.io"]
                }
              ]
            });
          }
        }
      }*/

    try {
      const network = await ethereum.request({ method: 'eth_chainId' });

      if (network.toString() === '0x13881') {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        console.log("Found an account! Address: ", accounts[0]);
        setMetamaskError(null);
        setCurrentAccount(accounts[0]);

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(contractAddress, abi, signer);

        /* コントラクトからgetTokenIdsメソッドを呼び出す */
        let _tokenIds = await connectedContract.getTokenIds();
        setTotalMintCount( _tokenIds.toNumber() );
        console.log("connectWallet setTotalMintCount!  ", _tokenIds.toNumber() );

        //let statement = await connectedContract.getMessage();
        //setResultMessage( statement );

      }

      else {
        setMetamaskError(true);
      }

    } catch (err) {
      console.log(err)
    }
  }

  const mintNFT = async () => {
    const { ethereum } = window;
    const network = await ethereum.request({ method: 'eth_chainId' });

    if (network.toString() === '0x13881') {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Found an account! Address: ", accounts[0]);
      setMetamaskError(null);
      setCurrentAccount(accounts[0]);


    let amount = document.getElementById('formbox');
    console.log('amount.value', amount.value);
    let amountNumber = Number(amount.value);
    if( amountNumber === 1 || amountNumber === 2 || amountNumber === 3 ){
      

      if( totalMintCount + amountNumber > MAX_TOTAL_MINT_COUNT ){
        if( totalMintCount === MAX_TOTAL_MINT_COUNT ){
          alert("SOLD OUT!");
        }
        else{
          let am = ( totalMintCount + amountNumber ) - MAX_TOTAL_MINT_COUNT;
          alert("あと" + am + "個までなら作れます。");
        }
      }else if( totalMintCount + amountNumber < MAX_TOTAL_MINT_COUNT ){

      

        try {

          setMineStatus('mining');

          //const { ethereum } = window;

          if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const nftContract = new ethers.Contract(contractAddress, abi, signer);

            console.log("Initialize payment");
            let num = 0.03 * amountNumber;
            let numString = num.toString();
            //let nftTxn = await nftContract.mintNFTs(amount.value, { value: ethers.utils.parseEther(numString) });
            let nftTxn = await nftContract.mintNFTs(amount.value, { gasLimit: 1600000, value: ethers.utils.parseEther(numString) });

            console.log("Mining... please wait");
            await nftTxn.wait();

            console.log(`Mined, see transaction: ${nftTxn.hash}`);
            setMineStatus('success');

          } else {
            setMineStatus('error');
            console.log("Ethereum object does not exist");
          }

        } catch (err) {
          setMineStatus('error');
          console.log(err);
        }
      }
    }
    else{
      alert("Please input a number 1, 2 or 3!");
    }
    }
  }

  //ページがロードされるごとに実行される処理
  useEffect(() => {
    checkWalletIsConnected();

    if (window.ethereum) {
      window.ethereum.on('chainChanged', (_chainId) => window.location.reload());
    }
  },[])

  useEffect(() => {
    let nftCollectibleContract;

    const onNewTotalMintCount = (tokenId) => {
      console.log("useEffect NewTotalMintCount", tokenId.toNumber());
      const tokenIdCleaned = tokenId.toNumber();
      setTotalMintCount(tokenIdCleaned);
    };

    const onResultMessage = (mes) => {
      console.log("useEffect ResultMessage", mes);
      //const mesCleaned = mes;
      //setResultMessage(mesCleaned);
      if(mes === "You won!"){ifWon = true;}
      else if(mes === "You lost!"){ifWon = false;}
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
    };

    /* NewWaveイベントがコントラクトから発信されたときに、情報をを受け取ります */
    if (window.ethereum) {

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const nftCollectibleContract = new ethers.Contract(contractAddress, abi, signer);

      nftCollectibleContract.on("NewTotalMintCount", onNewTotalMintCount);
      nftCollectibleContract.on("NewSendMessage", onResultMessage);
    }
    /*メモリリークを防ぐために、NewWaveのイベントを解除します*/
    return () => {
      if (nftCollectibleContract) {
        nftCollectibleContract.off("NewTotalMintCount", onNewTotalMintCount);
        nftCollectibleContract.off("NewSendMessage", onResultMessage);
      }
    };
  }, []);

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  const renderNoBornUI = () => {
    if( !totalMintCount ){
      return (
        <p>Not a single 🐿️ has been born yet.</p>
      );
    }
    else{
      if( totalMintCount === 1 ){
        return (
          <p>{totalMintCount} 🐿️ has been born so far.（MAX{MAX_TOTAL_MINT_COUNT}）</p>
        );
      }
      else if( totalMintCount === MAX_TOTAL_MINT_COUNT ){
        
      }
      else{
        return (
          <p>{totalMintCount} 🐿️s have been born so far.（MAX{MAX_TOTAL_MINT_COUNT}）</p>
        );
      }
    }
  }

  const renderMintUI = () => {
    return (
      <div>
        {renderNoBornUI()}
        <p>{ totalMintCount !== MAX_TOTAL_MINT_COUNT ? 'How many 🐿️ NFTs do you need?' : 'Sold Out!'}</p>
        {/*<p>Please input a number.</p>*/} 
        <div className='input-group mb-4'>
          <input
            type="number"
            className="formbox"
            id="formbox"
            placeholder='1-3(MAX)🐿️'
            min = '1'
            max = '3'
            required
          />
        </div>
        <button onClick={mintNFT} className="cta-button connect-wallet-button" >
          Mint a Polygon Squirrel NFT
        </button >
        <p>期間限定でお代が無料になる抽選を実施しております。</p>
        <p>同時購入数が増えると当選確率もUP!</p>
        <p>1個購入30%、2個同時購入40%、3個同時購入50%</p>
      </div>
    );
  }

  return (
    <Fragment>
      {metamaskError && <div className='metamask-error'>Metamask から Polygon Testnet に接続してください!</div>}
      <div className="App">
        <div className="container">
          <Header opensea={OPENSEA_LINK} />
          <div className="header-container">
            <div className='banner-img'>
              <img src={squirrelImg} alt="Polygon Squirrels" />
            </div>
            {currentAccount && mineStatus !== 'mining' && renderMintUI()}
            {/*{hideStatus === true && <p>Sold Out!</p>}*/}
            {!currentAccount && !mineStatus && renderNotConnectedContainer()}
            <div className='mine-submission'>
              {mineStatus === 'success' && <div className={mineStatus}>
                <p>NFT minting successful!</p>
                <p className='success-link'>
                  <a href={`https://testnets.opensea.io/${currentAccount}/`} target='_blank' rel='noreferrer'>Click here</a>
                  <span> to view your NFT on OpenSea.</span>
                </p>
              </div>}
              {mineStatus === 'mining' && <div className={mineStatus}>
                <div className='loader' />
                <span>何が出るかな♪何が出るかな♪</span>
              </div>}
              {mineStatus === 'error' && <div className={mineStatus}>
                <p>Transaction failed. Make sure you have at least 0.01 MATIC in your Metamask wallet and try again.</p>
              </div>}
              {/* 当選の通知 */}
              {currentAccount && ifWon && (
                <div id="toast" className={showToast ? "show" : ""}>
                  <div id="desc">{`ご当選おめでとうございます!今回のお代は無料です！`}</div>
                </div>
              )}
              {currentAccount && !ifWon && (
                <div id="toast" className={showToast ? "show" : ""}>
                  <div id="desc">{`残念!同時購入数が増えると確率も増えますよ!`}</div>
                </div>
              )}
            </div>
          </div>
          {currentAccount && <div className='show-user-address'>
          <p>
            Your address being connected: &nbsp;
            <br/>
                <span>
                    <a className='user-address' target='_blank' href='noreferrer'>
                        {currentAccount}
                    </a>
                </span>
          </p>
          </div>}
          <Footer address={contractAddress} />
        </div>
      </div>
    </Fragment>
  );
};

export default App;