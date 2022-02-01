const fcl = require("@onflow/fcl");
fcl.config()
    .put('accessNode.api', 'https://testnet.onflow.org');

const {authorizationFunctionProposer, authorizationFunction} = require("./authorization.js");

const sendTransaction = async (code, args) => {
    const transactionId = await fcl.send([
        fcl.transaction(code),
        fcl.args(args),
        fcl.proposer(authorizationFunctionProposer),
        fcl.payer(authorizationFunction),
        fcl.authorizations([authorizationFunction]),
        fcl.limit(9999)
    ]).then(fcl.decode);

    return transactionId;
}

module.exports = {
    sendTransaction
}