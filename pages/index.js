import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait();
      getBalance();
    }
  };

  const initUser = () => {
   
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    
    if (!account) {
      return (
        <button onClick={connectAccount}>
          Click here to connect with MetaMask Wallet
        </button>
      );
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <button onClick={deposit}>Transfer 1 ETH</button>
        <button onClick={withdraw}>Withdraw 1 ETH</button>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to BlockChain ATM</h1>
        <p>A secure and decentralized banking experience</p>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          background-image: url("data:image/jpeg;base64,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");
          background-repeat: no-repeat;
          background-size: cover;
          text-align: center;
          max-width: 800px;
          margin: 40px auto;
          padding: 20px;
          background-color: #f7f7f7;
          border: 5px solid;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          border-radius: 30px;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; 
        }
        header {
          background-color: #0a0202;
          color: white;
          padding: 20px;
          text-align: center;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
        header h1 {
          font-size: 36px; 
          margin-bottom: 10px;
          letter-spacing: 1px;
        }
        header p {
          font-size: 18px;
          color: white; 
          margin-bottom: 0;
        }
        button {
          background-color: #4caf50;
          color: white;
          padding: 12px 24px; 
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-size: 16px; 
          transition: background-color 0.3s ease; 
        }
        button:hover {
          background-color: #45a049;
        }
      `}</style>
    </main>
  );
}
