const fcl = require("@onflow/fcl");
const { setEnvironment } = require("flow-cadut");

const {authorizationFunctionProposer, authorizationFunction} = require("./authorization.js");

const sendTransaction = async (code, args) => {
    await setEnvironment("testnet");

    try {
        const transactionId = await fcl.send([
            fcl.transaction(code),
            fcl.args(args),
            fcl.proposer(authorizationFunctionProposer),
            fcl.payer(authorizationFunction),
            fcl.authorizations([authorizationFunction]),
            fcl.limit(9999)
        ]).then(fcl.decode);
    
        return transactionId;
    } catch(e) {
        console.log(e);
    }
}

module.exports = {
    sendTransaction
}