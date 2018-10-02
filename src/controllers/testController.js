const TestService = require('./../services/testService');
const AuthDecorator = require('./../decorators/authorizationDecorator');

async function _testEndPoint(req, res) {
  //getting req params
  let params = {};
  params.bodyParams = req.body;

  //calling service function. always only one!
  return await TestService.doSmth(1);
}

const testEndPoint = AuthDecorator.checkUserExistance(_testEndPoint);

module.exports = {
  testEndPoint: testEndPoint
};