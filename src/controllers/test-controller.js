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

const TestService = require('./../services/test-service');
const AuthDecorator = require('./../decorators/authorization-decorator');

async function _testEndPoint(req, user) {
  //getting req params
  let params = {};
  params.bodyParams = req.body;

  //calling service function. always only one!
  return await TestService.doSmthWithTransaction(1, user);
}

const testEndPoint = AuthDecorator.checkAuthToken(_testEndPoint);

module.exports = {
  testEndPoint: testEndPoint
};