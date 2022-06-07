import Gaia from 0x8b148183c28ff88f

pub fun main(): String? {
  if let collection = getAccount(0x3e40591d5522a4f1).getCapability(Gaia.CollectionPublicPath).borrow<&{Gaia.CollectionPublic}>() {
     let nft = collection.borrowGaiaNFT(id: 4821)!
     let info = Gaia.getSetInfo(setID: nft.data.setID)
     return info?.name
  } 
  
  return nil
}