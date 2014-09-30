// Check for touch enabled device, returns true if touch events exists
var is_touch_device = 'ontouchstart' in document.documentElement;
var cPass = false;
var startTime, endTime;
var downloadSize = 27; //29 kb
var minSpeed = 30; // Set minimum connection speed (percentage that is acceptable)
var cper = 0;
var cTxt = 'Untested';

$(document).ready(function () {

    checkConnection();
    getConnectionSpeed();


});
// Document.ready: END

//$(window).load(function () {

//    /* // Simulate startup loadding
//     setTimeout(function(){
//       window.location.href = "login_screen.html";
//     }, 2000);*/

//    getConnectionSpeed();


//});



// Functions

var checkConnection = function () {
    try{
        alert('checking connection');
        var networkState = navigator.network.connection.type;

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


var handleImageDownload = function () {
    alert("downloaded");
}


var getConnectionSpeed = function () {
    //Reset test elements
    try {
        //alert("getConnetionSpeed()");
       // $('#test_signal').css('display', 'none');
       // $('#loadmsg').html('Testing Connection <span id="cspeed"></span>');

       

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
