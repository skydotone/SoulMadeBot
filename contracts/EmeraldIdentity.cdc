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

    // EmeraldIDInfo
    // A struct holding the data of an EmeraldID
    //
    pub struct EmeraldIDInfo {
        pub var account: Address
        pub var discordID: String
        pub var metadata: {String: String}
        init(_account: Address, _discordID: String, _metadata: {String: String}) {
            self.account = _account
            self.discordID = _discordID
            self.metadata = _metadata
        }
    }

    // EmeraldID
    // Represents who you are on Discord
    //
    pub resource EmeraldID {
        pub var info: EmeraldIDInfo?
        pub var initialized: Bool

        access(contract) fun updateIDInfo(account: Address, discordID: String, metadata: {String: String}) {
            self.info = EmeraldIDInfo(_account: account, _discordID: discordID, _metadata: metadata)

            if self.initialized {
                emit EmeraldIDUpdated(account: account, discordID: discordID, timestamp: getCurrentBlock().timestamp)
            } else {
                emit EmeraldIDCreated(account: account, discordID: discordID, timestamp: getCurrentBlock().timestamp)
            }
        }

        init() {
            self.info = nil
            self.initialized = false
        }
        
        destroy() {
            EmeraldIdentity.identifications.remove(key: self.info!.discordID)
            emit EmeraldIDDestroyed(account: self.info!.account, discordID: self.info!.discordID, timestamp: getCurrentBlock().timestamp)
        }
    }
    
    // Owned by the Emerald Bot
    pub resource Administrator {
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

    pub fun createEmeraldID(): @EmeraldID {
        return <- create EmeraldID()
    }
    
    // Destroy your Emerald ID
    pub fun destroyEmeraldID(id: @EmeraldID) {
        destroy id
    }

    /*** USE THE BELOW FUNCTIONS FOR SECURE VERIFICATION OF ID ***/ 

    pub fun getIDFromAccount(account: Address): EmeraldIDInfo?  {
        post {
            !(result != nil && result!.account != account):
                "This is a fraudulent EmeraldID."
        }
        let emeraldIDRef: &EmeraldID? = getAccount(account)
                            .getCapability(EmeraldIdentity.EmeraldIDPublicPath)
                            .borrow<&EmeraldID>()

        return emeraldIDRef?.info
    }

    pub fun getIDFromDiscord(discordID: String): EmeraldIDInfo? {
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