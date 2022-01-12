// https://play.onflow.org/90eb5595-f0de-4fc0-ba99-2cb5ac9f4a73?type=account&id=6fe898b7-9a4d-4d48-a86c-0a0e36d21c87

pub contract EmeraldIdentity {

    // Paths
    //
    pub let EmeraldIDAdministrator: StoragePath

    // Events
    //
    pub event EmeraldIDCreated(account: Address, discordID: String)
    pub event EmeraldIDUpdated(account: Address, discordID: String)
    pub event EmeraldIDDestroyed(discordID: String)

    // 1-1
    access(contract) var accountToDiscord: {Address: String}
    // 1-1
    access(contract) var discordToAccount: {String: Address}
    
    // Owned by the Emerald Bot
    pub resource Administrator {

        // Using a new account and discordID
        pub fun initializeEmeraldID(account: Address, discordID: String) {
            pre {
                EmeraldIdentity.accountToDiscord[account] == nil && 
                EmeraldIdentity.discordToAccount[discordID] == nil:
                    "This EmeraldID is already in use."
            }
            
            EmeraldIdentity.discordToAccount[discordID] = account
            EmeraldIdentity.accountToDiscord[account] = discordID
            emit EmeraldIDCreated(account: account, discordID: discordID)
        }

        pub fun updateInfo(account: Address, discordID: String) {
            pre {
                EmeraldIdentity.getDiscordFromAccount(account: account) != nil ||
                EmeraldIdentity.getAccountFromDiscord(discordID: discordID) != nil:
                    "This EmeraldID has not been created yet."
            }
            let oldDiscordID: String = EmeraldIdentity.getDiscordFromAccount(account: account)!
            let oldAccount: Address = EmeraldIdentity.getAccountFromDiscord(discordID: discordID)!
            self.reset(account: account, discordID: discordID)

            self.initializeEmeraldID(account: account, discordID: discordID)
        }

        pub fun reset(account: Address, discordID: String) {
            EmeraldIdentity.discordToAccount.remove(key: discordID)
            EmeraldIdentity.accountToDiscord.remove(key: account)
        }
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