const fcl = require("@onflow/fcl");
const t = require("@onflow/types");

const { sendTransaction } = require("../helperfunctions/sendTransaction.js");

const code = `
import EmeraldAuthBotv2 from ${process.env.ADDRESS}

transaction(guildID: String, tokenType: String, contractName: String, contractAddress: Address, number: Int, path: String, role: String, url: String, network: String) {
    prepare(signer: AuthAccount) {
        if signer.borrow<&EmeraldAuthBotv2.Headmaster>(from: EmeraldAuthBotv2.HeadmasterStoragePath) == nil {
            EmeraldAuthBotv2.createTenant(newTenant: signer)
        }
        let headmaster = signer.borrow<&EmeraldAuthBotv2.Headmaster>(from: EmeraldAuthBotv2.HeadmasterStoragePath)
                            ?? panic("Could not borrow Headmaster")
        
        headmaster.addVerification(guildID: guildID, tokenType: tokenType, contractName: contractName, contractAddress: contractAddress, number: number, path: path, role: role, network: network, url: url)
    }

    execute {
        
    }
}
`

const changeAuthData = async (guildID, tokenType, contractName, contractAddress, number, path, role, url, network) => {
    let args = [
        fcl.arg(guildID, t.String),
        fcl.arg(tokenType, t.String),
        fcl.arg(contractName, t.String),
        fcl.arg(contractAddress, t.Address),
        fcl.arg(parseInt(number), t.Int),
        fcl.arg(`/public/${path}`, t.String),
        fcl.arg(role, t.String),
        fcl.arg(url, t.String),
        fcl.arg(network, t.String)
    ]
    
    const transactionId = await sendTransaction(code, args);
    console.log("Setup transaction", transactionId);

    try {
        await fcl.tx(transactionId).onceSealed();
        return true;
    } catch(e) {
        console.log(e);
        return false;
    }
}

module.exports = {
    changeAuthData: changeAuthData
}