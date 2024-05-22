import { SecretNetworkClient } from "secretjs"

export const querySecret = async () => {
    const secretjs = new SecretNetworkClient({
      url: "https://lcd.testnet.secretsaturn.net",
      chainId: "pulsar-3",
    })

    try {
      const query_tx = await secretjs.query.compute.queryContract({
        contract_address: "secret1aawazragzd7zlmn3ym09wuryhxn54x2846gd2v",
        code_hash: "4f4054beb60d13c1fceece7be3ea7c349e46b70c1fbbf2517f713180d6033c84",
        query: { retrieve_random: {} },
      })

      let random = await query_tx.random.toString()
      console.log("Your random number is:", random)
      return random
    
    } catch (error) {
      console.error("Error fetching random number:", error)

    }
  }