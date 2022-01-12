// https://play.onflow.org/90eb5595-f0de-4fc0-ba99-2cb5ac9f4a73?type=account&id=0

pub contract EmeraldIdentity {

    // Paths
    //
    pub let EmeraldIDStoragePath: StoragePath
    pub let EmeraldIDPublicPath: PublicPath
    pub let EmeraldIDAdministrator: StoragePath

    // Events
    //
    pub event EmeraldIDCreated(account: Address, discordID: String, timestamp: UFix64)
    pub event EmeraldIDUpdated(account: Address, discordID: String, timestamp: UFix64)
    pub event EmeraldIDDestroyed(account: Address, discordID: String, timestamp: UFix64)

    // Maps a Discord ID to an on-chain address
    access(contract) var identifications: {String: Address}

    // EmeraldID
    // Represents who you are on Discord
    //
    pub resource EmeraldID {
        pub var account: Address
        pub var discordID: String
        pub var metadata: {String: String}

        access(contract) fun updateIDInfo(account: Address, discordID: String, metadata: {String: String}) {
            self.account = account
            self.discordID = discordID
            self.metadata = metadata
        }

        init(_account: Address, _discordID: String, _metadata: {String: String}) {
            self.account = _account
            self.discordID = _discordID
            self.metadata = _metadata

            emit EmeraldIDCreated(account: self.account, discordID: self.discordID, timestamp: getCurrentBlock().timestamp)
        }
        
        destroy() {
            EmeraldIdentity.identifications.remove(key: self.discordID)
            emit EmeraldIDDestroyed(account: self.account, discordID: self.discordID, timestamp: getCurrentBlock().timestamp)
        }
    }
    
    // Owned by the Emerald Bot
    pub resource Administrator {
        pub fun createEmeraldID(account: Address, discordID: String, metadata: {String: String}): @EmeraldID {
            pre {
                EmeraldIdentity.identifications[discordID] == nil:
                    "This EmeraldID already exists."
            }
            EmeraldIdentity.identifications[discordID] = account
            return <- create EmeraldID(_account: account, _discordID: discordID, _metadata: metadata)
        }

        pub fun updateEmeraldID(account: Address, discordID: String, id: &EmeraldID, metadata: {String: String}) {
            pre {
                EmeraldIdentity.identifications[discordID] != nil:
                    "This EmeraldID does not exist. Consider creating it."
            }
            EmeraldIdentity.identifications[discordID] = account
            id.updateIDInfo(account: account, discordID: discordID, metadata: metadata)
            emit EmeraldIDUpdated(account: account, discordID: discordID, timestamp: getCurrentBlock().timestamp)
        }
    }
    
    // Destroy your Emerald ID
    pub fun destroyEmeraldID(id: @EmeraldID) {
        destroy id
    }

    /*** USE THE BELOW FUNCTIONS FOR SECURE VERIFICATION OF ID ***/ 

    pub fun getIDFromAccount(account: Address): &EmeraldID?  {
        post {
            !(result != nil && result!.account != account):
                "This is a fraudulent EmeraldID."
        }
        return getAccount(account)
                .getCapability(EmeraldIdentity.EmeraldIDPublicPath)
                .borrow<&EmeraldID>()
    }

    pub fun getIDFromDiscord(discordID: String): &EmeraldID? {
        if let account = EmeraldIdentity.identifications[discordID] {
            return EmeraldIdentity.getIDFromAccount(account: account)
        }

        return nil
    }

    init() {
        self.EmeraldIDStoragePath = /storage/EmeraldIdentity
        self.EmeraldIDPublicPath = /public/EmeraldIdentity
        self.EmeraldIDAdministrator = /storage/EmeraldIDAdministrator
        self.identifications = {}

        self.account.save(<- create Administrator(), to: EmeraldIdentity.EmeraldIDAdministrator)
    }

}