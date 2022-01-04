import HyperverseModule from 0x4e190c2eb6d78faa
import IHyperverse from 0x4e190c2eb6d78faa

// https://play.onflow.org/04c9c8c5-ef8b-480e-95e2-d35b8ff7112d?type=account&id=0

pub contract EmeraldAuthBotv2: IHyperverse {

    /**************************************** FUNCTIONALITY ****************************************/

    pub let HeadmasterStoragePath: StoragePath

    pub event AddedGuild(_ tenant: Address, guildID: String)

    pub struct VerificationInfo {
        pub var tokenType: String
        pub var contractName: String
        pub var contractAddress: Address
        pub var number: Int
        pub var path: String 
        pub var role: String
        pub var network: String
        pub var url: String

        init(_tokenType: String, _contractName: String, _contractAddress: Address, _number: Int, _path: String, _role: String, _network: String, _url: String) {
            self.tokenType = _tokenType
            self.contractName = _contractName
            self.contractAddress = _contractAddress
            self.number = _number
            self.path = _path
            self.role = _role
            self.network = _network
            self.url = _url
        }
    }

    pub struct GuildInfo {
        pub var guildID: String
        // maps the role id to the verification for that role
        pub var verifications: {String: VerificationInfo}

        access(contract) fun addVerification(verification: VerificationInfo) {
            self.verifications[verification.role] = verification
        }

        init(_guildID: String) {
            self.guildID = _guildID
            self.verifications = {}
        }
    }

    pub resource Headmaster {
        pub let tenant: Address

        pub fun addGuild(guildID: String) {
            let state = EmeraldAuthBotv2.getTenant(self.tenant)!
            state.guilds[guildID] = GuildInfo(_guildID: guildID)
            emit AddedGuild(self.tenant, guildID: guildID)
        }

        pub fun addVerification(guildID: String, tokenType: String, contractName: String, contractAddress: Address, number: Int, path: String, role: String, network: String, url: String) {
            let state = EmeraldAuthBotv2.getTenant(self.tenant)!
            if state.guilds[guildID] == nil {
                self.addGuild(guildID: guildID)
            }

            let guild = &state.guilds[guildID]! as &GuildInfo
            let verificationInfo = VerificationInfo(
                    _tokenType: tokenType, 
                    _contractName: contractName, 
                    _contractAddress: contractAddress, 
                    _number: number, 
                    _path: path, 
                    _role: role, 
                    _network: network, 
                    _url: url
            )
            guild.addVerification(verification: verificationInfo)
        }
        
        init(_ tenant: Address) { 
            self.tenant = tenant 
        }
    }

    pub fun getVerificationInfo(_ tenant: Address, guildID: String, role: String): VerificationInfo? {
        if let state = self.getTenant(tenant) {
            if let guildInfo = state.guilds[guildID] {
                return guildInfo.verifications[role]
            }
        } 
        return nil
    }

    pub fun getGuildIDs(_ tenant: Address): [String] {
        if let state = self.getTenant(tenant) {
            return state.guilds.keys
        } else {
            return []
        }
    }

    pub fun getVerifications(_ tenant: Address, guildID: String): [VerificationInfo] {
        if let state = self.getTenant(tenant) {
            if let guild = state.guilds[guildID] {
                return guild.verifications.values
            }
        } 

        return []
    }

    pub fun getURL(_ tenant: Address, guildID: String, role: String): String? {
        if let state = self.getTenant(tenant) {
            if let guild = state.guilds[guildID] {
                return guild.verifications[role]?.url
            }
        } 

        return nil
    }

    /**************************************** METADATA & TENANT ****************************************/

    pub var metadata: HyperverseModule.Metadata

    pub event TenantCreated(tenant: Address)
    access(contract) var tenants: @{Address: Tenant}
    access(contract) fun getTenant(_ tenant: Address): &Tenant? {
        if self.tenantExists(tenant) {
            return &self.tenants[tenant] as &Tenant
        } else {
            return nil
        }
    }
    pub fun tenantExists(_ tenant: Address): Bool {
        return self.tenants[tenant] != nil
    }

    pub resource Tenant {
        pub var tenant: Address
        access(contract) var guilds: {String: GuildInfo}
        
        init(_ tenant: Address) {
            self.tenant = tenant
            self.guilds = {}
        }
    }

    pub fun createTenant(newTenant: AuthAccount) {
        let tenant = newTenant.address
        self.tenants[tenant] <-! create Tenant(tenant)
        emit TenantCreated(tenant: tenant)

        newTenant.save(<- create Headmaster(tenant), to: self.HeadmasterStoragePath)
    }

    init() {
        self.HeadmasterStoragePath = /storage/EmeraldAuthBotHeadmasterv2
        self.tenants <- {}

        self.metadata = HyperverseModule.Metadata(
                            _identifier: self.getType().identifier,
                            _contractAddress: self.account.address,
                            _title: "EmeraldAuthBotv2",
                            _authors: [HyperverseModule.Author(_address: 0x6c0d53c676256e8c, _externalURI: "https://twitter.com/jacobmtucker")],
                            _version: "0.0.1",
                            _publishedAt: getCurrentBlock().timestamp,
                            externalURI: "https://emerald-city.netlify.app/"
                        )
    }
}