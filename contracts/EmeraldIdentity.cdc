pub contract EmeraldIdentity {

    // Paths
    //
    pub let EmeraldIDAdministrator: StoragePath

    // Events
    //
    pub event EmeraldIDCreated(account: Address, discordID: String)
    pub event EmeraldIDUpdated(account: Address, discordID: String)
    pub event EmeraldIDDestroyed(discordID: String)

    // Maps an address to a Discord ID
    access(contract) var mappings: {Address: String}
    // Maps a Discord ID to an EmeraldID
    access(contract) var identifications: {String: EmeraldID}

    // EmeraldID
    // A struct holding the data of an EmeraldID
    //
    pub struct EmeraldID {
        pub var account: Address
        pub var discordID: String
        access(contract) var metadata: {String: String}
        
        pub fun updateInfo(account: Address, discordID: String, metadata: {String: String}) {
            self.account = account
            self.discordID = discordID
            self.metadata = metadata
        }

        init(_account: Address, _discordID: String, _metadata: {String: String}) {
            self.account = _account
            self.discordID = _discordID
            self.metadata = _metadata
        }
    }
    
    // Owned by the Emerald Bot
    pub resource Administrator {
        pub fun updateEmeraldID(account: Address, discordID: String, metadata: {String: String}) {
            if EmeraldIdentity.identifications[discordID] == nil {
                EmeraldIdentity.identifications[discordID] = EmeraldID(_account: account, _discordID: discordID, _metadata: metadata)
                emit EmeraldIDCreated(account: account, discordID: discordID)
            } else {
                let emeraldIDRef = &EmeraldIdentity.identifications[discordID] as &EmeraldID
                emeraldIDRef.updateInfo(account: account, discordID: discordID, metadata: metadata)
                emit EmeraldIDUpdated(account: account, discordID: discordID)
            }

            EmeraldIdentity.mappings[account] = discordID
        }

        pub fun destroyID(discordID: String) {
            emit EmeraldIDDestroyed(discordID: discordID)
            EmeraldIdentity.identifications.remove(key: discordID)
        }
    }

    /*** USE THE BELOW FUNCTIONS FOR SECURE VERIFICATION OF ID ***/ 

    pub fun getIDFromAccount(account: Address): EmeraldID?  {
        if let discordID = EmeraldIdentity.mappings[account] {
            return EmeraldIdentity.getIDFromDiscord(discordID: discordID)
        }
        return nil
    }

    pub fun getIDFromDiscord(discordID: String): EmeraldID? {
        return EmeraldIdentity.identifications[discordID]
    }

    init() {
        self.EmeraldIDAdministrator = /storage/EmeraldIDAdministrator
        self.mappings = {}
        self.identifications = {}

        self.account.save(<- create Administrator(), to: EmeraldIdentity.EmeraldIDAdministrator)
    }

}