const TestController = require('./../controllers/testController');
const ResponceStatusCodeDecorator = require('../decorators/responceDecorator');

module.exports = [
  {
    method: 'post',
    path: '/api/v3/test',
    middleware: async (req, res) => {
      const errDescr = [
        {
          code: 400,
          messages: ['smth undef', 'smth else undef'],

        },
        {
          code: 401,
          messages: ['authorization failed']
        },
        {
          code: 500,
          messages: ['msg1', 'msg2']
        },
      ];

      const testEndPoint = ResponceStatusCodeDecorator.handleErrors(TestController.testEndPoint, errDescr);

      let resObj = await testEndPoint(req, res);

      res
        .status(resObj.code)
        .send(resObj.body)
    }
  }];