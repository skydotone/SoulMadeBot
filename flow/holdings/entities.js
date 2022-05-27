function UFC() {
  return `
  import UFC_NFT from 0x329feb3ab062d289

  pub fun main(user: Address, roleIds: [String]): [String] {
    var earnedRoles: [String] = []

    // This checks for at least 3 UFC Moments
    if let collection = getAccount(user).getCapability(UFC_NFT.CollectionPublicPath).borrow<&UFC_NFT.Collection{UFC_NFT.UFC_NFTCollectionPublic}>() {
      let ids = collection.getIDs()
      if ids.length >= 3 {
        earnedRoles.append(roleIds[0])
      }
      for id in ids {
        let moment = collection.borrowUFC_NFT(id: id)!
        let metadata = UFC_NFT.getSetMetadata(setId: moment.setId)!
        if (metadata["TIER"] == "Champion") {
          earnedRoles.append(roleIds[1])
          break
        }
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

function IXLabs() {
  return `
  import TopShot from 0x0b2a3299cc857e29

  // Returns the total # of moments the user has from Cool Cats
  pub fun main(user: Address, roleIds: [String]): [String] {
    var earnedRoles: [String] = []

    if let collection = getAccount(user).getCapability(/public/MomentCollection).borrow<&{TopShot.MomentCollectionPublic}>() {
      let ids = collection.getIDs()
      var answer: UInt64 = 0
      var coveredPlays: [UInt32] = []
      for id in ids {
        let moment = collection.borrowMoment(id: id)!
        // If it is a cool cat
        if moment.data.setID == 32 {
          answer = answer + 1
          if !coveredPlays.contains(moment.data.playID) {
            coveredPlays.append(moment.data.playID)
          }
        }
      }
      // If the user has 3 or more Cool Cat Moments
      if answer >= 3 {
        earnedRoles.append(roleIds[0])
      }
      // If the user has all 30 unique Cool Cat Moments
      if coveredPlays.length == 30 {
        earnedRoles.append(roleIds[1])
      }
    }

    return earnedRoles
  }
  `
}

const holdingScripts = {
  UFC,
  Flunks,
  IXLabs
}

module.exports = {
  holdingScripts
}