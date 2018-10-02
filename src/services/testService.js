const models = require('./../sequelize/models');
const User = models.User;

async function _doSmth(x, transaction) {
  console.log(transaction);
  console.log(x);
  let t = await User.findAll();
  console.log(t[0].email);
  // let res = await longFunction(x);
  return t;
}

module.exports = {
  doSmth : _doSmth
};
