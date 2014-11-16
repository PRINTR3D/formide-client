var config = {
    params: { enableDebugging:"1", disableContextMenu: true }
};
var u = new UnityObject2(config);
var DEBUG = true;

$(function() {
    var $missingScreen = $("#unityPlayer").find(".missing");
    var $brokenScreen = $("#unityPlayer").find(".broken");
    $missingScreen.hide();
    $brokenScreen.hide();
	$.support.cors = true;

    u.observeProgress(function (progress) {
        switch(progress.pluginStatus) {
            case "broken":
                $brokenScreen.find("a").click(function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    u.installPlugin();
                    return false;
                });
                $brokenScreen.show();
                break;
            case "missing":
                $missingScreen.find("a").click(function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    u.installPlugin();
                    return false;
                });
                $missingScreen.show();
                break;
            case "installed":
                $missingScreen.remove();
                break;
            case "first":
                break;
        }
    });
    u.initPlugin(jQuery("#unityPlayer")[0], "Web.unity3d");
});

var ViewerCall = function(){
    var callbacks = [];
    var currentCallbackID = 0;
	this.getCallbacks = function(){
		return callbacks;
	}
    this.addCallback = function(callback){
        ++currentCallbackID;
        while(currentCallbackID in callbacks){
            ++currentCallbackID;
        }
		if(callback === undefined)
			callback = function(){};
        callbacks[currentCallbackID] = callback;
		if(DEBUG)
			console.log('ID ' + currentCallbackID + ' added to callbacks');
        return currentCallbackID;
    };
    this.getCallback = function(id){
        returnValue = callbacks[id];
        delete callbacks[id];
        return returnValue;
    };
    this.models = [];
    this.addToModelList = function(viewerId, id, hash) {
        this.models[viewerId] = {
            'id': id,
            'hash': hash
        };
    };

    this.removeFromModelList = function(viewerId){
        delete this.models[viewerId];
    };

	this.mmToInch = function(millimeters){
		return millimeters * 0.0393700787;
	}

	this.mmFromInch = function(inches){
		return inches * 25.4;
	}

};
var vc = new ViewerCall();
/*Personalization
 *
 *These calls allow customization of the surroundings of the model.
 *
 */

/*Set the background color of the viewer.
 * r = value for red 0-255, g = value for red 0-255 b = value for red 0-255
 * callback:
 *		status: done/fail,
 *		code: 200/400 or 101 on formulation error
 *		message: explanatory message
 */
ViewerCall.prototype.setBackgroundColor = function(r, g, b, callback){
    var callbackID = vc.addCallback(callback);
    u.getUnity().SendMessage('Personalizer', 'SetBackgroundColor', [r, g, b, callbackID]);
}

/*Set the light color of the viewer.
 * r = value for red 0-255, g = value for red 0-255 b = value for red 0-255
 * callback:
 *		status: done/fail,
 *		code: 200/400 or 101 on formulation error
 *		message: explanatory message
 */
ViewerCall.prototype.setLightColor = function(r, g, b, callback){
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('Personalizer', 'SetLightColor', [r, g, b, callbackID]);
}

/*Control
 *
 *These calls allow customization of the feel of control.
 *
 */

/*Set the drag animation speed.
* s = speed, good values are in the rang of 10-20 (float)
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setDragAnimationSpeed = function(s, callback){
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('Control', 'SetSmoothMoveSpeed', [s, callbackID]);
}

/*Use inches of millimeters
* useInches = true for inches, false for millimeters(default) (bool)
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.useInches = function(useInches, callback){
    var callbackID = vc.addCallback(callback);
    if (useInches) useInches = 'True';
    else useInches = 'False';
    u.getUnity().SendMessage('Control', 'SetUseInches', [useInches, callbackID]);
}

/*Show rulers
* showruler = true for show, false for don't show (bool)
  type - "position" or "scale"(string)
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.showRulers = function(show, type, callback){
    var callbackID = vc.addCallback(callback);
    if (show) show = 'True';
    else show = 'False';
    u.getUnity().SendMessage('Control', 'SetShowRulers', [show, type, callbackID]);
}

/*Allow interpolation in move and scale
* smooth = true/false
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.enableSmoothAnimation = function(smooth, callback){
    var callbackID = vc.addCallback(callback);
    if (smooth) smooth = 'True';
    else smooth = 'False';
    u.getUnity().SendMessage('Control', 'EnableSmoothAnimation', [smooth, callbackID]);
}

/*Set fullscreen
* enable = true/false, will only work when the viewer has focus (add on screen button?)
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setFullscreen = function(enable, callback){
    var callbackID = vc.addCallback(callback);
    if (enable) enable = 'True';
    else enable = 'False';
    u.getUnity().SendMessage('Control', 'SetFullscreen', [enable, callbackID]);
}

/*Set the zoom (mousewheel) speed.
* s = speed, good values are in the range of 0.1-0.5 (float). Use negative values to invert.
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setCameraZoomSpeed = function (s, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('Control', 'SetZoomSpeed', [s, callbackID]);
}

/*Enables idle rotation
* rotate: enable idle rotate (bool)
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setIdleRotation = function (rotate, callback) {
    if (rotate) rotate = 'True';
    else rotate = 'False';
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('CameraManager', 'SetIdleRotation', [rotate, callbackID]);
}

/*Sets idle rotation timeout
* timeout in seconds (float)
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setIdleRotationTimeout = function (timeout, callback) {

    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('CameraManager', 'SetIdleRotationTimeout', [timeout, callbackID]);
}
/*Center on the average model position
* center: enable centering
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.centerOnModels = function (center, callback) {
    if (center) center = 'True';
    else center = 'False';
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('CameraManager', 'CenterOnModelsJS', [center, callbackID]);
}

/*Oh la la, allows viewing the models bottom
* allow: enable viewing the bottom
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.allowBottomViewing = function (allow, callback) {
    if (allow) allow = 'True';
    else allow = 'False';
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('CameraManager', 'AllowBottomViewing', [allow, callbackID]);
}

/*Show the virtual grids when transforming.
* show = show grids (bool).
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.showVirtualGrid = function (show, callback) {
    var callbackID =  vc.addCallback(callback);
	if (show) show = 'True';
    else show = 'False';
    u.getUnity().SendMessage('Control', 'SetShowVirtualGrid', [show, callbackID]);
}

/*Set selection highlight intensity
* smooth = true/false
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setSelectionIntensity = function(intensity, callback){
    var callbackID = vc.addCallback(callback);
    u.getUnity().SendMessage('Control', 'SetHightlightIntensity', [intensity, callbackID]);
}

/*Set the camera rotation.
* d, the location of the camera
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setCameraRotation = function (s, callback) {
    var callbackID = vc.addCallback(callback);
    u.getUnity().SendMessage('CameraManager', 'SetRotation', [s, callbackID]);
}

/*Set the camera zoom in mm to center.
* s Zoom in mm.
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setCameraZoom = function (s, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('CameraManager', 'SetZoom', [s, callbackID]);
}

/*Add to the camera rotation.
* s, add rotation
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.addCameraRotation = function (s, callback) {
    var callbackID = vc.addCallback(callback);
    u.getUnity().SendMessage('CameraManager', 'AddRotation', [s, callbackID]);
}

/*Add to the camera zoom in mm to center.
*  s, Add camera zoom in mm
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.addCameraZoom = function (s, callback) {
    var callbackID = vc.addCallback(callback);
    u.getUnity().SendMessage('CameraManager', 'AddZoom', [s, callbackID]);
}



/*Object
 *
 *These calls allow addition and modification of objects.
 *
 */

/*Get the currently selected object viewer ID.
* s = speed, good values are around 1.0 (float) Use negative values to invert.
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*       modelID: the viewer ID, or -1 when no item is selected
*/
ViewerCall.prototype.getSelectedModel = function (callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'GetSelectedModel', [callbackID]);
}

/*Get the currently selected object viewer ID.
* id = api model id
* hash = api model hash
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*       modelID: the viewer ID, or -1 when no item is selected
*
* NOTE: An array of all objects is already available at the array ViewerCall.models
*/
ViewerCall.prototype.addModel = function (id, hash, callback) {
    var callbackID = vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'AddModelJS', [id, hash, callbackID]);
}

ViewerCall.prototype.zoomToFit = function(callback){
    var callbackID = vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'ZoomToFit', [callbackID]);
}

ViewerCall.prototype.zoomToFitModel = function(viewerId, callback){
    var callbackID = vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'ZoomToFitModel', [viewerId, callbackID]);
}

/*Removes the model by id.
* id = viewer model id
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*
* NOTE: An array of all objects is already availabled at the array ViewerCall.models
*/
ViewerCall.prototype.removeModel = function (id, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'RemoveModel', [id, callbackID]);
}

/*Removes all models from the scene.
* id = viewer model id
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*       removedIds: all removed object ids
* NOTE: An array of all objects is already available at the array ViewerCall.models
*/
ViewerCall.prototype.removeAllModels = function (callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'RemoveAllModels', [callbackID]);
}

/*Set Model Color.
* id = viewer model id
* r = value for red 0-255, g = value for red 0-255 b = value for red 0-255
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setModelColor = function (id, r, g, b, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'SetModelColor', [id, r, g, b, callbackID]);
}

/*Set model position, this has a smooth animation, if smooth is enabled.
* id = viewer model id
* x y z = position from the origin (lower left front) (float)
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setModelTargetPosition = function (id, x, y, z, callback) {
    var callbackID = vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'SetModelTargetPosition', [id, x, y, z, callbackID]);
}

/*Set model position
* id = viewer model id
* x y z = position from the origin (lower left front) (float)
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setModelPosition = function (id, x, y, z, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'SetModelPosition', [id, x, y, z, callbackID]);
}

/*Set model position, this has a smooth animation, if smooth is enabled.
* id = viewer model id
* x y z = position from the origin (lower left front) (float)
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setModelTargetRotation = function (id, x, y, z, callback) {
    var callbackID = vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'SetModelTargetRotation', [id, x, y, z, callbackID]);
}

/*Set model position
* id = viewer model id
* x y z = position from the origin (lower left front) (float)
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setModelRotation = function (id, x, y, z, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'SetModelRotation', [id, x, y, z, callbackID]);
}

/*Set model local scale, this has a smooth animation, if smooth is enabled.
* id = viewer model id
* x y z = scale in mm (float)
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setModelTargetScale = function (id, x, y, z, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'SetModelTargetScale', [id, x, y, z, callbackID]);
}


/*Set model local scale
* id = viewer model id
* x y z = scale in mm (float)
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setModelScale = function (id, x, y, z, callback) {
    var callbackID = vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'SetModelScale', [id, x, y, z, callbackID]);
}



/*Add translation functionality
* id = viewer model id
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.allowTranslate = function (id, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'AddTranslate', [id, callbackID]);
}

/*Get model as base64
* id = viewer model id
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*		base64stl: base64
*/
ViewerCall.prototype.getModel = function (id, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'GetModelJS', [id, callbackID]);
}

/*Get all models combined as base64. The origin will be the center.
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*		base64stl: base64
*/
ViewerCall.prototype.getModels = function (callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'GetModelsJS', [callbackID]);
}

/*Upload models
* All models as a single stl file
* name = model name
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*		base64stl: base64
*/
ViewerCall.prototype.uploadModels = function (name, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'UploadModelsJS', [name, callbackID]);
}

/*Get model as base64
* name = model name
* id = viewer model id
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*		base64stl: base64
*/
ViewerCall.prototype.uploadModel = function (id, name, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'UploadModelJS', [id, name, callbackID]);
}

/*Recenter given model to printer center
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.recenterModel = function (id, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'RecenterModel', [id, callbackID]);
}

/*Get transform of a given model.
* id the model id
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*		transform:
*			position : x, y ,z position in mm from the origin
*			rotation : x, y ,z rotation in degrees
*			scale : x, y ,z scale in mm
*/
ViewerCall.prototype.getTransform = function (id, callback) {
    var callbackID = vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'GetModelTransform', [id, callbackID]);
}

/*Printer
 *
 *These calls allow modification of the Printer.
 *
 */

/*Set printer grid size
* x y z = size in mm (float)
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setGridSize = function (x, y, z, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('Printer', 'SetGrid', [x, y, z, callbackID]);
}

/*Fade the printer out
* time = time in seconds (float) use 0 for instant
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.fadePrinterOut = function (time, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('Printer', 'FadeOut', [time, callbackID]);
}

/*Fade the printer in
* time = time in seconds (float) use 0 for instant
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.fadePrinterIn = function (time, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('Printer', 'FadeIn', [time, callbackID]);
}

/*Set the printer bed color
* rgbGrid (0-255) color for the grid
* rgbBed (0-255) color for the base
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/

ViewerCall.prototype.setBedColor = function (rGrid, gGrid, bGrid, rBed, gBed, bBed, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('Printer', 'SetBedColor', [rGrid, gGrid, bGrid, rBed, gBed, bBed, callbackID]);
}

/*Set the printer size in mm
* x,y,z size in mm for the printer
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setPrinterSize = function (x, y, z, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('Printer', 'SetPrinterSize', [x, y ,z , callbackID]);
}

/*Set the printer bed height in mm
* x,y,z size in mm for the printer
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setBedHeight = function (x, y, z, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('Printer', 'SetBedHeight', [x, y ,z , callbackID]);
}


/*
 * Get the version and unique hash
 * callback:
 *		status: done/fail,
 *		code: 200/400 or 101 on formulation error
 *		version: a version number, this is not equal to release number
 *      hash: a unique hash to make sure a certain version is used
 */
ViewerCall.prototype.getVersion = function (callback) {
    var callbackID = vc.addCallback(callback);
    u.getUnity().SendMessage('APIManager', 'GetUniqueHash', [callbackID]);
}


/*Add attachment point to model
* modelId: the viewer model id
* x, y, z: position
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*		data: attachmentId, viewerModelId (same as given)
*/
ViewerCall.prototype.addAttachmentPoint = function (modelId, x, y, z, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'AddAttachmentPointJS', [modelId, x, y, z, callbackID]);
}

/*Get attachment point of a model
* modelId: the viewer model id
* attachmentId: the local attachment id
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*		data: object containing the local transform, and all submodels with transforms ids. hashes, colors
*/
ViewerCall.prototype.getAttachmentPoint = function (modelId, attachmentId, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'GetAttachmentPointJS', [modelId, attachmentId, callbackID]);
}

/*Get all attachment points of a model
* modelId: the viewer model id
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*		data: object containing all attachment points with their ides, their local transform, and all their submodels with transforms ids. hashes, colors
*/
ViewerCall.prototype.getAttachmentPoints = function (modelId, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'GetAttachmentPointsJS', [modelId, callbackID]);
}

/*Remove an attachment point from a model
* modelId: the viewer model id
* attachmentId: the local attachment id
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.removeAttachmentPoint = function (modelId, attachmentId, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'RemoveAttachmentPointJS', [modelId, attachmentId, callbackID]);
}

/*Remove an attachment point model from an attachment point
* modelId: the viewer model id
* attachmentId: the local attachment id
* apModelId: the local AttachmentPointModel id
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.removeAttachmentPointModel = function (modelId, attachmentId, attachmentModelId, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'RemoveAPModelJS', [modelId, attachmentId, attachmentModelId, callbackID]);
}

/*Set attachment position
* modelId: the viewer model id
* attachmentId
* x, y, z: position
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setAttachmentPosition = function (modelId, attachmentId, x, y, z, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'SetAttachmentPositionJS', [modelId, attachmentId, x, y, z, callbackID]);
}

/*Set attachment scale
* modelId: the viewer model id
* attachmentId
* x, y, z: scale
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setAttachmentScale = function (modelId, attachmentId, x, y, z, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'SetAttachmentScaleJS', [modelId, attachmentId, x, y, z, callbackID]);
}

/*Set attachment rotation
* modelId: the viewer model id
* attachmentId
* x, y, z: rotation
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setAttachmentRotation = function(modelId, attachmentId, x, y, z, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'SetAttachmentRotationJS', [modelId, attachmentId, x, y, z, callbackID]);
}

/*Show attachment pivot
* modelId: the viewer model id
* attachmentId
* doShow (bool)
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.showAttachmentPivot = function(modelId, attachmentId, doShow, callback){
    var callbackID = vc.addCallback(callback);
    if (doShow) doShow = 'True';
    else doShow = 'False';
    u.getUnity().SendMessage('ObjectManager', 'ShowAttachmentPivotJS', [modelId, attachmentId, doShow, callbackID]);
}

/*Show all attachment pivots
* modelId: the viewer model id
* doShow (bool)
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.showAttachmentPivots = function(modelId, doShow, callback){
    var callbackID = vc.addCallback(callback);
    if (doShow) doShow = 'True';
    else doShow = 'False';
    u.getUnity().SendMessage('ObjectManager', 'ShowAttachmentPivotsJS', [modelId, doShow, callbackID]);
}

/*Add attachment model
* modelId: the viewer model id
* attachmentId
* id
* hash
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*		data:
*			attachmentModelId
*/
ViewerCall.prototype.addModelToAttachmentPoint = function(modelId, attachmentId, id, hash, callback){
    var callbackID = vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'AddModelToAttachmentPoint', [modelId, attachmentId, id, hash, callbackID]);
}

/*Set attachment model position offset
* modelId: the viewer model id
* attachmentId
* attachmentModelId
* x, y, z: position
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setAttachmentModelPosition = function (modelId, attachmentId, attachmentModelId, x, y, z, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'SetAPModelOffsetPosition', [modelId, attachmentId, attachmentModelId, x, y, z, callbackID]);
}

/*Activate attachmentModel
* modelId: the viewer model id
* attachmentId
* attachmentModelId
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setActiveAttachmentModel = function(modelId, attachmentId, attachmentModelId, callback){
    var callbackID = vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'SetActiveAttachmentModelJS', [modelId, attachmentId, attachmentModelId, callbackID]);
}
/*Set attachment model scale offset
* modelId: the viewer model id
* attachmentId
* attachmentModelId
* x, y, z: scale
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setAttachmentModelScale = function (modelId, attachmentId, attachmentModelId, x, y, z, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'SetAPModelOffsetScale', [modelId, attachmentId, attachmentModelId, x, y, z, callbackID]);
}

/*Set attachment model rotation offset
* modelId: the viewer model id
* attachmentId
* attachmentModelId
* x, y, z: rotation
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setAttachmentModelRotation = function (modelId, attachmentId, attachmentModelId, x, y, z, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'SetAPModelOffsetRotation', [modelId, attachmentId, attachmentModelId, x, y, z, callbackID]);
}

/*Set attachment model color
* modelId: the viewer model id
* attachmentId
* attachmentModelId
* r, g, b: color (0-255)
* callback:
*		status: done/fail,
*		code: 200/400 or 101 on formulation error
*		message: explanatory message
*/
ViewerCall.prototype.setAttachmentModelColor = function (modelId, attachmentId, attachmentModelId, r, g, b, callback) {
    var callbackID =  vc.addCallback(callback);
    u.getUnity().SendMessage('ObjectManager', 'SetAPModelColorJS', [modelId, attachmentId, attachmentModelId, r, g, b, callbackID]);
}

ViewerCall.prototype.cycleActiveAttachmentModel = function (modelId, attachmentId, direction, callback) {
	var callbackID = vc.addCallback(callback);
	vc.getAttachmentPoint(modelId, attachmentId, function(response) {
		var ap = JSON.parse(response);
		var nrOfModels = ap.data.models.length;
		var next = ap.data.activeModel + direction;
		console.log(next);
		if(next > nrOfModels) {
			next = 1;
		}
		else if(next < 1) {
			next = nrOfModels;
		}
		console.log(next);
		vc.setActiveAttachmentModel(modelId, attachmentId, next);
	});
}

function unity_api_call(url, accessToken, type, id, parameters) {
	
	params = JSON.parse(parameters);
	console.log(params);
	
	if(url.indexOf('download')>=0) {
		$.ajax({
		    url: "/download?hash=" + params.hash,
		    dataType: 'text',
		    beforeSend: function (xhr) {
		        xhr.overrideMimeType("text/plain; charset=x-user-defined");
		    }
		}).done(function (data) {
			u.getUnity().SendMessage('APIManager', 'APICallback', new Array('done', id, data));
			return;
		});
		return;
	}

    if(accessToken)
        params['access_token'] = accessToken;
    if(type != 'GET' && type != 'POST'){
        params['_method'] = type;
    }else if(type == 'GET'){
        var i = false;
        Object.keys(params).forEach(function (key) {
            if(!i){
                url += '?' + key + '=' + params[key];
            }else{
                url += '&' + key + '=' + params[key];
            }
        });
    }
    if (DEBUG)
    console.log({
        url: url,
        type: (type == 'GET') ? 'GET' : 'POST',
        data: (type != 'GET') ? params : undefined
    })
    $.ajax({
        xhr: function() {
            var xhr = new window.XMLHttpRequest();
			xhr.overrideMimeType("text/plain; charset=x-user-defined"); //FF test
            xhr.upload.addEventListener("progress", function(evt) {
                if (evt.lengthComputable) {
                    var percentComplete = -1 + (evt.loaded / evt.total);
                    u.getUnity().SendMessage('APIManager', 'APICallback', new Array('progress', id, percentComplete));
                }
           	}, false);

            xhr.addEventListener(progress, function(evt) {
               if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total;
                   u.getUnity().SendMessage('APIManager', 'APICallback', new Array('progress', id, percentComplete));
             	}
            }, false);

           return xhr;
    	},
        url: url,
		type: (type=='GET')?'GET':'POST',
        dataType: 'text',
        data: (type != 'GET') ? params : undefined,
		//beforeSend: function (xhr) { //FF test woks for me (siewar) but might be problematic in jquery 1.5.1+
        //  xhr.overrideMimeType("text/plain; charse=-user-defined");
        //}
    }).done(function(data) {
        if (DEBUG)
        console.log({
           stats: 'done',
           id: id,
           data: data
        })
		u.getUnity().SendMessge('APIManager', 'APICallback', new Array('done', id, data));
    }).fail(function(data) {
      if (DEBUG)
        console.log({
          stats: 'fail',
          id: id,
        })
       u.getUnity().SendMessage('APIManager', 'APICallback', new Array('fail', id))
    });
}

function unity_api_loaded() {
    if(DEBUG) {
        u.getUnity().SendMessage('MessageLog', 'LogDeb', 'True');
        console.log("api loaded");
    }

	if(window.location.host != 'locahost') {
		u.getUnity().SendMessage('APIManager', 'Setup', ['http://formide.com/api/v1/', '3069kuHCj3vrsifRjf76TyHyzJZqXaFslzn5D']);
	}
	else {
		u.getUnity().SendMessage('APIManager', 'Setup', ['http://localhost/git/Printr/laravel-formide/formide/public/api/v1/', 'd1ulsRL4kDG08yaKgs1X7FSlOtx962bpSt9Kp8']);
	}
}

function unity_api_qualityChange(newLevel, improved) {
    console.log("qualityChanged to:" + newLevel);
}

function unity_api_selectionChange(newId) {
	if(newId = -1) { 
		console.log("nothing selected")
    } else {
		console.log("selected:" + newId);
    }
}

function unity_api_modelEvent(callback) {
    var obj = JSON.parse(callback);
    switch(obj.eventType) {
       	case "add":
       		vc.addToModelList(obj.mdlID,obj.apID, obj.apiHash);
            break;
		case "remove":
            vc.removeFromModelList(obj.modelID);
            break;
    }
}

function unity_api_errorCallback(code, message) {
    if(DEBUG) {
		console.log(code + ": " + message);
	}
}

function unity_api_warningCallback(code, message) {
   	if (DEBUG) {
		console.log(code + ": " + message);
	}
}


function unity_api_logCalback(code, message) {
    if (DEBUG) {
		console.log("Viewer log:"+code + ": " + message);
	}
}

function unity_api_callback(id, json) {
	if((id == -1 || id === undefined) && DEBUG) {
        console.warn("The viewer cold not decipher a callback!");
    }
    if(DEBUG) {
	    console.log(id +':'+ json);
	}
    var cb = vc.getCallback(id);

	if (DEBUG) {
		console.log(cb);
	}
    if (cb) {
       cb(json);
    } 
    else { 
	    if(DEBUG) {
	    	console.warn('Callback with id ' + id + ' could not be found!');
	    }
	}
}

function callPlayerFunction(initItem) {
	if (typeof window.vc[initItem.name] === "function") {
		initItem.args.push(function(response) {
			if(DEBUG) {
				console.log(JSON.parse(response));
			}
			if(initItem.callbackFunctions !== "undefined") {
				for (var callbackFunction in initItem.callbackFunctions) {
					callPlayerFunction(initItem.callbackFunctions[callbackFunction]);
				}
			}
		});
		window.vc[initItem.name].apply(window.vc[initItem.name], initItem.args);
	}
}

function callInterfacePlayerFunction(initItem) {
	console.log(initItem);
	initItem = initItem.data;
	if (typeof window.vc[initItem.name] === "function") {
		initItem.args.push(function(response) {
			if(DEBUG) {
				console.log(JSON.parse(response));
			}
			if(initItem.callbackFunctions !== "undefined") {
				for (var callbackFunction in initItem.callbackFunctions) {
					callPlayerFunction(initItem.callbackFunctions[callbackFunction]);
				}
			}
		});
		window.vc[initItem.name].apply(window.vc[initItem.name], initItem.args);
	}
}

function addInterfaceElement(interfaceItem) {
	if (typeof window.vc[interfaceItem.name] === "function") {
		if(interfaceItem.dom !== "undefined") {
			var newElement = $("<"+interfaceItem.dom.type+">", interfaceItem.dom.attributes);
			newElement.css(interfaceItem.dom.css);
			newElement.css({'position': 'absolute'});
			newElement.on(interfaceItem.dom.trigger, interfaceItem, callInterfacePlayerFunction);
			$('#unityPlayerElements').append(newElement);
		}
	}
}