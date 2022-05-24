const fcl = require('@onflow/fcl');
const t = require('@onflow/types');

const getRandomFloats = async (creator, eventId) => {
  try {
    const result = await fcl.send([
      fcl.script(scriptCode),
      fcl.args([
        fcl.arg(creator, t.Address),
        fcl.arg(parseInt(eventId), t.UInt64)
      ])
    ]).then(fcl.decode);
    return result || {error: true, message: 'This event does not exist.'};
  } catch(e) {
    console.log(e)
    return {error: true, message: 'This event does not exist.'};
  }
}

const scriptCode = `
import FLOAT from 0xFLOAT

pub fun main(host: Address, eventId: UInt64): [FLOAT.TokenIdentifier] {
  let eventsCollection = getAccount(host).getCapability(FLOAT.FLOATEventsPublicPath)
                        .borrow<&FLOAT.FLOATEvents{FLOAT.FLOATEventsPublic}>()
                        ?? panic("Could not borrow the FLOATEventsPublic from the host.")

  let publicEvent = eventsCollection.borrowPublicEventRef(eventId: eventId)
                      ?? panic("This event does not exist")
  
  return publicEvent.getCurrentHolders().values
}
`;

module.exports = {
  getRandomFloats
}