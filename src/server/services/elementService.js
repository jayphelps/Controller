import ElementManager from '../managers/elementManager';
import AppUtils from '../utils/appUtils';
import ElementImageService from "./elementImageService";

const createElement = function(props, params, callback) {
  ElementManager
    .create(props.element)
    .then(AppUtils.onCreate.bind(null, params, props.setProperty, 'Unable to create Element object.', callback));
}

const deleteElementById = function(props, params, callback) {
  let elementId = AppUtils.getProperty(params, props.elementId);

  ElementManager
    .deleteElementById(elementId)
    .then(AppUtils.onDelete.bind(null, params, 'Unable to delete Element', callback));
}

const getElementDetails = function(props, params, callback) {
  let elementId = AppUtils.getProperty(params, props.elementId);

  let imageProps = {
      elementId: 'ID',
      setProperty: 'elementImages'
  };

  ElementManager
    .getElementDetails(elementId)
    .then(ElementImageService.addImagesForElement.bind(null, imageProps))
    .then(AppUtils.onFind.bind(null, params, props.setProperty, 'Unable to find Element details', callback));
}

const findElementImageAndRegistryByIdForFogInstance = function(props, params, callback) {
  let elementId = AppUtils.getProperty(params, props.elementId);
  let fogId = AppUtils.getProperty(params, props.instanceId);

  ElementManager
    .findElementImageAndRegistryByIdForFogInstance(elementId, fogId)
    .then(AppUtils.onFind.bind(null, params, props.setProperty, 'Unable to find Element Image or Registry for Element with id ' + elementId + ' and Fog with id ' + fogId, callback));
}

const getElementCatalog = function(props, params, callback) {
  let imageProps = {
      elementId: 'ID',
      setProperty: 'elementImages'
  };

  ElementManager
    .getElementCatalog()
    .then(ElementImageService.addImagesForElements.bind(null, imageProps))
    .then(AppUtils.onFind.bind(null, params, props.setProperty, 'Error: Element catalog not found', callback));
}

const getElementForPublish = function(props, params, callback) {
  let imageProps = {
      elementId: 'ID',
      setProperty: 'elementImages'
  };
  ElementManager
    .getElementForPublish()
    .then(ElementImageService.addImagesForElements.bind(null, imageProps))
    .then(AppUtils.onFind.bind(null, params, props.setProperty, 'Error: Element catalog not found', callback));
}

const getNetworkElement = function(props, params, callback) {
  let networkElementId = AppUtils.getProperty(params, props.networkElementId);

  ElementManager
    .findElementById(networkElementId)
    .then(AppUtils.onFind.bind(null, params, props.setProperty, 'Unable to find Element object with id ' + networkElementId, callback));
}

const updateElement = function(props, params, callback) {
  let elementId = AppUtils.getProperty(params, props.elementId);

  ElementManager
    .updateElementById(elementId, props.updatedElement)
    .then(AppUtils.onUpdate.bind(null, params, 'Unable to update Element object', callback));
}

export default {
  createElement: createElement,
  deleteElementById: deleteElementById,
  findElementImageAndRegistryByIdForFogInstance: findElementImageAndRegistryByIdForFogInstance,
  getElementCatalog: getElementCatalog,
  getElementDetails: getElementDetails,
  getElementForPublish: getElementForPublish,
  getNetworkElement: getNetworkElement,
  updateElement: updateElement
};