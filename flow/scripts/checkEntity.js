const fcl = require('@onflow/fcl');
const t = require('@onflow/types');
const { holdingScripts } = require('../holdings/entities');

const UFC = async (emeraldIds) => {
  const scriptCode = holdingScripts['UFC'];
  const user = emeraldIds["dapper"];
  if (!user) return { error: true, message: 'You need to create your Dapper EmeraldID at https://id.ecdao.org' };

  const roleIds = ['979898271281586180', '979886293091766302'];

  const args = [
    fcl.arg(user, t.Address),
    fcl.arg(roleIds, t.Array(t.String))
  ]
  return await executeScript(scriptCode, args);
}

const Flunks = async (emeraldIds) => {
  const scriptCode = holdingScripts['Flunks'];
  const user = emeraldIds["dapper"];
  if (!user) return { error: true, message: 'You need to create your Dapper EmeraldID at https://id.ecdao.org' };

  const roleIds = ['961353472328994826', '958216670218965094'];

  const args = [
    fcl.arg(user, t.Address),
    fcl.arg(roleIds, t.Array(t.String))
  ]
  return await executeScript(scriptCode, args);
}

const IXLabs = async (emeraldIds) => {
  const scriptCode = holdingScripts['IXLabs'];
  const user = emeraldIds["dapper"];
  if (!user) return { error: true, message: 'You need to create your Dapper EmeraldID at https://id.ecdao.org' };

  const roleIds = ['922504964662771822', '922523238762950696'];

  const args = [
    fcl.arg(user, t.Address),
    fcl.arg(roleIds, t.Array(t.String))
  ]
  return await executeScript(scriptCode, args);
}

const executeScript = async (scriptCode, args) => {
  try {
    const result = await fcl.send([
      fcl.script(scriptCode),
      fcl.args(args)
    ]).then(fcl.decode);
    return result;
  } catch (e) {
    console.log(e)
    return { error: true, message: 'You do not meet the requirements for any of these roles.' };
  }
}

const entities = {
  UFC,
  Flunks,
  IXLabs
}

module.exports = {
  entities
}