const fcl = require('@onflow/fcl');
const t = require('@onflow/types');
const { holdingScripts } = require('../holdings/dapperholdings');

const checkOwnsDapper = async (customName, user) => {
  if (!user) return null;
  console.log(customName.replace(/\s/g, "").toLowerCase())
  const scriptCode = holdingScripts[customName.replace(/\s/g, "").toLowerCase()];

  try {
    const result = await fcl.send([
      fcl.script(scriptCode),
      fcl.args([
        fcl.arg(user, t.Address),
      ])
    ]).then(fcl.decode);
    return result;
  } catch (e) {
    console.log(e)
    return { error: true, message: 'You do not own this Custom entity.' };
  }
}

module.exports = {
  checkOwnsDapper
}