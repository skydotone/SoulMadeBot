const fcl = require("@onflow/fcl");
const t = require("@onflow/types");

fcl.config()
    .put('accessNode.api', 'https://access-testnet.onflow.org');

const getMintURL = async (guildID) => {
    const mintURL = await fcl.send([
        fcl.script(`
            import EmeraldAuthBot from ${process.env.ADDRESS}

            pub fun main(tenant: Address, guildID: String): String {
                let url = EmeraldAuthBot.getMintURL(tenant, guildID: guildID)
                if url == nil {
                    return "None!"
                } else {
                    return url!
                }
            }
        `),
        fcl.args([
            fcl.arg(process.env.ADDRESS, t.Address),
            fcl.arg(guildID, t.String)
        ])
    ]).then(fcl.decode);

    return mintURL;
}

module.exports = {
    getMintURL: getMintURL
}