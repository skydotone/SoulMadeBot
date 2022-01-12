import EmeraldIdentity from 0x4e190c2eb6d78faa
  
        pub fun main(account: Address): String? {
          return EmeraldIdentity.getIDFromAccount(account: account)?.discordID
        }