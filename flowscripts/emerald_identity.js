const fcl = require("@onflow/fcl");
const t = require("@onflow/types");
const { setEnvironment } = require("flow-cadut");
const { authorizationFunction } = require("./write_data.js");

const checkEmeraldIdentityDiscord = async (discordID) => {
  await setEnvironment("testnet");
  const accountResponse = await fcl.send([
      fcl.script`
      import EmeraldIdentity from 0x4e190c2eb6d78faa

      pub fun main(discordID: String): Address? {
        return EmeraldIdentity.getAccountFromDiscord(discordID: discordID)
      }
      `,
      fcl.args([
          fcl.arg(discordID, t.String)
      ])
  ]).then(fcl.decode);

  return accountResponse;
}

const checkEmeraldIdentityAccount = async (account) => {
    await setEnvironment("testnet");
    const accountResponse = await fcl.send([
        fcl.script`
        import EmeraldIdentity from 0x4e190c2eb6d78faa
  
        pub fun main(account: Address): String? {
          return EmeraldIdentity.getDiscordFromAccount(account: account)
        }
        `,
        fcl.args([
            fcl.arg(account, t.Address)
        ])
    ]).then(fcl.decode);
  
    return accountResponse;
}

const initializeEmeraldID = async (account, discordID) => {
    await setEnvironment("testnet");
    const transactionId = await fcl.send([
        fcl.transaction`
        import EmeraldIdentity from 0x4e190c2eb6d78faa

        transaction(account: Address, discordID: String) {
            prepare(signer: AuthAccount) {
                let administrator = signer.borrow<&EmeraldIdentity.Administrator>(from: EmeraldIdentity.EmeraldIDAdministrator)
                                            ?? panic("Could not borrow the administrator")
                administrator.initializeEmeraldID(account: account, discordID: discordID)
            }

            execute {

            }
        }
        `,
        fcl.args([
            fcl.arg(account, t.Address),
            fcl.arg(discordID, t.String)
        ]),
        fcl.payer(authorizationFunction),
        fcl.proposer(authorizationFunction),
        fcl.authorizations([authorizationFunction]),
        fcl.limit(9999)
    ]).then(fcl.decode);

    try {
        await fcl.tx(transactionId).onceSealed();
        return true;
    } catch(e) {
        console.log(e);
        return false;
    }
}

module.exports = {
  checkEmeraldIdentityDiscord,
  checkEmeraldIdentityAccount,
  initializeEmeraldID
}