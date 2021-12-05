const fcl = require("@onflow/fcl");
const t = require("@onflow/types");

fcl.config()
  .put('accessNode.api', 'https://access-testnet.onflow.org');

const script = `
import Emerald from 0x6c0d53c676256e8c
import FungibleToken from 0x9a0766d93b6608b7

pub fun main(address: Address): UFix64 {
  let vault = getAccount(address).getCapability(Emerald.TokenPublicBalancePath)
                      .borrow<&Emerald.Vault{FungibleToken.Balance}>()
                      ?? panic("Couldn't borrow picture receiver reference.")

  return vault.balance
}
`
const getBalance = async (AccountProof) => {
  const Address = AccountProof.address;
  const Timestamp = AccountProof.timestamp;
  const Message = fcl.WalletUtils.encodeMessageForProvableAuthnVerifying(
    Address,                    // Address of the user authenticating
    Timestamp,                  // Timestamp associated with the authentication
    "APP-V0.0-user"             // Application domain tag  
  );
  const isValid = await fcl.verifyUserSignatures(
    Message,
    AccountProof.signatures
  );

  if (!isValid) return 0;

  const result = await fcl.send([
    fcl.script(script),
    fcl.args([
      fcl.arg("0x" + Address, t.Address)
    ])
  ]).then(fcl.decode);

  return result;
}

module.exports = {
  getBalance: getBalance
}