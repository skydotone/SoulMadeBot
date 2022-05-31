import NFL_NFT from 0x329feb3ab062d289

  pub fun main(user: Address): [UInt64] {
    let roleIds: [String] = ["980633744966819930"]
    var earnedRoles: [String] = []

    // This checks for at least 3 NFL Moments
    if let collection = getAccount(user).getCapability(NFL_NFT.CollectionPublicPath).borrow<&NFL_NFT.Collection{NFL_NFT.NFL_NFTCollectionPublic}>() {
      return collection.getIDs()
    }

    return []
  } 