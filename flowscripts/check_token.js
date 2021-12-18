const fcl = require("@onflow/fcl");
const t = require("@onflow/types");

fcl.config()
  .put('accessNode.api', 'https://access-testnet.onflow.org');

const getBalance = async (AccountProof, guildID) => {
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

  const { tokenType, number, path } = await fcl.send([
    fcl.script(`
      import EmeraldAuthBot from ${process.env.ADDRESS}

      pub fun main(guildID: Int): EmeraldAuthBot.GuildInfo {
        return EmeraldAuthBot.getGuildInfo(guildID: guildID)
      }
    `),
    fcl.args([
      fcl.arg(parseInt(guildID), t.Int)
    ])
  ]).then(fcl.decode);

  var script = ``;
  if (tokenType === "FT") {
    script = `
      import FungibleToken from 0x9a0766d93b6608b7
      pub fun main(address: Address): UFix64 {
        if let vault = getAccount(address).getCapability(${path}).borrow<&{FungibleToken.Balance}>() {
          return vault.balance
        } else {
          return 0.0
        }
      }
    `;
  } else if (tokenType === "NFT") {
    script = `
      import NonFungibleToken from 0x631e88ae7f1d7c20
      pub fun main(address: Address): Int {
        if let collection = getAccount(address).getCapability(${path}).borrow<&{NonFungibleToken.CollectionPublic}>() {
          return collection.getIDs().length
        } else {
          return 0
        }
      }
    `;
  }

  const result = await fcl.send([
    fcl.script(script),
    fcl.args([
      fcl.arg("0x" + Address, t.Address)
    ])
  ]).then(fcl.decode);

  return { result, number };
}

module.exports = {
  getBalance: getBalance
}