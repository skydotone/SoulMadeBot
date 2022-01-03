const fcl = require("@onflow/fcl");
const t = require("@onflow/types");
const { setEnvironment } = require("flow-cadut");
const { nft, ft, find } = require("../scriptcode/holdings.js");

const getBalance = async (AccountProof, guildID, network) => {
  await setEnvironment(network);
  const Address = AccountProof.address;
  const Timestamp = AccountProof.timestamp;
  const Message = fcl.WalletUtils.encodeMessageForProvableAuthnVerifying(
    Address,                    // Address of the user authenticating
    Timestamp,                  // Timestamp associated with the authentication
    "APP-V0.0-user"             // Application domain tag  
  );
  const isValid = await fcl.verifyUserSignatures(
    Message,
    AccountProof.signatures
  );

  if (!isValid) return 0;

  const guildInfo = await fcl.send([
    fcl.script(`
      import EmeraldAuthBot from ${process.env.ADDRESS}

      pub fun main(tenant: Address, guildID: String): EmeraldAuthBot.GuildInfo? {
        return EmeraldAuthBot.getGuildInfo(tenant, guildID: guildID)
      }
    `),
    fcl.args([
      fcl.arg(process.env.ADDRESS, t.Address),
      fcl.arg(guildID, t.String)
    ])
  ], { node: 'https://access-testnet.onflow.org' }).then(fcl.decode);

  if (!guildInfo) return;
  let { tokenType, contractName, contractAddress, number, path, role } = guildInfo;

  var script = ``;
  if (tokenType === "FT") {
    script = ft(contractName, contractAddress, network, path)
  } else if (tokenType === "NFT") {
    script = nft(contractName, contractAddress, network, path);
  } else if (tokenType === "FIND") {
    script = find();
  }

  try {
    const result = await fcl.send([
      fcl.script(script),
      fcl.args([
        fcl.arg(Address, t.Address)
      ])
    ]).then(fcl.decode);

    return { result, number, role, guildID };
  } catch(e) {
    console.log(e);
    return;
  }
}

module.exports = {
  getBalance: getBalance
}