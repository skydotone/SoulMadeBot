const fcl = require('@onflow/fcl');
const t = require('@onflow/types');

const checkOwnsFT = async (contractName, contractAddress, publicPath, amount, user) => {
  const scriptCode = `
  import FungibleToken from 0xf233dcee88fe0abe
  import ${contractName} from ${contractAddress}
  pub fun main(address: Address): Bool {
      if let vault = getAccount(address).getCapability(${publicPath}).borrow<&${contractName}.Vault{FungibleToken.Balance}>() {
          return vault.balance >= ${amount}
      } else {
          if let vaultPublic = getAccount(address).getCapability(${path}).borrow<&{FungibleToken.Balance}>() {
              if vaultPublic.getType().identifier == "A.${contractAddress.slice(2)}.${contractName}.Vault" {
                  return vaultPublic.balance >= ${amount}
              }
          }
      }

      return false
  }
  `;

  try {
    const result = await fcl.send([
      fcl.script(scriptCode),
      fcl.args([
        fcl.arg(user, t.Address),
      ])
    ]).then(fcl.decode);
    return result;
  } catch(e) {
    console.log(e)
    return {error: true, message: 'You do not own this NFT.'};
  }
}

module.exports = {
  checkOwnsFT
}