function UFC() {
  return `
  import UFC_NFT from 0x329feb3ab062d289
  import NonFungibleToken from 0x1d7e57aa55817448

  pub fun main(user: Address, roleIds: [String]): [String] {
    var earnedRoles: [String] = []

    // This checks for at least 3 UFC Moments
    if let collection = getAccount(user).getCapability(UFC_NFT.CollectionPublicPath).borrow<&UFC_NFT.Collection{NonFungibleToken.CollectionPublic}>() {
      if collection.getIDs().length >= 3 {
        earnedRoles.append(roleIds[0])
      }
    }

    return earnedRoles
  } 
  `
}

function Flunks() {
  return `
  import Flunks from 0x807c3d470888cc48 
  import NonFungibleToken from 0x1d7e57aa55817448

  pub fun main(user: Address, roleIds: [String]): [String] {
    var earnedRoles: [String] = []

    if let collection = getAccount(user).getCapability(Flunks.CollectionPublicPath).borrow<&Flunks.Collection{NonFungibleToken.CollectionPublic}>() {
      // This checks for at least 1 Flunk
      if collection.getIDs().length > 0 {
        earnedRoles.append(roleIds[0])
      }

      // This checks for at least 8 Flunks
      if collection.getIDs().length >= 8 {
        earnedRoles.append(roleIds[1])
      }
    }

    return earnedRoles
  }
  `
}

const holdingScripts = {
  UFC,
  Flunks
}

module.exports = {
  holdingScripts
}