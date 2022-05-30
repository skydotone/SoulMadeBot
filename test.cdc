import Flunks from 0x807c3d470888cc48 

  pub fun main(user: Address): String? {
    var earnedRoles: [String] = []

    if let collection = getAccount(user).getCapability(Flunks.CollectionPublicPath).borrow<&Flunks.Collection{Flunks.FlunksCollectionPublic}>() {
      let nft = collection.borrowFlunks(id: collection.getIDs()[0])!
      return nft.getNFTMetadata()["Clique"]
    }

    return nil
  }