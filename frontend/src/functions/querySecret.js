import { SecretNetworkClient } from "secretjs"

export const querySecret = async () => {
    const secretjs = new SecretNetworkClient({
      url: "https://lcd.testnet.secretsaturn.net",
      chainId: "pulsar-3",
    })

    try {
      const query_tx = await secretjs.query.compute.queryContract({
        contract_address: "secret1dfzs2sjqdm33sqk2duahqpp7whnh62u4lrn9jj",
        code_hash: "3cb5c235600ddf3d024e4d9b96d5e2c7bfafbbdea5f6c1866aa968a59cc27bfa",
        query: { retrieve_random: {} },
      })

      let random = await query_tx.random.toString()
      console.log("Your random number is:", random)
      return random
    
    } catch (error) {
      console.error("Error fetching random number:", error)

    }
  }