import NonFungibleToken from 0x1d7e57aa55817448
import Bl0x from 0x7620acf6d7f2468a

  pub fun main(user: Address): [UInt64] {
    let roleIds: [String] = ["980633744966819930"]
    var earnedRoles: [String] = []

    // This checks for at least 3 NFL Moments
    if let collection = getAccount(user).getCapability(Bl0x.CollectionPublicPath).borrow<&Bl0x.Collection{NonFungibleToken.CollectionPublic}>() {
      return collection.getIDs()
    }

    return []
  } 