const fcl = require("@onflow/fcl");
const t = require("@onflow/types");

fcl.config()
  .put('accessNode.api', 'https://access-testnet.onflow.org');
// { node: "https://access-mainnet-beta.onflow.org" }

const getBalance = async (AccountProof, guildID) => {
  console.log("Here!")
  const Address = AccountProof.address;
  const Timestamp = AccountProof.timestamp;
  const Message = fcl.WalletUtils.encodeMessageForProvableAuthnVerifying(
    Address,                    // Address of the user authenticating
    Timestamp,                  // Timestamp associated with the authentication
    "APP-V0.0-user",             // Application domain tag 
    { node: "https://access-mainnet-beta.onflow.org" }
  );
  const isValid = await fcl.verifyUserSignatures(
    Message,
    AccountProof.signatures,
    { node: "https://access-mainnet-beta.onflow.org" }
  );
  console.log("Failed!")

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
  let { tokenType, contractName, contractAddress, number, path, role, network } = guildInfo;

  var script = ``;
  if (tokenType === "FT") {
    script = `
      import FungibleToken from ${network === 'https://access-testnet.onflow.org' ? '0x9a0766d93b6608b7' : '0xf233dcee88fe0abe'}
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
      import NonFungibleToken from ${network === 'https://access-testnet.onflow.org' ? '0x631e88ae7f1d7c20' : '0x1d7e57aa55817448'}
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
      fcl.arg(Address, t.Address)
    ])
  ], { node: network }).then(fcl.decode);

  return { result, number, role, guildID };
}

module.exports = {
  getBalance: getBalance
}