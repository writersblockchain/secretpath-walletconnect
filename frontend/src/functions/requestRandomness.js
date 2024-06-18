import { ecdh, chacha20_poly1305_seal } from "@solar-republic/neutrino"
import { arrayify, hexlify, SigningKey, keccak256, recoverPublicKey, computeAddress } from "ethers/lib/utils"
import { bytes, bytes_to_base64, json_to_bytes, sha256, concat, text_to_bytes, base64_to_bytes } from "@blake.regalia/belt"
import abi from "../config/abi.js";
import { testnet, mainnet } from "../config/contracts"
import { ethers } from "ethers"

export const requestRandomness = async (chainId) => {

    const routing_contract = "secret1dfzs2sjqdm33sqk2duahqpp7whnh62u4lrn9jj"
    const routing_code_hash = "3cb5c235600ddf3d024e4d9b96d5e2c7bfafbbdea5f6c1866aa968a59cc27bfa"
    const iface = new ethers.utils.Interface(abi)
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any")

    const [myAddress] = await provider.send("eth_requestAccounts", [])

    const wallet = ethers.Wallet.createRandom()
    const userPrivateKeyBytes = arrayify(wallet.privateKey)
    const userPublicKey = new SigningKey(wallet.privateKey).compressedPublicKey
    const userPublicKeyBytes = arrayify(userPublicKey)
    const gatewayPublicKey = "A20KrD7xDmkFXpNMqJn1CLpRaDLcdKpO1NdBBS7VpWh3"
    const gatewayPublicKeyBytes = base64_to_bytes(gatewayPublicKey)

    const sharedKey = await sha256(ecdh(userPrivateKeyBytes, gatewayPublicKeyBytes))

    const callbackSelector = iface.getSighash(iface.getFunction("upgradeHandler"))

    console.log("callbackSelector: ", callbackSelector)

    const callbackGasLimit = 90000
    //the function name of the function that is called on the private contract
    const handle = "request_random"

    //data are the calldata/parameters that are passed into the contract
    const data = JSON.stringify({ address: myAddress })

    let publicClientAddress

    if (chainId === "1") {
      publicClientAddress = mainnet.publicClientAddressEthereumMainnet
    }
    if (chainId === "56") {
      publicClientAddress = mainnet.publicClientAddressBinanceSmartChainMainnet
    }
    if (chainId === "137") {
      publicClientAddress = mainnet.publicClientAddressPolygonMainnet
    }
    if (chainId === "10") {
      publicClientAddress = mainnet.publicClientAddressOptimismMainnet
    }
    if (chainId === "42161") {
      publicClientAddress = mainnet.publicClientAddressArbitrumOneMainnet
    }
    if (chainId === "43114") {
      publicClientAddress = mainnet.publicClientAddressAvalanceCChainMainnet
    }
    if (chainId === "8453") {
      publicClientAddress = mainnet.publicClientAddressBaseMainnet
    }

    if (chainId === "59144") {
      publicClientAddress = mainnet.publicClientAddressLineaMainnet
    }

    if (chainId === "534352") {
      publicClientAddress = mainnet.publicClientAddressScrollMainnet
    }

    if (chainId === "1088") {
      publicClientAddress = mainnet.publicClientAddressMetisMainnet
    }
    if (chainId === "50") {
      publicClientAddress = mainnet.publicClientAddressXDCMainnet
    }
    if (chainId === "1313161554") {
      publicClientAddress = mainnet.publicClientAddressNearAuroraMainnet
    }
    if (chainId === "1135") {
      publicClientAddress = mainnet.publicClientAddressLiskMainnet
    }
    if (chainId === "2016") {
      publicClientAddress = mainnet.publicClientAddressMainnetzMainnet
    }
    if (chainId === "1285") {
      publicClientAddress = mainnet.publicClientAddressMoonriverMainnet
    }
    if (chainId === "1284") {
      publicClientAddress = mainnet.publicClientAddressMoonbeamMainnet
    }
    if (chainId === "1116") {
      publicClientAddress = mainnet.publicClientAddressCoreMainnet
    }
    if (chainId === "5000") {
      publicClientAddress = mainnet.publicClientAddressMantleMainnet
    }

    if (chainId === "11155111") {
      publicClientAddress = testnet.publicClientAddressSepoliaTestnet
    }
    if (chainId === "534351") {
      publicClientAddress = testnet.publicClientAddressScrollTestnet
    }
    if (chainId === "80002") {
      publicClientAddress = testnet.publicClientAddressPolygonAmoyTestnet
    }
    if (chainId === "11155420") {
      publicClientAddress = testnet.publicClientAddressOptimismSepoliaTestnet
    }
    if (chainId === "421614") {
      publicClientAddress = testnet.publicClientAddressArbitrumSepoliaTestnet
    }
    if (chainId === "84532") {
      publicClientAddress = testnet.publicClientAddressBaseSepoliaTestnet
    }

    if (chainId === "80085") {
      publicClientAddress = testnet.publicClientAddressBerachainTestnet
    }

    if (chainId === "128123") {
      publicClientAddress = testnet.publicClientAddressEtherlinkTestnet
    }
    if (chainId === "59902") {
      publicClientAddress = testnet.publicClientAddressMetisSepoliaTestnet
    }
    if (chainId === "1313161555") {
      publicClientAddress = testnet.publicClientAddressNearAuroraTestnet
    }
    if (chainId === "59141") {
      publicClientAddress = testnet.publicClientAddressLineaSepoliaTestnet
    }
    if (chainId === "51") {
      publicClientAddress = testnet.publicClientAddressXDCApothemTestnet
    }
    if (chainId === "4202") {
      publicClientAddress = testnet.publicClientAddressLiskSepoliaTestnet
    }
    if (chainId === "1802203764") {
      publicClientAddress = testnet.publicClientAddressKakarotTestnet
    }
    if (chainId === "9768") {
      publicClientAddress = testnet.publicClientAddressMainnetzTestnet
    }
    if (chainId === "1287") {
      publicClientAddress = testnet.publicClientAddressMoonbaseAlphaTestnet
    }
    if (chainId === "8008135") {
      publicClientAddress = testnet.publicClientAddressFhenixHeliumTestnet
    }
    if (chainId === "1115") {
      publicClientAddress = testnet.publicClientAddressCoreTestnet
    }
    if (chainId === "5003") {
      publicClientAddress = testnet.publicClientAddressMantleTestnet
    }



    const callbackAddress = publicClientAddress.toLowerCase()
    console.log("callback address: ", callbackAddress)

    // Payload construction
    const payload = {
      data: data,
      routing_info: routing_contract,
      routing_code_hash: routing_code_hash,
      user_address: myAddress,
      user_key: bytes_to_base64(userPublicKeyBytes),
      callback_address: bytes_to_base64(arrayify(callbackAddress)),
      callback_selector: bytes_to_base64(arrayify(callbackSelector)),
      callback_gas_limit: callbackGasLimit,
    }

    const payloadJson = JSON.stringify(payload)
    const plaintext = json_to_bytes(payload)
    const nonce = crypto.getRandomValues(bytes(12))

    const [ciphertextClient, tagClient] = chacha20_poly1305_seal(sharedKey, nonce, plaintext)
    const ciphertext = concat([ciphertextClient, tagClient])
    const ciphertextHash = keccak256(ciphertext)
    const payloadHash = keccak256(concat([text_to_bytes("\x19Ethereum Signed Message:\n32"), arrayify(ciphertextHash)]))
    const msgParams = ciphertextHash

    const params = [myAddress, msgParams]
    const method = "personal_sign"
    const payloadSignature = await provider.send(method, params)
    const user_pubkey = recoverPublicKey(payloadHash, payloadSignature)

    const _info = {
      user_key: hexlify(userPublicKeyBytes),
      user_pubkey: user_pubkey,
      routing_code_hash: routing_code_hash,
      task_destination_network: "pulsar-3",
      handle: handle,
      nonce: hexlify(nonce),
      payload: hexlify(ciphertext),
      payload_signature: payloadSignature,
      callback_gas_limit: callbackGasLimit,
    }

    const functionData = iface.encodeFunctionData("send", [payloadHash, myAddress, routing_contract, _info])

    const gasFee = await provider.getGasPrice();
    let amountOfGas;

    let my_gas = 150000; 
    if (chainId === "4202") {
      amountOfGas = gasFee.mul(callbackGasLimit).mul(100000).div(2);
    } 

    if (chainId === "128123") {
      amountOfGas = gasFee.mul(callbackGasLimit).mul(1000).div(2);
      my_gas = 15000000;
    }

    if (chainId === "1287") {
      amountOfGas = gasFee.mul(callbackGasLimit).mul(1000).div(2);
      my_gas = 15000000;
    }
    
    else {
      amountOfGas = gasFee.mul(callbackGasLimit).mul(3).div(2);
    }

    const tx_params = {
      gas: hexlify(my_gas),
      to: publicClientAddress,
      from: myAddress,
      value: hexlify(amountOfGas),
      data: functionData,
    };

    const txHash = await provider.send("eth_sendTransaction", [tx_params])
    console.log("txHash: ", txHash)
    
  }