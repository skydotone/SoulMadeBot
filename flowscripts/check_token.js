const fcl = require("@onflow/fcl");
const t = require("@onflow/types");
const { setEnvironment } = require("flow-cadut");

const getBalance = async (AccountProof, guildID, network) => {
  await setEnvironment(network);
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
  ], { node: 'https://access-testnet.onflow.org' }).then(fcl.decode);

  if (!guildInfo) return;
  let { tokenType, contractName, contractAddress, number, path, role } = guildInfo;

  var script = ``;
  if (tokenType === "FT") {
    script = `
      import FungibleToken from ${network === 'testnet' ? '0x9a0766d93b6608b7' : '0xf233dcee88fe0abe'}
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
      import NonFungibleToken from ${network === 'testnet' ? '0x631e88ae7f1d7c20' : '0x1d7e57aa55817448'}
      import ${contractName} from ${contractAddress}
      pub fun main(address: Address): Int {
        if let collection = getAccount(address).getCapability(${path}).borrow<&${contractName}.Collection{NonFungibleToken.CollectionPublic}>() {
          return collection.getIDs().length
        } else {
          if let collectionPublic = getAccount(address).getCapability(${path}).borrow<&{NonFungibleToken.CollectionPublic}>() {
            if collectionPublic.getType().identifier == "A.${contractAddress.slice(2)}.${contractName}.Collection" {
              return collectionPublic.getIDs().length
            }
          }
        }

        return -1
      }
    `;
  } else if (tokenType === "FIND") {
    script = `
      import FIND from 0x097bafa4e0b48eef
      import Profile from 0x097bafa4e0b48eef

      pub fun main(address: Address): Int {

        let account=getAccount(address)
        let leaseCap = account.getCapability<&FIND.LeaseCollection{FIND.LeaseCollectionPublic}>(FIND.LeasePublicPath)

        if !leaseCap.check() {
          return 0
        }

        let profile= Profile.find(address).asProfile()
        let leases = leaseCap.borrow()!.getLeaseInformation() 
        var time : UFix64?= nil
        var name :String?= nil
        for lease in leases {

          //filter out all leases that are FREE or LOCKED since they are not actice
          if lease.status != "TAKEN" {
            continue
          }

          //if we have not set a 
          if profile.findName == "" {
            if time == nil || lease.validUntil < time! {
              time=lease.validUntil
              name=lease.name
            }
          }

          if profile.findName == lease.name {
            return 1
          }
        }

        if name == nil {
          return 0
        } 
        return 1
      }
    `
  }

  const result = await fcl.send([
    fcl.script(script),
    fcl.args([
      fcl.arg(Address, t.Address)
    ])
  ]).then(fcl.decode);

  return { result, number, role, guildID };
}

module.exports = {
  getBalance: getBalance
}