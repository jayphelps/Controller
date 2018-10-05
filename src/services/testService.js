
/*
*  *******************************************************************************
*  * Copyright (c) 2018 Edgeworx, Inc.
*  *
*  * This program and the accompanying materials are made available under the
*  * terms of the Eclipse Public License v. 2.0 which is available at
*  * http://www.eclipse.org/legal/epl-2.0
*  *
*  * SPDX-License-Identifier: EPL-2.0
*  *******************************************************************************
*
*/

const TranSactionDecorator = require('../decorators/transactionDecorator');
const UserManager = require('../sequelize/managers/userManager');

async function _doSmth(x, user, transaction) {
  console.log(transaction);
  console.log(x);
  let t = await UserManager.findByAccessToken('ttt', transaction);
  let u1 = await UserManager.create({id:2, firstName: 'u1'}, transaction);
  let u2 = await UserManager.create({id:3, firstName: 'u2'}, transaction);
  console.log(t.email);
  // let res = await longFunction(x);
  return t;
}

const doSmthWithTransaction = TranSactionDecorator.generateTransaction(_doSmth);

module.exports = {
  doSmthWithTransaction : doSmthWithTransaction,
};

