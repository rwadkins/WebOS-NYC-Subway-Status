/*
 * this represents the mobile device, and provides properties for inspecting the model, version, UUID of the
 * phone, etc.
 * @constructor
 */
function Device() {
    this.platform = "palm";
    this.version  = null;
    this.name     = null;
    this.uuid     = null;
};

/*
 * A direct call to return device information.
 * Example:
 *		var deviceinfo = JSON.stringify(navigator.device.getDeviceInfo()).replace(/,/g, ', ');
 */
Device.prototype.getDeviceInfo = function() {
	return JSON.parse(PalmSystem.deviceInfo);
};

/*
 * needs to be invoked in a <script> nested within the <body> it tells WebOS that the app is ready
        TODO: see if we can get this added as in a document.write so that the user doesn't have to explicitly call this method
 * Dependencies: Mojo.onKeyUp
 * Example:
 *		navigator.device.deviceReady();
 */	
Device.prototype.deviceReady = function() {

	// tell webOS this app is ready to show
	if (window.PalmSystem) {
		// setup keystroke events for forward and back gestures
		document.body.addEventListener("keyup", Mojo.onKeyUp, true);

		setTimeout(function() { PalmSystem.stageReady(); PalmSystem.activate(); }, 1);
		alert = this.showBanner;
	}
	
	this.setUUID();
};

Device.prototype.setUUID = function() {
	//this is the only system property webos provides (may change?)
	var that = this;
	this.service = navigator.service.Request('palm://com.palm.preferences/systemProperties', {
	    method:"Get",
	    parameters:{"key": "com.palm.properties.nduid" },
	    onSuccess: function(result) {
			that.uuid = result["com.palm.properties.nduid"];
		}
    });	


};


if (typeof window.device == 'undefined') window.device = navigator.device = new Device();

