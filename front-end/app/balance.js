"use client"
import React from "react";
import Web3 from "web3";
import { useState,useEffect } from "react";
import contract from "./beacon";


const ContractBalance = () => {

  //get the contract address
  const contractAddress = '0xC798816c57720C44ed79cf322be2ab6Cf2430EbD' 

  const [contractBalance , setContractBalance] = useState('')

  //get the balance of smart contract
  const getBalance = async() => {

    const web3 = new Web3(window.ethereum);
     
    try{

        const balance = await web3.eth.getBalance(contractAddress)
        const balanceEther = web3.utils.fromWei(balance,'ether')
        setContractBalance(balanceEther.toString())

    }catch(e){
        alert(e.message)
    }
        
}

useEffect(() => {
     
    getBalance();
    const intervalId = setInterval(() => {
      getBalance();
    }, 10000); // 10 seconds in milliseconds

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);

  }, []); 




  return (

      <div>
        <p className="text-red-800">Contract Balance :<strong>{contractBalance}</strong> ETH</p>
      </div>
    )
};

export default ContractBalance