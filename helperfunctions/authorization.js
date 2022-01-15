const { SHA3 } = require("sha3");

var EC = require('elliptic').ec;
var ec = new EC('secp256k1');
const fcl = require("@onflow/fcl");

const sign = (message) => {
    const key = ec.keyFromPrivate(Buffer.from(process.env.PRIVATE_KEY, "hex"))
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

var keyId = 201;
const ADDRESS = process.env.ADDRESS

const authorizationFunctionProposer = async (account) => {
    if (keyId >= 300) {
        keyId = 201;
    } else {
        keyId++;
    }
    // authorization function need to return an account
    return {
        ...account, // bunch of defaults in here, we want to overload some of them though
        tempId: `${ADDRESS}-${keyId}`, // tempIds are more of an advanced topic, for 99% of the times where you know the address and keyId you will want it to be a unique string per that address and keyId
        addr: fcl.sansPrefix(ADDRESS), // the address of the signatory, currently it needs to be without a prefix right now
        keyId: Number(keyId), // this is the keyId for the accounts registered key that will be used to sign, make extra sure this is a number and not a string
        signingFunction: async signable => {
            // Singing functions are passed a signable and need to return a composite signature
            // signable.message is a hex string of what needs to be signed.
            return {
                addr: fcl.withPrefix(ADDRESS), // needs to be the same as the account.addr but this time with a prefix, eventually they will both be with a prefix
                keyId: Number(keyId), // needs to be the same as account.keyId, once again make sure its a number and not a string
                signature: sign(signable.message), // this needs to be a hex string of the signature, where signable.message is the hex value that needs to be signed
            }
        }
    }
}

const authorizationFunction = async (account) => {
    // authorization function need to return an account
    return {
        ...account, // bunch of defaults in here, we want to overload some of them though
        tempId: `${ADDRESS}-0`, // tempIds are more of an advanced topic, for 99% of the times where you know the address and keyId you will want it to be a unique string per that address and keyId
        addr: fcl.sansPrefix(ADDRESS), // the address of the signatory, currently it needs to be without a prefix right now
        keyId: Number(0), // this is the keyId for the accounts registered key that will be used to sign, make extra sure this is a number and not a string
        signingFunction: async signable => {
            // Singing functions are passed a signable and need to return a composite signature
            // signable.message is a hex string of what needs to be signed.
            return {
                addr: fcl.withPrefix(ADDRESS), // needs to be the same as the account.addr but this time with a prefix, eventually they will both be with a prefix
                keyId: Number(0), // needs to be the same as account.keyId, once again make sure its a number and not a string
                signature: sign(signable.message), // this needs to be a hex string of the signature, where signable.message is the hex value that needs to be signed
            }
        }
    }
}

module.exports = {
    sign,
    authorizationFunction,
    authorizationFunctionProposer
}