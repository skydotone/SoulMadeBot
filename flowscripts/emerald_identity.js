const fcl = require("@onflow/fcl");
const t = require("@onflow/types");
const { setEnvironment } = require("flow-cadut");

const checkEmeraldIdentity = async (discordID) => {
  await setEnvironment("testnet");
  const accountResponse = await fcl.send([
      fcl.script`
      import EmeraldIdentity from 0x4e190c2eb6d78faa

      pub fun main(discordID: String): Address? {
        return EmeraldIdentity.getIDFromDiscord(discordID: discordID)?.account
      }
      `,
      fcl.args([
          fcl.arg(discordID, t.String)
      ])
  ], { node: 'https://access-testnet.onflow.org' }).then(fcl.decode);

  return accountResponse;
}

module.exports = {
  checkEmeraldIdentity
}