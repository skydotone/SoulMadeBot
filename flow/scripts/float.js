const fcl = require('@onflow/fcl');
const t = require('@onflow/types');

const scriptCode = `
import FLOAT from 0xFLOAT

pub fun main(accounts: [Address], eventId: UInt64): Bool {
  for account in accounts {
    let floatCollection = getAccount(account).getCapability(FLOAT.FLOATCollectionPublicPath)
                            .borrow<&FLOAT.Collection{FLOAT.CollectionPublic}>()
                            ?? panic("Could not borrow the Collection from the account.")
    let ids = floatCollection.ownedIdsFromEvent(eventId: eventId)
    if ids.length > 0 {
      return true
    }
  }
  return false
}
`;

const checkOwnsFloat = async (emeraldIds, eventId) => {
  if (!account) return null;
  try {
    const result = await fcl.send([
      fcl.script(scriptCode),
      fcl.args([
        fcl.arg(emeraldIds, t.Array(t.Address)),
        fcl.arg(parseInt(eventId), t.UInt64)
      ])
    ]).then(fcl.decode);
    return result;
  } catch(e) {
    console.log('Does not have a FLOAT Collection');
    return {error: true, message: 'You do not own this FLOAT.'};
  }
}

const scriptCode2 = `
import FLOAT from 0xFLOAT

pub fun main(host: Address, groupName: String, users: [Address]): Bool {
  let eventsCollection = getAccount(host).getCapability(FLOAT.FLOATEventsPublicPath)
                        .borrow<&FLOAT.FLOATEvents{FLOAT.FLOATEventsPublic}>()
                        ?? panic("Could not borrow the FLOATEventsPublic from the host.")
  let group = eventsCollection.getGroup(groupName: groupName) ?? panic("This group does not exist.")
  let eventsInGroup = group.getEvents()

  for user in users {
    let floatsCollection = getAccount(user).getCapability(FLOAT.FLOATCollectionPublicPath)
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
`;

const checkOwnsFloatFromGroup = async (creator, groupName, emeraldIds) => {
  try {
    const result = await fcl.send([
      fcl.script(scriptCode2),
      fcl.args([
        fcl.arg(creator, t.Address),
        fcl.arg(groupName, t.String),
        fcl.arg(emeraldIds, t.Array(t.Address)),
      ])
    ]).then(fcl.decode);
    return result || {error: true, message: 'You do not own any FLOATs from this Group.'};
  } catch(e) {
    return {error: true, message: 'You do not own any FLOATs from this Group.'};
  }
}

const scriptCode3 = `
import FLOAT from 0xFLOAT

pub fun main(host: Address, groupName: String, users: [Address]): Bool {
  let eventsCollection = getAccount(host).getCapability(FLOAT.FLOATEventsPublicPath)
        .borrow<&FLOAT.FLOATEvents{FLOAT.FLOATEventsPublic}>()
        ?? panic("Could not borrow the FLOATEventsPublic from the host.")

  let group = eventsCollection.getGroup(groupName: groupName) ?? panic("This group does not exist.")
  let eventsInGroup = group.getEvents()

  let ownedEvents: [UInt64] = []

  for user in users {
    let floatsCollection = getAccount(user).getCapability(FLOAT.FLOATCollectionPublicPath)
        .borrow<&FLOAT.Collection{FLOAT.CollectionPublic}>()
        ?? panic("Could not borrow the CollectionPublic from the user.")

    for eventId in eventsInGroup {
      if !ownedEvents.contains(eventId) && floatsCollection.ownedIdsFromEvent(eventId: eventId).length > 0 {
        ownedEvents.append(eventId)
      }
    } 
  }

  return ownedEvents.length == eventsInGroup.length
}
`;

const checkOwnsAllFloatsFromGroup = async (creator, groupName, emeraldIds) => {
  try {
    const result = await fcl.send([
      fcl.script(scriptCode3),
      fcl.args([
        fcl.arg(creator, t.Address),
        fcl.arg(groupName, t.String),
        fcl.arg(emeraldIds, t.Array(t.Address)),
      ])
    ]).then(fcl.decode);
    return result || {error: true, message: 'You do not own all the FLOATs from this Group.'};
  } catch(e) {
    return {error: true, message: 'You do not own all the FLOATs from this Group.'};
  }
}

module.exports = {
  checkOwnsFloat,
  checkOwnsFloatFromGroup,
  checkOwnsAllFloatsFromGroup
}