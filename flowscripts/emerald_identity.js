const fcl = require("@onflow/fcl");
const t = require("@onflow/types");
const { setEnvironment } = require("flow-cadut");

const checkEmeraldIdentity = async (account) => {
  await setEnvironment("testnet");
  const account = await fcl.send([
      fcl.script`
      import EmeraldIdentity from 0x4e190c2eb6d78faa

      pub fun main(account: Address): Address? {
        return EmeraldIdentity.getIDFromAccount(account: account)?.account
      }
      `,
      fcl.args([
          fcl.arg(account, t.Address)
      ])
  ]).then(fcl.decode);

  return account;
}

module.exports = {
  checkEmeraldIdentity
}