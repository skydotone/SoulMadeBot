// https://play.onflow.org/90eb5595-f0de-4fc0-ba99-2cb5ac9f4a73?type=account&id=6fe898b7-9a4d-4d48-a86c-0a0e36d21c87

pub contract EmeraldIdentity {

    // Paths
    //
    pub let EmeraldIDAdministratorStoragePath: StoragePath
    pub let EmeraldIDAdministratorPrivatePath: PrivatePath
    pub let EmeraldIDEmeraldStoragePath: StoragePath

    // Events
    //
    pub event EmeraldIDCreated(account: Address, discordID: String, admin: Address)
    pub event EmeraldIDRemoved(account: Address, discordID: String, admin: Address)

    pub resource Emerald {
        // 1-to-1
        access(account) var accountToDiscord: {Address: String}
        // 1-to-1
        access(account) var discordToAccount: {String: Address}

        access(account) fun addMapping(account: Address, discordID: String) {
            self.accountToDiscord[account] = discordID
            self.discordToAccount[discordID] = account
        }

        access(account) fun removeMapping(account: Address, discordID: String) {
            self.discordToAccount.remove(key: discordID)
            self.accountToDiscord.remove(key: account)
        }

        init() {
            self.accountToDiscord = {}
            self.discordToAccount = {}
        }
    }
    
    // Owned by the Emerald Bot
    pub resource Administrator {

        pub fun createEmeraldID(account: Address, discordID: String) {
            pre {
                EmeraldIdentity.getAccountFromDiscord(discordID: discordID) == nil &&
                EmeraldIdentity.getDiscordFromAccount(account: account) == nil: 
                "The old account must remove their EmeraldID first."
            }

            let emerald = EmeraldIdentity.account.borrow<&Emerald>(from: EmeraldIdentity.EmeraldIDEmeraldStoragePath)!
            emerald.addMapping(account: account, discordID: discordID)

            emit EmeraldIDCreated(account: account, discordID: discordID, admin: self.owner!.address)
        }

        pub fun removeByAccount(account: Address) {
            let discordID = EmeraldIdentity.getDiscordFromAccount(account: account) ?? panic("This EmeraldID does not exist!")
            self.remove(account: account, discordID: discordID)
        }

        pub fun removeByDiscord(discordID: String) {
            let account = EmeraldIdentity.getAccountFromDiscord(discordID: discordID) ?? panic("This EmeraldID does not exist!")
            self.remove(account: account, discordID: discordID)
        }

        access(self) fun remove(account: Address, discordID: String) {
            let emerald = EmeraldIdentity.account.borrow<&Emerald>(from: EmeraldIdentity.EmeraldIDEmeraldStoragePath)!
            emerald.removeMapping(account: account, discordID: discordID)

            emit EmeraldIDRemoved(account: account, discordID: discordID, admin: self.owner!.address)
        }

        pub fun createAdministrator(): Capability<&Administrator> {
            return EmeraldIdentity.account.getCapability<&Administrator>(EmeraldIdentity.EmeraldIDAdministratorPrivatePath)
        }
    }

    /*** USE THE BELOW FUNCTIONS FOR SECURE VERIFICATION OF ID ***/ 

    pub fun getDiscordFromAccount(account: Address): String?  {
        let emerald = EmeraldIdentity.account.borrow<&Emerald>(from: EmeraldIdentity.EmeraldIDEmeraldStoragePath)!
        return emerald.accountToDiscord[account]
    }

    pub fun getAccountFromDiscord(discordID: String): Address? {
        let emerald = EmeraldIdentity.account.borrow<&Emerald>(from: EmeraldIdentity.EmeraldIDEmeraldStoragePath)!
        return emerald.discordToAccount[discordID]
    }

    init() {
        self.EmeraldIDAdministratorStoragePath = /storage/EmeraldIDAdministrator
        self.EmeraldIDAdministratorPrivatePath = /private/EmeraldIDAdministrator
        self.EmeraldIDEmeraldStoragePath = /storage/EmeraldIDEmerald

        self.account.save(<- create Emerald(), to: EmeraldIdentity.EmeraldIDEmeraldStoragePath)
        self.account.save(<- create Administrator(), to: EmeraldIdentity.EmeraldIDAdministratorStoragePath)
        self.account.link<&Administrator>(EmeraldIdentity.EmeraldIDAdministratorPrivatePath, target: EmeraldIdentity.EmeraldIDAdministratorStoragePath)
    }
}