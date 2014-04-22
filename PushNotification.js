
var PushNotification = function() {
};


	// Call this to register for push notifications. Content of [options] depends on whether we are working with APNS (iOS) or GCM (Android)
	PushNotification.prototype.register = function(successCallback, errorCallback, options) {
	    alert("register()");
	    try
	    {
	    if (errorCallback == null) { errorCallback = function () { } }

		if (typeof errorCallback != "function")  {
		    alert("PushNotification.register failure: failure parameter not a function");

			return;
		}

		if (typeof successCallback != "function") {
			alert("PushNotification.register failure: success callback parameter must be a function");
			return;
		}
		alert("calling cordova.exec");
		alert(cordova.exec(successCallback, errorCallback, "PushPlugin", "register", ["options"]));
		alert("finished calling cordova.exec");
	    }
		catch(err) 
	    { 
	    txt="There was an error on this page.\n\n"; 
	    txt+="Error description: " + err.message + "\n\n"; 
	    alert(txt); 
	    } 
	};

    // Call this to unregister for push notifications
    PushNotification.prototype.unregister = function(successCallback, errorCallback) {
        alert("unregister()");
        if (errorCallback == null) { errorCallback = function () { } }

		if (typeof errorCallback != "function")  {
			alert("PushNotification.unregister failure: failure parameter not a function");
			return;
		}

		if (typeof successCallback != "function") {
			alert("PushNotification.unregister failure: success callback parameter must be a function");
			return;
		}
		alert("calling cordova.exec");
		cordova.exec(successCallback, errorCallback, "PushPlugin", "unregister", []);
    };
 
 
    // Call this to set the application icon badge
    PushNotification.prototype.setApplicationIconBadgeNumber = function(successCallback, badge) {
        alert("setApplicationBadgeNumber()");
        if (errorCallback == null) { errorCallback = function () { } }

		if (typeof errorCallback != "function")  {
			alert("PushNotification.setApplicationIconBadgeNumber failure: failure parameter not a function");
			return;
		}

		if (typeof successCallback != "function") {
			alert("PushNotification.setApplicationIconBadgeNumber failure: success callback parameter must be a function");
			return;
		}

		alert("calling cordova.exec");
		cordova.exec(successCallback, successCallback, "PushPlugin", "setApplicationIconBadgeNumber", [{badge: badge}]);
    };

//-------------------------------------------------------------------

if(!window.plugins) {
	window.plugins = {};
}
if (!window.plugins.pushNotification) {
	window.plugins.pushNotification = new PushNotification();
}
