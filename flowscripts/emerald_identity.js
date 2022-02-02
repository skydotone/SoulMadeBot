const fcl = require("@onflow/fcl");
const t = require("@onflow/types");
const { setEnvironment } = require("flow-cadut");

const checkEmeraldIdentityDiscord = async (discordID) => {
  await setEnvironment("mainnet");
  const accountResponse = await fcl.send([
      fcl.script`
      import EmeraldIdentity from 0x39e42c67cc851cfb

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
    await setEnvironment("mainnet");
    const accountResponse = await fcl.send([
        fcl.script`
        import EmeraldIdentity from 0x39e42c67cc851cfb
  
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

const initializeEmeraldIDCode = () => {
    return `
        import EmeraldIdentity from 0x39e42c67cc851cfb

        // Signed by Administrator
        transaction(account: Address, discordID: String) {
            prepare(admin: AuthAccount) {
                let administrator = admin.borrow<&EmeraldIdentity.Administrator>(from: EmeraldIdentity.AdministratorStoragePath)
                                            ?? panic("Could not borrow the administrator")
                administrator.createEmeraldID(account: account, discordID: discordID)
            }

            execute {
                log("Created EmeraldID")
            }
        }
    `;
}

const resetEmeraldIDByDiscordIDCode = () => {
    return `
        import EmeraldIdentity from 0x39e42c67cc851cfb

        // Signed by Administrator
        transaction(discordID: String) {
            prepare(signer: AuthAccount) {
                let administrator = signer.borrow<&EmeraldIdentity.Administrator>(from: EmeraldIdentity.EmeraldIDAdministrator)
                                            ?? panic("Could not borrow the administrator")
                administrator.removeByDiscord(discordID: discordID)
            }

            execute {
                log("Removed EmeraldID")
            }
        }
    `;
}

const resetEmeraldIDByAccountCode = () => {
    return `
        import EmeraldIdentity from 0x39e42c67cc851cfb

        // Signed by Administrator
        transaction(account: Address) {
            prepare(signer: AuthAccount) {
                let administrator = signer.borrow<&EmeraldIdentity.Administrator>(from: EmeraldIdentity.EmeraldIDAdministrator)
                                            ?? panic("Could not borrow the administrator")
                administrator.removeByAccount(account: account)
            }

            execute {
                log("Removed EmeraldID")
            }
        }
    `;
}

const trxScripts = {
    initializeEmeraldID: initializeEmeraldIDCode,
    resetEmeraldIDByDiscordID: resetEmeraldIDByDiscordIDCode,
    resetEmeraldIDByAccount: resetEmeraldIDByAccountCode
}

module.exports = {
  checkEmeraldIdentityDiscord,
  checkEmeraldIdentityAccount,
  trxScripts
}