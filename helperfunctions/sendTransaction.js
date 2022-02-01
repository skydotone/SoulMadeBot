const fcl = require("@onflow/fcl");

const {authorizationFunctionProposer, authorizationFunction} = require("./authorization.js");

const sendTransaction = async (code, args) => {
    const transactionId = await fcl.send([
        fcl.transaction(code),
        fcl.args(args),
        fcl.proposer(authorizationFunctionProposer),
        fcl.payer(authorizationFunction),
        fcl.authorizations([authorizationFunction]),
        fcl.limit(9999)
    ], { node: 'https://access-testnet.onflow.org' }).then(fcl.decode);

    return transactionId;
}

module.exports = {
    sendTransaction
}