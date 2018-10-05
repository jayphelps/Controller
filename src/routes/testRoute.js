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

const TestController = require('./../controllers/testController');
const ResponseDecorator = require('../decorators/responseDecorator');
const Errors = require('../utils/errors');

module.exports = [
  {
    method: 'post',
    path: '/api/v3/test',
    middleware: async (req, res) => {
      const errDescr = [
        {
          code: 400,
          errors: [],

        },
        {
          code: 401,
          errors: [Errors.AuthenticationError]
        },
        {
          code: 500,
          errors: []
        },
      ];

      const testEndPoint = ResponseDecorator.handleErrors(TestController.testEndPoint, 200, errDescr);

      let resObj = await testEndPoint(req);

      res
        .status(resObj.code)
        .send(resObj.body)
    }
  }];