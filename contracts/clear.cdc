import EmeraldIdentity from 0x4e190c2eb6d78faa

transaction() {
    prepare(signer: AuthAccount) {
        let hm <- signer.load<@EmeraldIdentity.Administrator>(from: /storage/EmeraldIDAdministrator)
        destroy hm
        let em <- signer.load<@EmeraldIdentity.Emerald>(from: /storage/EmeraldIDEmerald)
        destroy em
    }

    execute {
        
    }
}