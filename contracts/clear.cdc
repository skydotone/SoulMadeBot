import EmeraldAuthBot from 0x4e190c2eb6d78faa
import HyperverseAuth from 0x4e190c2eb6d78faa

transaction() {
    prepare(signer: AuthAccount) {
        let hm <- signer.load<@EmeraldAuthBot.Headmaster>(from: EmeraldAuthBot.HeadmasterStoragePath)
        destroy hm
    }

    execute {
        
    }
}