const fcl = require("@onflow/fcl");
const t = require("@onflow/types");
const { holdingScripts } = require("../scriptcode/holdings.js");
const { setEnvironment } = require("flow-cadut");

const getTokenBalance = async (account, guildID, roleId) => {
  await setEnvironment("mainnet");
  const guildInfo = await fcl.send([
    fcl.script(`
      import EmeraldAuthBotv2 from 0x4e190c2eb6d78faa

      pub fun main(tenant: Address, guildID: String, role: String): EmeraldAuthBotv2.VerificationInfo? {
        return EmeraldAuthBotv2.getVerificationInfo(tenant, guildID: guildID, role: role)
      }
    `),
    fcl.args([
      fcl.arg("0x4e190c2eb6d78faa", t.Address),
      fcl.arg(guildID, t.String),
      fcl.arg(roleId, t.String)
    ])
  ], { node: 'https://access-testnet.onflow.org' }).then(fcl.decode);

  if (!guildInfo) return;

  const { tokenType, number } = guildInfo;
  if (!tokenType) return;
  var scriptFunc = holdingScripts[tokenType.toLowerCase()];
  if (!scriptFunc) return;
  var script = scriptFunc(guildInfo)
  if (!script) return;

  try {
    const result = await fcl.send([
      fcl.script(script),
      fcl.args([
        fcl.arg(account, t.Address)
      ])
    ]).then(fcl.decode);

    return { result, number };
  } catch(e) {
    console.log(e);
    return;
  }
}

module.exports = {
  getTokenBalance
}