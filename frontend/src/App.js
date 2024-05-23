import "./App.css";
import { useEffect, useState,} from "react"
import WalletConnect from "./components/WalletConnect";
import { ethers } from "ethers"
import {requestRandomness} from "./functions/requestRandomness";
import {querySecret} from "./functions/querySecret";


function App() {
  const [chainId, setChainId] = useState("")

  useEffect(() => {
    const handleChainChanged = (_chainId) => {
      // Convert _chainId to a number since it's usually hexadecimal
      const numericChainId = parseInt(_chainId, 16)
      setChainId(numericChainId.toString())
      console.log("Network changed to chain ID:", numericChainId)
    }

    window.ethereum.on("chainChanged", handleChainChanged)

    // Fetch initial chain ID
    const fetchChainId = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any")
      const { chainId } = await provider.getNetwork()
      setChainId(chainId.toString())
      console.log("Current Chain ID:", chainId)
    }

    fetchChainId()

    // Cleanup function to remove listener
    return () => {
      window.ethereum.removeListener("chainChanged", handleChainChanged)
    }
  }, [])

  let handleSubmit = async () => {
    try {
      // First, await the completion of requestRandomness
      const random = await requestRandomness(chainId);
      // Once requestRandomness completes, querySecret is executed
      const query = await querySecret();
      alert("Your random number is: " + query)

    } catch (error) {
      // Catch and log any errors that occur during the process
      console.error("An error occurred during the process:", error);
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-800">
    <div >
      <WalletConnect />
      <button
          className="flex justify-center items-center mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => handleSubmit(chainId)}
        >Request Randomness</button>
    </div>
  </div>
 
  );
}

export default App;
