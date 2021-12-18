pub contract EmeraldAuthBot {

    access(contract) var guilds: {String: GuildInfo}

    pub struct GuildInfo {
        pub var guildID: String
        pub var tokenType: String
        pub var number: Int
        pub var path: String 
        pub var role: String
        pub var mintURL: String

        init(_guildID: String, _tokenType: String, _number: Int, _path: String, _role: String, _mintURL: String) {
            self.guildID = _guildID
            self.tokenType = _tokenType
            self.number = _number
            self.path = _path
            self.role = _role
            self.mintURL = _mintURL
        }
    }
    
    pub resource Headmaster {
        pub fun addGuild(guildID: String, tokenType: String, number: Int, path: String, role: String, mintURL: String) {
            EmeraldAuthBot.guilds[guildID] = GuildInfo(_guildID: guildID, _tokenType: tokenType, _number: number, _path: path, _role: role, _mintURL: mintURL)
        }
    }

    pub fun getGuildInfo(guildID: String): GuildInfo {
        return self.guilds[guildID] ?? panic("This guildID does not exist.")
    }

    pub fun getMintURL(guildID: String): String {
        let guildInfo = self.guilds[guildID] ?? panic("This guildID does not exist.")
        return guildInfo.mintURL
    }

    init() {
        self.guilds = {}

        if (self.account.borrow<&Headmaster>(from: /storage/EmeraldAuthBotHeadmaster) == nil) {
            self.account.save(<- create Headmaster(), to: /storage/EmeraldAuthBotHeadmaster)
        }
    }
}