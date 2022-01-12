const fcl = require("@onflow/fcl");
const t = require("@onflow/types");
const { setEnvironment } = require("flow-cadut");
const { nft, ft, find, geniacemetalmaneki, flovatar } = require("../scriptcode/holdings.js");

const getBalancev2 = async (account, guildID, roleId) => {
  let network = "mainnet";
  await setEnvironment(network);

  const guildInfo = await fcl.send([
    fcl.script(`
      import EmeraldAuthBotv2 from ${process.env.ADDRESS}

      pub fun main(tenant: Address, guildID: String, role: String): EmeraldAuthBotv2.VerificationInfo? {
        return EmeraldAuthBotv2.getVerificationInfo(tenant, guildID: guildID, role: role)
      }
    `),
    fcl.args([
      fcl.arg(process.env.ADDRESS, t.Address),
      fcl.arg(guildID, t.String),
      fcl.arg(roleId, t.String)
    ])
  ], { node: 'https://access-testnet.onflow.org' }).then(fcl.decode);

  if (!guildInfo) return;
  let { tokenType, contractName, contractAddress, number, path } = guildInfo;

  var script = ``;
  if (tokenType === "FT") {
    script = ft(contractName, contractAddress, network, path)
  } else if (tokenType === "NFT") {
    script = nft(contractName, contractAddress, network, path);
  } else if (tokenType === "FIND") {
    script = find();
  } else if (tokenType === "GeniaceMETALMANEKI") {
    script = geniacemetalmaneki();
  } else if (tokenType === 'Flovatar') {
    script = flovatar();
  }

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
  getBalancev2
}