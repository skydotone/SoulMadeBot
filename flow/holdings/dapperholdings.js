function threeufcmoments() {
  return `
  import UFC_NFT from 0x329feb3ab062d289
  import NonFungibleToken from 0x1d7e57aa55817448

  pub fun main(user: Address): Bool {
    if let collection = getAccount(user).getCapability(UFC_NFT.CollectionPublicPath).borrow<&UFC_NFT.Collection{NonFungibleToken.CollectionPublic}>() {
      if collection.getIDs().length >= 3 {
        return true
      }
    }
    return false
  } 
  `
}

function oneflunk() {
  return `
  import Flunks from 0x807c3d470888cc48 
  import NonFungibleToken from 0x1d7e57aa55817448
  pub fun main(user: Address): Bool {
    if let collection = getAccount(user).getCapability(Flunks.CollectionPublicPath).borrow<&Flunks.Collection{NonFungibleToken.CollectionPublic}>() {
      if collection.getIDs().length > 0 {
        return true
      }
    }
    return false
  }
  `
}

function eightplusflunk() {
  return `
  import Flunks from 0x807c3d470888cc48 
  import NonFungibleToken from 0x1d7e57aa55817448
  pub fun main(user: Address): Bool {
    if let collection = getAccount(user).getCapability(Flunks.CollectionPublicPath).borrow<&Flunks.Collection{NonFungibleToken.CollectionPublic}>() {
      if collection.getIDs().length >= 8 {
        return true
      }
    }
    return false
  }
  `
}

const holdingScripts = {
  threeufcmoments,
  oneflunk,
  eightplusflunk
}

module.exports = {
  holdingScripts
}