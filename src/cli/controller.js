/*
 * *******************************************************************************
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

const BaseCLIHandler = require('./base-cli-handler');
const constants = require('../helpers/constants');
const ControllerService = require('../services/controller-service');
const logger = require('../logger');
const AppHelper = require('../helpers/app-helper');



class Controller extends BaseCLIHandler {
  constructor() {
    super();

    this.name = constants.CMD_CONTROLLER;
    this.commandDefinitions = [
      {
        name: 'command',
        defaultOption: true,
        description: 'status, email-activation, fog-types, version',
        group: constants.CMD
      }
    ];
    this.commands = {
      [constants.CMD_STATUS]: 'Display iofog-controller service status.',
      [constants.CMD_EMAIL_ACTIVATION]: 'Is email activation.',
      [constants.CMD_FOG_TYPES]: 'List all Fog-types.',
      [constants.CMD_VERSION]: 'Display iofog-controller service version.',
    }
  }

  async run(args) {
    try {
      const controllerCommand = this.parseCommandLineArgs(this.commandDefinitions, {argv: args.argv, partial: false});

      const command = controllerCommand.command.command;

      AppHelper.validateParameters(command, this.commandDefinitions, args.argv);

      switch (command) {
        case constants.CMD_STATUS:
          await _executeCase(controllerCommand, constants.CMD_STATUS, _getStatus, false);
          break;
        case constants.CMD_EMAIL_ACTIVATION:
          await _executeCase(controllerCommand, constants.CMD_EMAIL_ACTIVATION, _emailActivation, false);
          break;
        case constants.CMD_FOG_TYPES:
          await _executeCase(controllerCommand, constants.CMD_FOG_TYPES, _getFogTypes, false);
          break;
        case constants.CMD_VERSION:
          await _executeCase(controllerCommand, constants.CMD_VERSION, _getVersion, false);
          break;
        case constants.CMD_HELP:
        default:
          return this.help([constants.CMD_LIST])
      }
    } catch (error) {
      AppHelper.handleCLIError(error);
    }
  }

}

const _executeCase = async function (userCommand, commandName, f, isUserRequired) {
  try {
    const item = userCommand[commandName];

    if (isUserRequired) {
      const decoratedFunction = AuthDecorator.prepareUserByEmail(f);
      await decoratedFunction(item);
    } else {
      await f(item);
    }
  } catch (error) {
    logger.error(error.message);
  }
};


const _getStatus = async function () {
  const response = await ControllerService.statusController(true);
  logger.info(JSON.stringify(response, null, 2));
};

const _emailActivation = async function () {
  const response = await ControllerService.emailActivation(true);
  logger.info(JSON.stringify(response, null, 2));
};

const _getFogTypes = async function () {
  const response = await ControllerService.getFogTypes(true);
  logger.info(JSON.stringify(response, null, 2));
};

const _getVersion = async function () {
  const response = await ControllerService.getVersion(true);
  logger.info(response, null, 2);
};

module.exports = new Controller();