const { SHA3 } = require("sha3");

var EC = require('elliptic').ec;
var ec_secp = new EC('secp256k1');
var ec_p256 = new EC('p256');
const fcl = require("@onflow/fcl");

const testnetSign = (message) => {
    const key = ec_secp.keyFromPrivate(Buffer.from(process.env.TESTNET_PRIVATE_KEY, "hex"))
    const sig = key.sign(hash(message)) // hashMsgHex -> hash
    const n = 32
    const r = sig.r.toArrayLike(Buffer, "be", n)
    const s = sig.s.toArrayLike(Buffer, "be", n)
    return Buffer.concat([r, s]).toString("hex")
}

const mainnetSign = (message) => {
    const key = ec_p256.keyFromPrivate(Buffer.from(process.env.MAINNET_PRIVATE_KEY, "hex"))
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

var KEY_ID = 201;
const useKeyId = () => {
    let oldKeyId = KEY_ID;
    if (KEY_ID >= 300) {
        KEY_ID = 201;
    } else {
        KEY_ID++;
    }
    return oldKeyId;
}

const TESTNET_ADDRESS = "0x4e190c2eb6d78faa";

const authorizationFunctionProposer = async (account) => {
    let keyId = useKeyId();
    // authorization function need to return an account
    return {
        ...account, // bunch of defaults in here, we want to overload some of them though
        tempId: `${TESTNET_ADDRESS}-${keyId}`, // tempIds are more of an advanced topic, for 99% of the times where you know the address and keyId you will want it to be a unique string per that address and keyId
        addr: fcl.sansPrefix(TESTNET_ADDRESS), // the address of the signatory, currently it needs to be without a prefix right now
        keyId: Number(keyId), // this is the keyId for the accounts registered key that will be used to sign, make extra sure this is a number and not a string
        signingFunction: async signable => {
            // Singing functions are passed a signable and need to return a composite signature
            // signable.message is a hex string of what needs to be signed.
            return {
                addr: fcl.withPrefix(TESTNET_ADDRESS), // needs to be the same as the account.addr but this time with a prefix, eventually they will both be with a prefix
                keyId: Number(keyId), // needs to be the same as account.keyId, once again make sure its a number and not a string
                signature: testnetSign(signable.message), // this needs to be a hex string of the signature, where signable.message is the hex value that needs to be signed
            }
        }
    }
}

const authorizationFunction = async (account) => {
    // authorization function need to return an account
    return {
        ...account, // bunch of defaults in here, we want to overload some of them though
        tempId: `${TESTNET_ADDRESS}-0`, // tempIds are more of an advanced topic, for 99% of the times where you know the address and keyId you will want it to be a unique string per that address and keyId
        addr: fcl.sansPrefix(TESTNET_ADDRESS), // the address of the signatory, currently it needs to be without a prefix right now
        keyId: Number(0), // this is the keyId for the accounts registered key that will be used to sign, make extra sure this is a number and not a string
        signingFunction: async signable => {
            // Singing functions are passed a signable and need to return a composite signature
            // signable.message is a hex string of what needs to be signed.
            return {
                addr: fcl.withPrefix(TESTNET_ADDRESS), // needs to be the same as the account.addr but this time with a prefix, eventually they will both be with a prefix
                keyId: Number(0), // needs to be the same as account.keyId, once again make sure its a number and not a string
                signature: testnetSign(signable.message), // this needs to be a hex string of the signature, where signable.message is the hex value that needs to be signed
            }
        }
    }
}

module.exports = {
    testnetSign,
    mainnetSign,
    authorizationFunction,
    authorizationFunctionProposer,
    useKeyId
}