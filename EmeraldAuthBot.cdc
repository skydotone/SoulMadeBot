pub contract EmeraldAuthBot {

    access(contract) var guilds: {Int: GuildInfo}

    pub struct GuildInfo {
        pub var tokenType: String
        pub var number: Int
        pub var path: String 

        init(_tokenType: String, _number: Int, _path: String) {
            self.tokenType = _tokenType
            self.number = _number
            self.path = _path
        }
    }
    
    pub resource Headmaster {
        pub fun addGuild(guildID: Int, tokenType: String, number: Int, path: String) {
            EmeraldAuthBot.guilds[guildID] = GuildInfo(_tokenType: tokenType, _number: number, _path: path)
        }
    }

    pub fun getGuildInfo(guildID: Int): GuildInfo {
        return self.guilds[guildID] ?? panic("This guildID does not exist.")
    }

    init() {
        self.guilds = {}

        if (self.account.borrow<&Headmaster>(from: /storage/EmeraldAuthBotHeadmaster) == nil) {
            self.account.save(<- create Headmaster(), to: /storage/EmeraldAuthBotHeadmaster)
        }
    }
}