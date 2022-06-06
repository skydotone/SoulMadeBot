import FLOAT from 0x2d4c3caffbeab845

pub fun main(): Bool {
  let eventsCollection = getAccount(0x99bd48c8036e2876).getCapability(FLOAT.FLOATEventsPublicPath)
                        .borrow<&FLOAT.FLOATEvents{FLOAT.FLOATEventsPublic}>()
                        ?? panic("Could not borrow the FLOATEventsPublic from the host.")
  let group = eventsCollection.getGroup(groupName: "Emerald Academy") ?? panic("This group does not exist.")
  let eventsInGroup = group.getEvents()

  let users: [Address] = [0x99bd48c8036e2876]

  for user in users {
    let floatsCollection = getAccount(0x99bd48c8036e2876).getCapability(FLOAT.FLOATCollectionPublicPath)
        .borrow<&FLOAT.Collection{FLOAT.CollectionPublic}>()
        ?? panic("Could not borrow the CollectionPublic from the user.")

    for eventId in eventsInGroup {
      if floatsCollection.ownedIdsFromEvent(eventId: eventId).length > 0 {
        return true
      }
    } 
  }

  return false
}