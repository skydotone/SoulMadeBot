pub contract EmeraldIdentity {

    //
    // Paths
    //
    pub let AdministratorStoragePath: StoragePath
    pub let AdministratorPrivatePath: PrivatePath

    //
    // Events
    //
    pub event EmeraldIDCreated(account: Address, discordID: String, admin: Address)
    pub event EmeraldIDRemoved(account: Address, discordID: String, admin: Address)
    
    //
    // Administrator
    //
    pub resource Administrator {
        // 1-to-1
        access(account) var accountToDiscord: {Address: String}
        // 1-to-1
        access(account) var discordToAccount: {String: Address}

        pub fun createEmeraldID(account: Address, discordID: String) {
            pre {
                EmeraldIdentity.getAccountFromDiscord(discordID: discordID) == nil &&
                EmeraldIdentity.getDiscordFromAccount(account: account) == nil: 
                "The old account must remove their EmeraldID first."
            }

            self.accountToDiscord[account] = discordID
            self.discordToAccount[discordID] = account

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
            self.discordToAccount.remove(key: discordID)
            self.accountToDiscord.remove(key: account)

            emit EmeraldIDRemoved(account: account, discordID: discordID, admin: self.owner!.address)
        }

        pub fun createAdministrator(): Capability<&Administrator> {
            return EmeraldIdentity.account.getCapability<&Administrator>(EmeraldIdentity.AdministratorPrivatePath)
        }

        init() {
            self.accountToDiscord = {}
            self.discordToAccount = {}
        }
    }

    /*** USE THE BELOW FUNCTIONS FOR SECURE VERIFICATION OF ID ***/ 

    pub fun getDiscordFromAccount(account: Address): String?  {
        let admin = EmeraldIdentity.account.borrow<&Administrator>(from: EmeraldIdentity.AdministratorStoragePath)!
        return admin.accountToDiscord[account]
    }

    pub fun getAccountFromDiscord(discordID: String): Address? {
        let admin = EmeraldIdentity.account.borrow<&Administrator>(from: EmeraldIdentity.AdministratorStoragePath)!
        return admin.discordToAccount[discordID]
    }

    init() {
        self.AdministratorStoragePath = /storage/EmeraldIDAdministrator
        self.AdministratorPrivatePath = /private/EmeraldIDAdministrator

        self.account.save(<- create Administrator(), to: EmeraldIdentity.AdministratorStoragePath)
        self.account.link<&Administrator>(EmeraldIdentity.AdministratorPrivatePath, target: EmeraldIdentity.AdministratorStoragePath)
    }
}