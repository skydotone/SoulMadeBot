import EmeraldIdentity from 0x39e42c67cc851cfb
  
pub fun main(account: Address): String? {
  return EmeraldIdentity.getDiscordFromAccount(account: account)
}