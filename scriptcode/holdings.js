const nftCode = ({contractName, contractAddress, path}) => {
    return `
        import NonFungibleToken from 0x1d7e57aa55817448
        import ${contractName} from ${contractAddress}
        pub fun main(address: Address): Int {
            if let collection = getAccount(address).getCapability(${path}).borrow<&${contractName}.Collection{NonFungibleToken.CollectionPublic}>() {
                return collection.getIDs().length
            } else {
                if let collectionPublic = getAccount(address).getCapability(${path}).borrow<&{NonFungibleToken.CollectionPublic}>() {
                    if collectionPublic.getType().identifier == "A.${contractAddress.slice(2)}.${contractName}.Collection" {
                        return collectionPublic.getIDs().length
                    }
                }
            }

            return -1
        }
    `;
}

const ftCode = ({contractName, contractAddress, path}) => {
    return `
        import FungibleToken from 0xf233dcee88fe0abe
        import ${contractName} from ${contractAddress}
        pub fun main(address: Address): UFix64 {
            if let vault = getAccount(address).getCapability(${path}).borrow<&${contractName}.Vault{FungibleToken.Balance}>() {
                return vault.balance
            } else {
                if let vaultPublic = getAccount(address).getCapability(${path}).borrow<&{FungibleToken.Balance}>() {
                    if vaultPublic.getType().identifier == "A.${contractAddress.slice(2)}.${contractName}.Vault" {
                        return vaultPublic.balance
                    }
                }
            }

            return 0.0
        }
    `;
}

const findCode = (guildInfo) => {
    return `
        import FIND from 0x097bafa4e0b48eef
        import Profile from 0x097bafa4e0b48eef

        pub fun main(address: Address): Int {

            let account=getAccount(address)
            let leaseCap = account.getCapability<&FIND.LeaseCollection{FIND.LeaseCollectionPublic}>(FIND.LeasePublicPath)

            if !leaseCap.check() {
                return 0
            }

            let profile= Profile.find(address).asProfile()
            let leases = leaseCap.borrow()!.getLeaseInformation() 
            var time : UFix64?= nil
            var name :String?= nil
            for lease in leases {

                //filter out all leases that are FREE or LOCKED since they are not actice
                if lease.status != "TAKEN" {
                    continue
                }

                //if we have not set a 
                if profile.findName == "" {
                    if time == nil || lease.validUntil < time! {
                        time=lease.validUntil
                        name=lease.name
                    }
                }

                if profile.findName == lease.name {
                    return 1
                }
            }

            if name == nil {
                return 0
            } 
            return 1
        }
    `;
}

const geniacemetalmanekiCode = (guildInfo) => {
    return `
        import GeniaceNFT from 0xabda6627c70c7f52
        
        pub fun main(address: Address): Int {
            if let collection = getAccount(address).getCapability(GeniaceNFT.CollectionPublicPath).borrow<&GeniaceNFT.Collection{GeniaceNFT.GeniaceNFTCollectionPublic}>() {
                let ids = collection.getIDs()

                for id in ids {
                    let geniaceNFT = collection.borrowGeniaceNFT(id: id)!
                    if geniaceNFT.metadata.celebrityName == "METAL MANEKI" {
                        return 1
                    }
                }
            }

            return -1
        }
    `;
}

const flovatarCode = (guildInfo) => {
    return `
        import Flovatar from 0x921ea449dffec68a
        
        pub fun main(address: Address): Int {
            if let collection = getAccount(address).getCapability(/public/FlovatarCollection).borrow<&{Flovatar.CollectionPublic}>() {
                return collection.getIDs().length
            }

            return -1
        }
    `;
}

const holdingScripts = {
    nft: nftCode,
    ft: ftCode,
    find: findCode,
    geniacemetalmaneki: geniacemetalmanekiCode,
    flovatar: flovatarCode
}

module.exports = {
    holdingScripts
}