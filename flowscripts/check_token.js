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

  const guildInfo = await fcl.send([
    fcl.script(`
      import EmeraldAuthBot from ${process.env.ADDRESS}

      pub fun main(tenant: Address, guildID: String): EmeraldAuthBot.GuildInfo? {
        return EmeraldAuthBot.getGuildInfo(tenant, guildID: guildID)
      }
    `),
    fcl.args([
      fcl.arg(process.env.ADDRESS, t.Address),
      fcl.arg(guildID, t.String)
    ])
  ]).then(fcl.decode);

  if (!guildInfo) return;
  let { tokenType, contractName, contractAddress, number, path, role } = guildInfo;

  console.log(contractAddress)
  console.log(contractName)

  var script = ``;
  if (tokenType === "FT") {
    script = `
      import FungibleToken from 0x9a0766d93b6608b7
      import ${contractName} from ${contractAddress}
      pub fun main(address: Address): UFix64 {
        if let vault = getAccount(address).getCapability(${path}).borrow<&${contractName}.Vault{FungibleToken.Balance}>() {
          return vault.balance
        } else {
          return 0.0
        }
      }
    `;
  } else if (tokenType === "NFT") {
    script = `
      import NonFungibleToken from 0x631e88ae7f1d7c20
      import ${contractName} from ${contractAddress}
      pub fun main(address: Address): Int {
        if let collection = getAccount(address).getCapability(${path}).borrow<&${contractName}.Collection{NonFungibleToken.CollectionPublic}>() {
          return collection.getIDs().length
        } else {
          return -1
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

  return { result, number, role, guildID };
}

module.exports = {
  getBalance: getBalance
}