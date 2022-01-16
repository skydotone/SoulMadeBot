// https://play.onflow.org/90eb5595-f0de-4fc0-ba99-2cb5ac9f4a73?type=account&id=6fe898b7-9a4d-4d48-a86c-0a0e36d21c87

pub contract EmeraldIdentity {

    // Paths
    //
    pub let EmeraldIDAdministrator: StoragePath

    // Events
    //
    pub event EmeraldIDUpdated(account: Address, discordID: String)
    pub event EmeraldIDRemoved(account: Address, discordID: String)

    // 1-to-1
    access(contract) var accountToDiscord: {Address: String}
    // 1-to-1
    access(contract) var discordToAccount: {String: Address}
    
    // Owned by the Emerald Bot
    pub resource Administrator {

        pub fun createEmeraldID(account: Address, discordID: String) {
            pre {
                EmeraldIdentity.getAccountFromDiscord(discordID: discordID) == nil &&
                EmeraldIdentity.getDiscordFromAccount(account: account) == nil: 
                "The old account must remove their EmeraldID first."
            }

            EmeraldIdentity.discordToAccount[discordID] = account
            EmeraldIdentity.accountToDiscord[account] = discordID

            emit EmeraldIDUpdated(account: account, discordID: discordID)
        }

        pub fun createAdministrator(): @Administrator {
            return <- create Administrator()
        }
    }

    pub fun remove(acct: AuthAccount) {
        let account = acct.address
        let discordID = EmeraldIdentity.getDiscordFromAccount(account: account) ?? panic("This EmeraldID does not exist!")

        EmeraldIdentity.discordToAccount.remove(key: discordID)
        EmeraldIdentity.accountToDiscord.remove(key: account)

        emit EmeraldIDRemoved(account: account, discordID: discordID)
    }

    /*** USE THE BELOW FUNCTIONS FOR SECURE VERIFICATION OF ID ***/ 

    pub fun getDiscordFromAccount(account: Address): String?  {
        return EmeraldIdentity.accountToDiscord[account]
    }

    pub fun getAccountFromDiscord(discordID: String): Address? {
        return EmeraldIdentity.discordToAccount[discordID]
    }

    init() {
        self.EmeraldIDAdministrator = /storage/EmeraldIDAdministrator
        self.discordToAccount = {}
        self.accountToDiscord = {}

        self.account.save(<- create Administrator(), to: EmeraldIdentity.EmeraldIDAdministrator)
    }
}