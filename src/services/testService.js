
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

const models = require('./../sequelize/models');
const User = models.User;

async function _doSmth(x, user, transaction) {
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

