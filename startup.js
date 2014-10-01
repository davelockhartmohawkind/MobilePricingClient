// Check for touch enabled device, returns true if touch events exists
var is_touch_device = 'ontouchstart' in document.documentElement;
var cPass = false;
var startTime, endTime;
var downloadSize = 27; //29 kb
var minSpeed = 30; // Set minimum connection speed (percentage that is acceptable)
var cper = 0;
var cTxt = 'Untested';
var oldstate = false;




$(document).ready(function () {

    //checkConnection();
   // var test = window.navigator.onLine;
    //if (test == true) {
    //oldstate = navigator.online;
    //navigator.onlinechange = function (evnt, newState) {
    //    alert('your changed from' + oldState + ' to' + newState + 'state');
    //}

  

    $('#loadmsg').html('Testing Connection');
   


    setInterval(function () {

        oldState = navigator.onLine ? 'online' : 'offline';
        if (oldState == "offline") {
            $('#loadmsg').html('Network Connection Down.');
        }
        else {
            $('#loadmsg').html('Network Ready.');
            var ref = window.open('http://mobilepricingdev.mohawkind.com/Home/Login', '_self', 'toolbar=no,location=no');
        }
    }, 2250);

    

    //getConnectionSpeed();
    //crossDomainPost();
   // navigator.network.isReachable("google.com", reachableCallback, {});
  //  }


});
// Document.ready: END

//$(window).load(function () {

//    /* // Simulate startup loadding
//     setTimeout(function(){
//       window.location.href = "login_screen.html";
//     }, 2000);*/

//    getConnectionSpeed();


//});



var checkConnection = function () {
    try{
        alert('checking connection');
        var networkState = NetworkStatus.network.connection.type;

        var states = {};
        states[Connection.UNKNOWN] = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI] = 'WiFi connection';
        states[Connection.CELL_2G] = 'Cell 2G connection';
        states[Connection.CELL_3G] = 'Cell 3G connection';
        states[Connection.CELL_4G] = 'Cell 4G connection';
        states[Connection.NONE] = 'No network connection';

        alert('Connection type: ' + states[networkState]);
    }
    catch (err) {
        alert(err.message);
    }
}





var showResults = function () {
    try{
    //alert("showResults()");
    var duration = (endTime - startTime) / 1000;
    var bitsLoaded = downloadSize * 8;
    var speedBps = (bitsLoaded / duration).toFixed(2);
    var speedKbps = (speedBps / 1024).toFixed(2);
    var speedMbps = (speedKbps / 1024).toFixed(2);
    /*alert("Your connection speed is: \n" +
           speedBps + " bps\n"   +
           speedKbps + " kbps\n" +
           speedMbps + " Mbps\n" );*/


    // Round to two digits
    cSpeed = Math.round(speedKbps * 10) / 10;
    //alert(cSpeed);
    //$('.indicator').css('opacity', 0);
    $('.indicator').css('width', '0%');


    //TEST SIGNAL STRENGTH MANUALLY
    //cSpeed = 0.2;

    // ADJUST RATES HERE
    // Indicate good connection rate
    if (cSpeed >= 0.7) {
        $('.indicator').css('background-color', '#bed63a');
        cTxt = 'Good';
    }
        // Indicate fair connection rate
    else if ((cSpeed < 0.7) && (cSpeed > 0.3)) {
        $('.indicator').css('background-color', '#ee6630');
        cTxt = 'Fair';
    }
        // Indicate poor connection rate
    else {
        $('.indicator').css('background-color', '#8a0000');
        cTxt = 'Weak';
    }

    cper = cSpeed * 100;
    if (cper > 100) {
        cper = 100;
    }



    $('.indicator').css('display', 'block');

    $('.indicator').animate({ 'width': cper + '%' }, 600, function () {

        //$('#cspeed').html(cSpeed+'kbs');

    });



    if (cper > minSpeed) {
        cPass = true;
        $('#loadmsg').html('Connection ' + cTxt + ' <span id="cspeed">' + cSpeed + 'kbs</span>');
        setTimeout(function () {
            try {
                var ref = window.open(encodeURI('http://mobilepricingdev.mohawkind.com/Home/Login'), '_self', 'toolbar=no,location=no');

            }
            catch (err) {
                alert(err.message);
            }
        }, 600);

    }
    else {
        cPass = false;
        $('#loadmsg').html('Your connection is too weak.');
        $('#test_signal').delay(600).fadeIn(600);


    }
    } catch (err) {
        alert("ERROR: " + err.message);
    }

}

var crossDomainPost = function() {
    // Add the iframe with a unique name
    var iframe = document.createElement("iframe");
    var uniqueString = "CHANGE_THIS_TO_SOME_UNIQUE_STRING";
    document.body.appendChild(iframe);
    iframe.style.display = "none";
    iframe.contentWindow.name = uniqueString;

    // construct a form with hidden inputs, targeting the iframe
    var form = document.createElement("form");
    form.target = uniqueString;
    form.action = "http://mobilepricingdev.mohawkind.com/Home/Image";
    form.method = "POST";

    // repeat for each parameter
    var input = document.createElement("input");
    input.type = "hidden";
    input.name = "INSERT_YOUR_PARAMETER_NAME_HERE";
    input.value = "INSERT_YOUR_PARAMETER_VALUE_HERE";
    form.appendChild(input);

    document.body.appendChild(form);
    var test = form.submit();

    var test = null;
}

var handleImageDownload = function () {
    alert("downloaded");
}


var getConnectionSpeed = function () {
    //Reset test elements
    try {
        //alert("getConnetionSpeed()");
       // $('#test_signal').css('display', 'none');
        // $('#loadmsg').html('Testing Connection <span id="cspeed"></span>');

        // Test Network Connection
        var online = false;
        online = navigator.onLine;
      
        if (online == false) {
            $('#loadmsg').html('No network connection detected.');
            $('#test_signal').delay(600).fadeIn(600);
        }
        else {
            //startTime = (new Date()).getTime();
           // download.src = imageAddr;
        //}
       // var test = window.navigator.onLine;
       // if (test == true) {
            setTimeout(function () {
                try {
                    var ref = window.open('http://mobilepricingdev.mohawkind.com/Home/Login', '_self', 'toolbar=no,location=no');
                }
                catch (err) {
                    alert(err.message);
                }
            }, 100);

        }
       
       
        return;
        setTimeout(function () {
            try {
                //var cb = function (event) {
                //    //alert("inappBrowser – " + event.type);
                //    if (event.type == "loadstart") {
                //        // browserRef_loadstart(event);
                //    }
                //}

                //var ref = window.open('http://mobilepricingdev.mohawkind.com/Home/Login', '_self', 'toolbar=no,location=no');
                var ref = window.open('http://mobilepricingdev.mohawkind.com/Home/Login', '_self', 'toolbar=no,location=no');
              //  var ref = cordova.exec(cb,cb, 'InAppBrowser', 'open', ['http://mobilepricingdev.mohawkind.com/Home/Login', '_self', 'toolbar=no,location=no']);
            }
            catch (err) {
                alert(err.message);
            }
        }, 100);

       // return;
      //  alert("start download");
       // var imageAddr = "http://mobilepricingdev.mohawkind.com/Content/images/backgrounds/login_screen_bg.jpg" + "?n=" + Math.random();
        
     
        //var download = new Image();
        //download.onload = function () {
        //    endTime = (new Date()).getTime();
        //    showResults();
        //}

        //$.post(
        // 'http://mobilepricingdev.mohawkind.com/Home/Image',
        // { imageName: "bla" },
        // handleImageDownload
        //         );

        


        //// Test Network Connection
        //var online = navigator.onLine;
        //alert(online);
        //if (online == false) {
        //    $('#loadmsg').html('No network connection detected.');
        //    $('#test_signal').delay(600).fadeIn(600);
        //}
        //else {
        //    startTime = (new Date()).getTime();
        //    download.src = imageAddr;
        //}






    } catch (err) {
        alert("ERROR: " + err.message);
    }



}
