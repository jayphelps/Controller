import logger from "../../utils/winstonLogs";
import async from "async";
import ChangeTrackingService from "../../services/changeTrackingService";
import AppUtils from "../../utils/appUtils";
import FogUserService from "../../services/fogUserService";
import UserService from "../../services/userService";
import FogService from "../../services/fogService";
import FogAccessTokenService from "../../services/fogAccessTokenService";
import ElementInstanceService from "../../services/elementInstanceService";
import ElementService from "../../services/elementService";
import DataTracksService from "../../services/dataTracksService";
import ElementInstanceConnectionsService from "../../services/elementInstanceConnectionsService";


const setupCustomer = function (req, res) {
    logger.info("Endpoint hit: " + req.originalUrl);
    let params = {},
        wifiDataGeneratorProps = {
            elementName: 'bodyParams.wifiDataGeneratorElementName',
            elementInstanceName: 'bodyParams.wifiDataGeneratorElementInstanceName',
            fogInstanceId: 'bodyParams.macAddress',
            userId: 'oroAdmin.id',
            logSize: 'bodyParams.wifiDataGeneratorLogSize',
            config: 'bodyParams.wifiDataGeneratorConfig',
            volumeMappings: 'bodyParams.wifiDataGeneratorVolumeMappings',
            elementSetProperty: 'wifiDataGeneratorElement',
            setProperty: 'wifiDataGeneratorElementInstance'
        },
        linksOro = [
            {
                fromElement: 'wifiDataGeneratorElementInstance',
                toElement: 'oroDataReceiver',
                fromFog: 'fogInstance',
                toFog: 'rootFog',
                fromFogNetworkingElementKey: 'bodyParams.x86NetworkingElementKey',
                toFogNetworkingElementKey: 'bodyParams.x86NetworkingElementKey'
            }

        ];
    params.bodyParams = req.body;
    params.bodyParams.oroEmail = 'oro@oro.oro';
    params.bodyParams.oroTrackName = 'oro track';
    params.bodyParams.rootElement = 'Wifi data receiver';
    params.bodyParams.rootElementInstanceName = 'oro data receiver';
    params.bodyParams.wifiDataGeneratorElementName = 'Wifi data generator';
    params.bodyParams.wifiDataGeneratorElementInstanceName = params.bodyParams.wifiDataGeneratorElementName
        + ' ' + params.bodyParams.macAddress;
    params.bodyParams.wifiDataGeneratorLogSize = 10;
    params.bodyParams.wifiDataGeneratorConfig = '{"customerId": "' + params.bodyParams.customerId + '" }';
    params.bodyParams.wifiDataGeneratorVolumeMappings = '{"volumemappings": [{"hostdestination": "' + params.bodyParams.wifiPath + '", "containerdestination": "/wifi/data", "accessmode": "ACCESS MODE"}]}';


    params.bodyParams.x86NetworkingElementKey = 1;


    async.waterfall([
        async.apply(prepareOroConstants, params),
        async.apply(createOroFog),
        async.apply(createOroElementInstance, wifiDataGeneratorProps),
        async.apply(linkOroElementsInstances, linksOro)
    ], function (err, result) {
        AppUtils.sendResponse(res, err, "tokenData", params.newAccessToken, result)
    });
};

const prepareOroConstants = function (params, callback) {
    let oroUserProps = {
            email: 'bodyParams.oroEmail',
            setProperty: 'oroAdmin'
        },
        rootElementInstanceProps = {
            userId: 'oroAdmin.id',
            trackId: 'trackData.id',
            elementName: 'bodyParams.rootElementInstanceName',
            setProperty: 'oroDataReceiver'
        },
        trackProps = {
            trackName: 'bodyParams.oroTrackName',
            userId: 'oroAdmin.id',
            setProperty: 'trackData'
        };

    async.waterfall([
        async.apply(UserService.getUserByEmail, oroUserProps, params),
        async.apply(DataTracksService.getDataTrackByNameAndUserId, trackProps),
        async.apply(ElementService.getElementByNameForUser, elementProps),
        async.apply(ElementInstanceService.getElementInstanceByNameOnTrackForUser, rootElementInstanceProps),
    ], function (err, result) {
        if (err) {
            callback(err, result)
        } else {
            callback(null, params)
        }
    });
};

const createOroFog = function (params, callback) {
    let oroFogProps = {
            uuid: 'bodyParams.macAddress',
            name: 'bodyParams.macAddress',
            fogType: 'bodyParams.fogType',
            setProperty: 'fogInstance'
        },

        oroFogUserProps = {
            userId: 'oroAdmin.id',
            instanceId: 'fogInstance.uuid',
            setProperty: null
        },
        oroChangeTrackingProps = {
            fogInstanceId: 'fogInstance.uuid',
            setProperty: null
        },
        saveFogAccessTokenProps = {
            userId: 'oroAdmin.id',
            fogId: 'fogInstance.uuid',
            expirationTime: 'tokenData.expirationTime',
            accessToken: 'tokenData.accessToken',
            setProperty: 'newAccessToken'
        };

    async.waterfall([
        async.apply(FogService.createFogInstanceWithUUID, oroFogProps, params),
        async.apply(ChangeTrackingService.createFogChangeTracking, oroChangeTrackingProps),
        async.apply(FogUserService.createFogUser, oroFogUserProps),

        async.apply(FogAccessTokenService.generateAccessToken),
        async.apply(FogAccessTokenService.deleteFogAccessTokenByFogId, oroFogProps),
        async.apply(FogAccessTokenService.saveFogAccessToken, saveFogAccessTokenProps),
    ], function (err, result) {
        if (err) {
            callback(err, result)
        } else {
            callback(null, params)
        }
    });
};

const createOroElementInstance = function (props, params, callback) {
    let elementInstanceProps = {
            userId: 'oroAdmin.id',
            trackId: 'trackData.id',
            name: props.elementInstanceName,
            fogInstanceId: props.fogInstanceId,
            logSize: props.logSize,
            config: props.config,
            volumeMappings: props.volumeMappings,
            element: props.elementSetProperty,
            setProperty: props.setProperty
        },
        elementProps = {
            userId: props.userId,
            elementName: props.elementName,
            setProperty: props.elementSetProperty
        };

    async.waterfall([
        async.apply(ElementService.getElementByNameForUser, elementProps, params),
        async.apply(ElementInstanceService.createElementInstance, elementInstanceProps),
    ], function (err, result) {
        if (err) {
            callback(err, result)
        } else {
            callback(null, params)
        }
    });
};

const linkOroElementsInstances = function (linksArr, params, callback) {
    linksArr.forEach( (pair) => {
        let newElementInstanceConnectionProps = {
                newConnectionObj: {
                    sourceElementInstance: AppUtils.getProperty(params, pair.fromElement + '.uuid'),
                    destinationElementInstance: AppUtils.getProperty(params, pair.toElement + '.uuid')
                },
                setProperty: 'newElementInstanceConnection'
            },
            newRouteProps = {
                pubFogNetworkingElementKey: pair.fromFogNetworkingElementKey,
                destFogNetworkingElementKey: pair.toFogNetworkingElementKey,
                publishingFogInstance: pair.fromFog,
                destinationFogInstance: pair.toFog,
                publishingElement: pair.fromElement,
                destinationElement: pair.toElement
            };
        async.waterfall([
            async.apply(ElementInstanceConnectionsService.createElementInstanceConnection, newElementInstanceConnectionProps, params),
            async.apply(createNetworking, newRouteProps)
        ], function (err, result) {
            if (err) {
                callback(err, result)
            } else {
                callback(null, params)
            }
        });
    });

};

export default {
    setupCustomer: setupCustomer
}