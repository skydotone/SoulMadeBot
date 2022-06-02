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

function NFL() {
  return `
  import AllDay from 0xe4cf4bdc1751c65d

  pub fun main(user: Address, roleIds: [String]): [String] {
    var earnedRoles: [String] = []

    // This checks for at least 3 NFL Moments
    if let collection = getAccount(user).getCapability(AllDay.CollectionPublicPath).borrow<&AllDay.Collection{AllDay.MomentNFTCollectionPublic}>() {
      let ids = collection.getIDs()
      if ids.length >= 3 {
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

  pub fun main(user: Address, roleIds: [String]): [String] {
    var earnedRoles: [String] = []

    if let collection = getAccount(user).getCapability(Flunks.CollectionPublicPath).borrow<&Flunks.Collection{Flunks.FlunksCollectionPublic}>() {
      let ids = collection.getIDs()

      // This checks for at least 1 Flunk
      if ids.length > 0 {
        earnedRoles.append(roleIds[0])
      }

      // This checks for at least 8 Flunks
      if ids.length >= 8 {
        earnedRoles.append(roleIds[1])
      }

      // Checks the Flunks Clique
      for id in ids {
        let flunk = collection.borrowFlunks(id: id)!
        let clique = flunk.getNFTMetadata()["Clique"]!
        if clique == "Jock" {
          if !earnedRoles.contains(roleIds[2]) {
            earnedRoles.append(roleIds[2])
          }
        } else if clique == "Geek" {
          if !earnedRoles.contains(roleIds[3]) {
            earnedRoles.append(roleIds[3])
          }
        } else if clique == "Prep" {
          if !earnedRoles.contains(roleIds[4]) {
            earnedRoles.append(roleIds[4])
          }
        } else if clique == "Freak" {
          if !earnedRoles.contains(roleIds[5]) {
            earnedRoles.append(roleIds[5])
          }
        }
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

function Driverz() {
  return `
  import DriverzNFT from 0xa039bd7d55a96c0c

  pub fun main(user: Address, roleIds: [String]): [String] {
    var earnedRoles: [String] = []

    // This checks for Driverz moments
    if let collection = getAccount(user).getCapability(DriverzNFT.CollectionPublicPath).borrow<&{DriverzNFT.CollectionPublic}>() {
      let ids = collection.getIDs()
      if ids.length >= 1 {
        earnedRoles.append(roleIds[0])
      }
      if ids.length >= 5 {
        earnedRoles.append(roleIds[1])
      }
      if ids.length >= 15 {
        earnedRoles.append(roleIds[2])
      }
    }

    return earnedRoles
  }
  `
}

function Genies() {
  return `
  import Genies from 0x12450e4bb3b7666e

  pub fun main(user: Address, roleIds: [String]): [String] {
    var earnedRoles: [String] = [];

    // This checks for Genies NFTs
    if let collection = getAccount(user).getCapability(Genies.CollectionPublicPath).borrow<&Genies.Collection{Genies.GeniesNFTCollectionPublic}>() {
      let ids: [UInt64] = collection.getIDs();
      var collections: [UInt32] = [];
      var editions: [UInt32] = [];

      // Gather all Collections & Editions the User is holding
      for id in ids {
        let nft = collection!.borrowGeniesNFT(id: id)!;

        let editionID: UInt32 = nft.editionID;
        if ! editions.contains(editionID) {
          editions.append(editionID);
        }

        let collectionID: UInt32 = Genies.getEditionData(id: editionID).collectionID;
        if ! collections.contains(collectionID) {
          collections.append(collectionID);
        }
      }

      // Check if User holds a Lucid Tokyo Wearable
      if collections.contains(1) {
        earnedRoles.append(roleIds[0]);
      }
    }

    return earnedRoles;
  }
  `
}

function NFW() {
  return `
  import NonFungibleToken from 0x1d7e57aa55817448
  import DriverzNFT from 0xa039bd7d55a96c0c
  import Flunks from 0x807c3d470888cc48 
  import FIND from 0x097bafa4e0b48eef
  import Bl0x from 0x7620acf6d7f2468a

  pub fun main(user: Address, roleIds: [String]): [String] {
    var earnedRoles: [String] = []

    // Driverz
    if let collection = getAccount(user).getCapability(DriverzNFT.CollectionPublicPath).borrow<&{DriverzNFT.CollectionPublic}>() {
      if collection.getIDs().length >= 1 {
        earnedRoles.append(roleIds[0])
      }
    }

    // Flunks
    if let collection = getAccount(user).getCapability(Flunks.CollectionPublicPath).borrow<&Flunks.Collection{Flunks.FlunksCollectionPublic}>() {
      if collection.getIDs().length >= 1 {
        earnedRoles.append(roleIds[1])
      }
    }

    // .find
    let name = FIND.reverseLookup(user)
    if name != nil {
      earnedRoles.append(roleIds[2])
    }

    // bl0x
    if let collection = getAccount(user).getCapability(Bl0x.CollectionPublicPath).borrow<&Bl0x.Collection{NonFungibleToken.CollectionPublic}>() {
      if collection.getIDs().length >= 1 {
        earnedRoles.append(roleIds[3])
      }
    }

    return earnedRoles
  } 
  `
}

const holdingScripts = {
  UFC,
  Flunks,
  IXLabs,
  NFL,
  Driverz,
  Genies,
  NFW
}

module.exports = {
  holdingScripts
}