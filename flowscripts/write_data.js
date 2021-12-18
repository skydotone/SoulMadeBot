const fcl = require("@onflow/fcl");
const t = require("@onflow/types");

const { SHA3 } = require("sha3");

var EC = require('elliptic').ec;
var ec = new EC('secp256k1');

fcl.config()
    .put('accessNode.api', 'https://access-testnet.onflow.org');

const ADDRESS = process.env.ADDRESS
const privateKey = process.env.PRIVATE_KEY
const KEY_ID = 0 // this account on testnet has three keys, we want the one with an index of 1 (has a weight of 1000)

const sign = (message) => {
    const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"))
    const sig = key.sign(hash(message)) // hashMsgHex -> hash
    const n = 32
    const r = sig.r.toArrayLike(Buffer, "be", n)
    const s = sig.s.toArrayLike(Buffer, "be", n)
    return Buffer.concat([r, s]).toString("hex")
}

const hash = (message) => {
    const sha = new SHA3(256);
    sha.update(Buffer.from(message, "hex"));
    return sha.digest();
}

const authorizationFunction = async (account) => {
    // authorization function need to return an account
    return {
        ...account, // bunch of defaults in here, we want to overload some of them though
        tempId: `${ADDRESS}-${KEY_ID}`, // tempIds are more of an advanced topic, for 99% of the times where you know the address and keyId you will want it to be a unique string per that address and keyId
        addr: fcl.sansPrefix(ADDRESS), // the address of the signatory, currently it needs to be without a prefix right now
        keyId: Number(KEY_ID), // this is the keyId for the accounts registered key that will be used to sign, make extra sure this is a number and not a string
        signingFunction: async signable => {
            // Singing functions are passed a signable and need to return a composite signature
            // signable.message is a hex string of what needs to be signed.
            return {
                addr: fcl.withPrefix(ADDRESS), // needs to be the same as the account.addr but this time with a prefix, eventually they will both be with a prefix
                keyId: Number(KEY_ID), // needs to be the same as account.keyId, once again make sure its a number and not a string
                signature: sign(signable.message), // this needs to be a hex string of the signature, where signable.message is the hex value that needs to be signed
            }
        }
    }
}

const transaction = `
import EmeraldAuthBot from ${process.env.ADDRESS}

transaction(guildID: Int, tokenType: String, number: Int, path: String, role: Int, mintURL: String) {
    prepare(signer: AuthAccount) {
        let headmaster = signer.borrow<&EmeraldAuthBot.Headmaster>(from: /storage/EmeraldAuthBotHeadmaster)
                            ?? panic("Could not borrow the Headmaster.")
        headmaster.addGuild(guildID: guildID, tokenType: tokenType, number: number, path: path, role: Int, mintURL: mintURL)
    }

    execute {
        
    }
}
`

const changeAuthData = async (guildID, tokenType, number, path, role, mintURL) => {
    const { transactionID } = await fcl.send([
        fcl.transaction(transaction),
        fcl.args([
            fcl.arg(parseInt(guildID), t.Int),
            fcl.arg(tokenType, t.String),
            fcl.arg(parseInt(number), t.Int),
            fcl.arg(`/public/${path}`, t.String),
            fcl.arg(parseInt(role), t.Int),
            fcl.arg(mintURL, t.String)
        ]),
        fcl.payer(authorizationFunction),
        fcl.proposer(authorizationFunction),
        fcl.authorizations([authorizationFunction]),
        fcl.limit(9999)
    ]);

    console.log("TransactionID:", transactionID)
}

module.exports = {
    changeAuthData: changeAuthData
}