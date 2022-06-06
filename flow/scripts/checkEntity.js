const fcl = require('@onflow/fcl');
const t = require('@onflow/types');
const { holdingScripts } = require('../holdings/entities');

const UFC = async (emeraldIds) => {
  const scriptCode = holdingScripts['UFC'];
  const user = emeraldIds["dapper"];
  if (!user) return { error: true, message: 'You need to create your Dapper EmeraldID at https://id.ecdao.org/dapper' };

  // 1. 3+, 2. Champion
  const roleIds = ['979898271281586180', '979886293091766302'];

  const args = [
    fcl.arg(user, t.Address),
    fcl.arg(roleIds, t.Array(t.String))
  ]
  return await executeScript(scriptCode, args);
}

const NFL = async (emeraldIds) => {
  const scriptCode = holdingScripts['NFL'];
  const user = emeraldIds["dapper"];
  if (!user) return { error: true, message: 'You need to create your Dapper EmeraldID at https://id.ecdao.org/dapper' };

  // 1. 3+
  const roleIds = ['980633744966819930'];

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

  // 1. Holder, 2. Whale, 3. Jock, 4. Geek, 5. Prep, 6. Freak
  const roleIds = ['961353472328994826', '958216670218965094', '979841797608050688', '979842660393185330', '979842799451140166', '979841981381480519'];

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

  // 1. 3 Cool Cats, 2. All 30 Cool Cats
  const roleIds = ['922504964662771822', '922523238762950696'];

  const args = [
    fcl.arg(user, t.Address),
    fcl.arg(roleIds, t.Array(t.String))
  ]
  return await executeScript(scriptCode, args);
}

const Driverz = async (emeraldIds) => {
  const scriptCode = holdingScripts['Driverz'];
  const user = emeraldIds["dapper"];
  if (!user) return { error: true, message: 'You need to create your Dapper EmeraldID at https://id.ecdao.org' };

  // 1. 1, 2. 5, 3. 15
  const roleIds = ['981264736098344970', '981264841660579951', '981264946530754654'];

  const args = [
    fcl.arg(user, t.Address),
    fcl.arg(roleIds, t.Array(t.String))
  ]
  return await executeScript(scriptCode, args);
}

const Genies = async (emeraldIds) => {
  const scriptCode = holdingScripts['Genies'];
  const user = emeraldIds["dapper"];
  if (!user) return { error: true, message: 'You need to create your Dapper EmeraldID at https://id.ecdao.org' };

  const roleIds = [
    // Lucid Tokyo Holder
    '981662081243811911',
  ];

  const args = [
    fcl.arg(user, t.Address),
    fcl.arg(roleIds, t.Array(t.String))
  ];

  return await executeScript(scriptCode, args);
}

const NFW = async (emeraldIds) => {
  const scriptCode = holdingScripts['NFW'];

  const roleIds = [
    '982024446627954739', // Driverz
    '982023267017719808', // Flunks
    '982024121745551400', // .find
    '982024358694354964', // bl0x
    '982095721534726184', // GOOBz
    '982097954397630504', // EmeraldID
    '983106203670413323', // Piggos
    '983106282447859722', // Crypto Pharaohs
    '983106476157579334', // Arlequin 
    '983119676806680607', // Epix
    '983119759862296648', // Enemy Metal
    '983120167989035008', // SNKRHUD,
    '983493329226436638' // Flovatar
  ];

  const dapperArgs = [
    fcl.arg(emeraldIds["dapper"], t.Address),
    fcl.arg(roleIds, t.Array(t.String))
  ]
  const bloctoArgs = [
    fcl.arg(emeraldIds["blocto"], t.Address),
    fcl.arg(roleIds, t.Array(t.String))
  ]
  let dapper = await executeScript(scriptCode, dapperArgs);
  let blocto = await executeScript(scriptCode, bloctoArgs);
  if (blocto.error) {
    blocto = [];
  }
  if (dapper.error) {
    dapper = [];
  }
  return dapper.concat(blocto.filter((item) => dapper.indexOf(item) < 0));
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
  IXLabs,
  NFL,
  Driverz,
  Genies,
  NFW
}

module.exports = {
  entities
}