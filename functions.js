// Check for touch enabled device, returns true if touch events exists


var is_touch_device = 'ontouchstart' in document.documentElement;
var accountsData = "";
var accountsData2 = "";
var accountsData3 = "";
var accountCPLData = "";
var productsData = "";
var statusData = "";
var controlData = "";
var lineval = "";
var cSpeed = 0;
var appstate = "accounts";
var current_Account = '';
var current_AccountI = 0;
var current_Line = 0;
var price_target = 0;
var input_target = '#m_cal_value_l';
var current_Load = 0;
var current_Roll = 0;
var current_Cut = 0;
var current_startDate = '';
var current_endDate = '';
var current_Column = '';
var current_ColumnTarget = '';
var current_Order = '';
var current_Message = '';
var current_MessageTimeout = 0;
var constrainedPrice = true;
var G_priceStep = 0.09;
var price_eval = true;



var accounts_JSON = [];

//CPL list stats
var accounts_Array = [];
var JSONobjectAccounts;
var JSONobjectAccountsFiltered;
var statusApproved = 0;
var statusRevising = 0;
var statusSubmitted = 0;
var statusDenied = 0;
var statusTotal = 0;

//CPL item status
var totalItems = 0;
var isPromo = 0;
var isAutoTM3Promo =0;
var isRollLoad = 0;
var isCutLoad = 0;

var welcomeUserName = "";
var welcomeUserNameAs = "";
var welcomePassword = "";
var welcomeFullName = "";
var welcomeFullNameAs = "";
var G_userRole = "";



// G_AbsoluteUri  see Index.cshmtl
// G_Home see Index.cshmtl
// G_appVersion see Index.cshmtl
var accountCPL_JSON = [];
var accountCPL_Array = [];
var CPLpageArray = [];
var accountCPL_ArrayIndex = [{ "indexCount": 0, "indexMax": 0 }, { "indexCount": 0, "indexMax": 0 }, { "indexCount": 0, "indexMax": 0 }, { "indexCount": 0, "indexMax": 0 }, { "indexCount": 0, "indexMax": 0 }];
var G_ownerList = [];
var G_customerList =[];

var G_SelectCustomerState = ""; // byOwner, byCustomer
var G_SelectCustomerSearchString = "";

var G_SystemDate;
var G_daysToAdd = "";
var G_UseAltClass = true;

var G_itemsFilterCalled = false;
var G_availableFilterCalled = false;
var G_accountsFilterCalled = false;
var G_lastLockoutRequest;
var G_setTimeoutRequest = null;
var G_maxLockoutTime = 180; //seconds
var G_lastActivity = (new Date()).getTime();
var G_maxInactivityDuration = 30;
var G_readOnly = false;
var G_selectType = "";


var G_accounts_currentIndex = -1;
var G_cancelGetPricePointItems = "false";
var G_pricePointItemsComplete = "false";
var G_pricePointItemsContext = 0; //used to sync threaded request that have been canceled
var G_accounts_column_id = "sales";
var G_accounts_section;
var G_accounts_order = "DESC";
var G_accounts_targetColumn = "col5";

var G_items_column_id = "VState";
var G_items_section;
var G_items_order = "ASC";
var G_items_targetColumn = "col1";

var G_submitAsPromo = "false";
var G_submitAsAdd = "false";
var G_submitAs = "edit";

var G_current_Index = -1;
var G_currentCustomerHeaderVID = "";
var G_currentHeaderStatus = "";
var G_customerNumber = "";
var G_customerGroupNumber = "";

var G_filter_CustomerGroupArray;
var G_filter_CustomerGroupArrayFilteredCount = 0;
var G_filter_CustomerStatusArray;
var G_filter_CustomerStatusArrayFilteredCount = 0;

var G_filter_CPLThemeDisplayArray;
var G_filter_CPLThemeDisplayArrayFilteredCount = 0;
var G_filter_CPLBrandArray;
var G_filter_CPLBrandArrayFilteredCount = 0;
var G_filter_CPLPriceLevelArray;
var G_filter_CPLPriceLevelArrayFilteredCount = 0;
var G_filter_CPLPromoPriceArray;
var G_filter_CPLPromoPriceArrayFilteredCount = 0;
var G_filter_CPLAutoTM3Array;
var G_filter_CPLAutoTM3ArrayFilteredCount = 0;
var G_filter_ProductThemeDisplayArray;
var G_filter_ProductThemeDisplayArrayFilteredCount = 0;
var G_filter_CPLCorpPromoArray;
var G_filter_CPLCorpPromoArrayFilteredCount = 0;

var G_itemFilterCategory;
var G_loggingEnabled = true;

var G_pagingCPLMaxSize = 50;
var G_pagingCPLCurrentIndex = 0;

var dealerPhrase = 'Dealer Name or Account #';
var searchCPLPhrase = 'Style Name or Style #';
var G_lockoutInput = false;

var G_groupEditType = "";
var G_groupEditItemSelectedCounter = 0;
var G_groupIsCoreCounter = 0;
var G_groupEditPriceLevel = "";
var G_groupEditMaximumValue = .45;
var G_groupEditMinimumValue = -.45;
var G_GroupEditEnabled = false;
var addProducts_Array = [];

var 
    totalAddProducts = 0,
    totalSelectedProducts = 0;



function FilterItem(category,count, isVisible,isVisiblePotential)
{
    this.category = category;
    if (isVisible == "true") {
        this.count = count;
    }
    else {
        this.count = 0;
    }
    if (isVisiblePotential == "true") {
        this.potentialCount = count;
    }
    else {
        this.potentialCount = 0;
    }
    this.checked = 0;
    this.absoluteCount = count;
}


//returns seconds since last activity.
var checkLastActivity = function () {
    var lastTime, currentTime;
    var duration;

    lastTime = G_lastActivity;
    currentTime = (new Date()).getTime();
    duration = ((currentTime - lastTime) / 1000) / 60;

    
    if (duration >= G_maxInactivityDuration) {
        closeModal();
        goModal('#inactivityMessageBox');
        return false;
    }
    setLastActivity();
    return true;

}

var setLastActivity = function () {
    G_lastActivity = (new Date()).getTime();
}

var isActivityOK = function () {
    var lastTime, currentTime;
    var duration;

    lastTime = G_lastActivity;
    currentTime = (new Date()).getTime();
    duration = ((currentTime - lastTime) / 1000) / 60;

    if (duration >= G_maxInactivityDuration) {
        return false;
    }
  
    return true;
}

//returns seconds since last lockout was requested.
var getLastLockOut = function () {
    var lastTime, currentTime;
    var duration;

    lastTime = G_lastLockoutRequest;
    currentTime = (new Date()).getTime();
    duration = (currentTime - lastTime) / 1000;
    return duration;

}



var lockoutInput = function () {
    G_lockoutInput = true;
    $('#mask2').fadeIn(200);
    //release the lock however continue with the mask.
    //this allows the user to resume if the event fails.
    G_lastLockoutRequest = (new Date()).getTime();
    G_setTimeoutRequest = setTimeout(function () { timeoutLockout(true) }, G_maxLockoutTime * 1000);

}

var isLockout = function () {
    return G_lockoutInput;
}

var refreshLockout = function () {
    G_lockoutInput = true;
    G_lastLockoutRequest = (new Date()).getTime();
    if (G_setTimeoutRequest != null) {
        clearTimeout(G_setTimeoutRequest);
    }
    G_setTimeoutRequest = setTimeout(function () { timeoutLockout(true) }, G_maxLockoutTime * 1000);

}


var releaseLockout = function (unmask) {
    debugger;
    G_lockoutInput = false;
    if (G_setTimeoutRequest != null) {
        clearTimeout(G_setTimeoutRequest);
    }
    if (unmask == true) 
    {
        $('#mask2').fadeOut(200);
        $('#data_loading').css('opacity', 0);
        $('#data_loading').css('display', 'none');
        $('#app_loading').css('opacity', 0);
        $('#app_loading').css('display', 'none');
    }
}

//gets called after every lockoutInput()
var timeoutLockout = function (unmask) {
    //only clear lockout if no other request has been made.
    if(getLastLockOut() >= G_maxLockoutTime){
        G_lockoutInput = false;
        if (unmask == true) {
            $('#mask2').fadeOut(200);
            $('#data_loading').css('opacity', 0);
            $('#data_loading').css('display', 'none');
        }
    }
}

var useAltClass = function(){
    if(G_UseAltClass == false){
        G_UseAltClass = true;
    }
    else {
        G_UseAltClass = false;
    }

    return G_UseAltClass;
}
//
var showProgress = function (id, message) {

    $('#progress_message').text(message);

    var winH = $(id).parent().height();
    var winW = $(id).parent().width();

    $(id).css('opacity', 0);
    $(id).css('display', 'block');

    var ceH = $(id).children('.center_element').height();
    var ceW = $(id).children('.center_element').width();

    // Center processing indicator element
    $(id).children('.center_element').css('top', (winH / 2) - ceH / 2);
    $(id).children('.center_element').css('left', winW / 2 - ceW / 2);

    $(id).animate({ 'opacity': 1 }, 100);
}


var hideProgress = function (id) {
    $(id).css('display', 'none');
    $(id).children('.progress_message').html('');
}

var showProcessing = function (id, useAnimation) {

    if (useAnimation == undefined) {
        useAnimation = true;
    }
 
    var winH = $(window).height();
    var winW = $(window).width();

    $(id).css('top', winH / 2 - $(id).height() / 2);
    $(id).css('left', winW / 2 - $(id).width() / 2);

    var currentOpacity = $(id).css('opacity');
    $(id).css('opacity', 0);
    $(id).css('display', 'block');

    if (useAnimation == true) {
        $(id).animate({ 'opacity': 1 }, 100);
    }
    else {
        $(id).css('opacity', 1);
    }
}


var handleLogEvent = function (content) {
    //do nothing;
}

var logEvent = function (pusername, peventName, pmessage) {
    if (G_loggingEnabled == true) {
        $.post(
            G_AbsoluteUri + 'Home/logEvent',
              { username: pusername, eventName: peventName, message: pmessage },
              handleLogEvent
                      );
    }
}

var logError = function (pusername, peventName, pmessage, pstack, pdetails) {
    var browserDetails = getBrowserDetails();
    var browserV = getBrowser();
    $.post(
         G_AbsoluteUri + 'Home/logError',
          { username: pusername, eventName: peventName, message: pmessage, stack:pstack, browser: browserV, details:browserDetails + ''  + pdetails },
          handleLogEvent
                  );
}

var getPrettyDate = function(dateObject){


   

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;

    if (dateObject != undefined) {
        today = dateObject;
        dd = dateObject.getDate();
        mm = dateObject.getMonth();
    }



    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    var mm_str = month[today.getMonth()];

    var yyyy = today.getFullYear();
    today = mm_str + ' ' + dd + ', ' + yyyy;
    return today;
}


///gets first index of row with matching style name
var getIndexByVID = function (pVID) {
    for (var i = 0; i < accountCPL_Array.length; i++)
    {
        if (accountCPL_Array[i].VID == pVID)
        {
            return i;
        }
    }
    return -1;
}

var getBrowser = function () {
    try {
        var details = '';
        details +=  browserName + ' : ';
        details +=  fullVersion ;
        return details;
    } catch (err) {

    }
    return "";
}

var getBrowserDetails = function () {
    try {
        var details = '';
        details += 'Browser:' + browserName + ',';
        details += 'Version  = ' + fullVersion + ',';
        // details += 'Major version = ' + majorVersion + ',';
        details += 'AppName = ' + navigator.appName + ',';
        details += 'UserAgent = ' + navigator.userAgent + ',';

        return details;
    } catch (err) {

    }
    return "";

}

var getMobileOperatingSystem = function () {
    try {
		logEvent(welcomeUserName, "JavaScript:getMobileOperatingSystem()");
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
		
		logEvent(welcomeUserName, "JavaScript:getMobileOperatingSystem() ", "userAgent: " + userAgent);
        
		if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
            logEvent(welcomeUserName, "JavaScript:getMobileOperatingSystem() userAgent Value: IOS " );
			return 'iOS';
        }
        else if (userAgent.match(/Android/i)) {
            logEvent(welcomeUserName, "JavaScript:getMobileOperatingSystem() userAgent Value: Android " );
			return 'Android';
			
        }
        else {
			logEvent(welcomeUserName, "JavaScript:getMobileOperatingSystem() userAgent Value: unknown " );
            return 'unknown';
        }
    } catch (err) {
		logEvent(welcomeUserName, "JavaScript:getMobileOperatingSystem() error " + err );
    }
	logEvent(welcomeUserName, "JavaScript:getMobileOperatingSystem() Empty ");
    return "";
}

//DM RM functions

var displayUsers = function (userListObject) {
    $('.alist').css('display', 'none');//hide both list
  
    $('#qLoader').delay(300).fadeOut(300, function () {
        $('#alist_panelUser').loadTemplate("#userListTemplate", userListObject);
        $('#searchbyGroup_list').fadeIn(300);
        $('#alist_panelUser').scrollTop();
    });
}

var displayCustomers = function (customerListObject) {
    $('.alist').css('display', 'none');//hide both list
  
    $('#qLoader').delay(300).fadeOut(300, function () {
        $('#alist_panel').loadTemplate("#customerListTemplate", customerListObject);
        $('#searchbyCustomer_list').fadeIn(300);
        $('#alist_panel').scrollTop();
    });
   
}



var searchByGroupClick = function() {
    $('#optmsg').html('');
    var p = $("#adminInterface");
    var position = p.position();
   


    $('#searchbyCustomer').parent('div').removeClass('aindication');
    $('#searchbyCustomer').addClass('inactive');
    if ($('#customSearchByDM').val() == '') {
        $('#customSearchByDM').val('Search by Customer');
    }

    $('#searchbyGroup').parent('div').addClass('aindication');
    $('#searchbyGroup').removeClass('inactive');

    $('#qLoader').fadeIn(300);

    if(position.left == 0) {
       
        $.post(
               G_AbsoluteUri + 'Home/getEntitledTMs',
               { workFlowOwner: welcomeUserName, highestRole: G_userRole, username: welcomeUserName, password: welcomePassword },
               handleGetEntitledTMs
                       );
    }
    else {
      
        $('#adminOptions').addClass('ablocked');

        $('#adminInterface').animate({
            left: '0px'
        }, 360, 'swing', function() {

            // Animation complete.
            $.post(
                G_AbsoluteUri + 'Home/getEntitledTMs',
                { workFlowOwner: welcomeUserName, highestRole: G_userRole, username: welcomeUserName, password: welcomePassword },
                handleGetEntitledTMs
                        );
        });
    }



}

var customSearchByDMClick = function () {

    if ($('#customSearchByDM').val() == 'Search by Customer' || $('#customSearchByDM').val() == '' ) {
        customerSearchOnChange();
       // return;
    }

    if ($('#searchbyCustomer').parent('div').hasClass('aindication') == false) {
        $('#alist_panelUser').html('');
        $('.alist').css('display', 'none');
        $('#qLoader').fadeOut(300);
    }
    
    $('#searchbyGroup').parent('div').removeClass('aindication');
    $('#searchbyGroup').addClass('inactive');
    if ($('#adminOptions').hasClass('ablocked')){
        $('#searchbyCustomer').parent('div').addClass('aindication');
    }
    $('#searchbyCustomer').removeClass('inactive');

  
}

var searchByCustomerClick = function(theId) {

    $('#searchbyGroup' + theId).addClass('inactive');
    $('#optmsg').html('');

    var isinactive = $(this).hasClass('inactive');
    if (isinactive == true) {
        $(this).removeClass('inactive');
    }
    customerSearchOnChange();
}

var handleAccountSelect = function (content) {
    //do something
    var testme = content;
    // debugger
    if (content) {

        $("#theBody").removeClass('mpa_login');
        if ($("#theBody").hasClass('mpa_app') == false) {
            $("#theBody").addClass('mpa_app');
        }

        $("#theBody").html(content);


        if (doOnSelectAccountReady) {
            doOnSelectAccountReady();
        }

    }
}



var handleGetEntitledTMs = function(content) {

   // releaseLockout(true);
    if (content != undefined && content != null && content != "") {

        var responseObject;

        responseObject = JSON.parse(content);
        logEvent(welcomeUserName, "handle response", "getEntitledTMs: " + responseObject.responseCode);
        if (responseObject.responseCode == "SUCCESS") {
            G_ownerList = responseObject.OwnersList;

        }
        else {
           // $("#alertMessageContent").html(responseObject.responseMessage);
            // goModal('#alertMessageBox');
            $('.alist').css('display', 'none');
            $('#qLoader').fadeOut(300);
            $('#optmsg').html(responseObject.responseMessage);
            return;
        }


        if (responseObject.AppVersion != G_appVersion) {
            window.location.href = G_Home;
            return;
        }


        displayUsers(G_ownerList);

    }
}

var handleGetEntitledCustomers = function (content) {

    // releaseLockout(true);
    if (content != undefined && content != null && content != "") {

        var responseObject;
        
        responseObject = JSON.parse(content);
        logEvent(welcomeUserName, "handle response", "getEntitledCustomers: " + responseObject.responseCode);
        if (responseObject.responseCode == "SUCCESS") {
            G_customerList = responseObject.CustomerList;

        }
        else {

            $('.alist').css('display', 'none');
            $('#qLoader').fadeOut(300);
            $('#optmsg').html(responseObject.responseMessage + '<br />Try changing your input for customer search.');
            return;
        }


        if (responseObject.AppVersion != G_appVersion) {
            window.location.href = G_Home;
            return;
        }

        if (G_customerList.length > 1000) {
            $('.alist').css('display', 'none');
            $('#qLoader').fadeOut(300);
            $('#optmsg').html('Found more than 1,000 records to match your input.' + '<br />Please narrow your search by changing your input for customer search.');
            return;
        }


        displayCustomers(G_customerList);

    }
}

function handleVersion(content) {

    try {
        if (content != undefined && content != null && content != "") {

            var responseObject;
            responseObject = JSON.parse(content);
            if (responseObject.responseCode == "SUCCESS") {
                $("#appVersion").html(responseObject.responseMessage);

            }
            else {
                $("#appVersion").html("unverified");
            }

        }
    } catch (err) {
        $("#appVersion").html("unverified");
        logError(welcomeUserName, "handleGetPricePointItems", err.message + ' : ' + err.stack);
    }
}


var customerSearchOnChange = function () {
    G_SelectCustomerSearchString = $('#customSearchByDM').val();

    $('#optmsg').html('');
    //console.log('Value changed! Check if there enough characters to submit a search...');
    if (G_SelectCustomerSearchString.length >= 2 && G_SelectCustomerSearchString != "Search by Customer") {
        //console.log('Value at least 2 characters, submit query...');
        var p = $("#adminInterface");
        var position = p.position();
        var oid = $('#searchbyCustomer').attr('id');

        $('#searchbyGroup').parent('div').removeClass('aindication');
        $('#searchbyCustomer').parent('div').addClass('aindication');

        $('#qLoader').fadeIn(300);


        if (position.left == 0) {
            // SUBMIT QUERY HERE!
            $.post(
                 G_AbsoluteUri + 'Home/getEntitledCustomers',
                 { workFlowOwner: welcomeUserName, highestRole: G_userRole, searchVariable: G_SelectCustomerSearchString, username: welcomeUserName, password: welcomePassword },
                 handleGetEntitledCustomers
                         );
           
        }
        else {
            //$("#adminInterface").css({ "left": "0px"});
            $('#adminOptions').addClass('ablocked');

            $('#adminInterface').animate({
                left: '0px'
            }, 360, 'swing', function () {

                // SUBMIT QUERY HERE!
                $.post(
                G_AbsoluteUri + 'Home/getEntitledCustomers',
                { workFlowOwner: welcomeUserName, highestRole: G_userRole, searchVariable: G_SelectCustomerSearchString, username: welcomeUserName, password: welcomePassword },
                handleGetEntitledCustomers
                        );

                
            });
        }


    }
    else {
        //console.log('You need at least 2 characters to initiate a search!');
        if ($('#customSearchByDM').val() == "") {
            $('#customSearchByDM').val("Search by Customer");
        } 
        $('#optmsg').html('Type at least 2 characters <br />to initiate a search by customer.');
        $('#customSearchByDM').val('');
        $('#customSearchByDM').focus();
    }
}



var onFocus_search_addproducts = function () {
    if ($('#search_addproducts').val() == searchCPLPhrase)
    {
        $('#search_addproducts').val('');
    }
    G_availableFilterCalled = false;
}

var doSearchAvailable = function doSearchAvailable(useBlur ) {

    if ($('#search_addproducts').val() != searchCPLPhrase)
    {
        if (G_availableFilterCalled == true)
        {
            return;
        }
        G_availableFilterCalled = true;

        updateCPLFilterDisplay("producttheme");
        productsFilter();
        $('#search_addproducts').siblings('.wdgt_icon').addClass('toreset');
        //if (useBlur == true)
        //{
        //    $('#search_addproducts').blur();
        //}
    }
    if ($('#search_addproducts').val() == '')
    {
        //$('#search_addproducts').val(searchCPLPhrase);
        $('#search_addproducts').siblings('.wdgt_icon').removeClass('toreset');

    }
  
}

var doSearchAccountCPL = function doSearchAccountCPL(useBlur) {
  
   
    if ($('#search_accountCPL').val() != searchCPLPhrase)
    {
        if (G_itemsFilterCalled == true)
        {
            return;
        }
        G_itemsFilterCalled = true;

        itemsFilter();
        $('#search_accountCPL').siblings('.wdgt_icon').addClass('toreset');
        if (useBlur == true)
        {
            $('#search_accountCPL').blur();
        }
    }
    if ($('#search_accountCPL').val() == '')
    {
        $('#search_accountCPL').val(searchCPLPhrase);
        $('#search_accountCPL').siblings('.wdgt_icon').removeClass('toreset');
    }
 
}

var doSearchAccounts = function doSearchAccounts(useBlur) {
    
    if ($('#search_accounts').val() != dealerPhrase)
    {
        if (G_accountsFilterCalled == true)
        {
            return;
        }
        G_accountsFilterCalled = true;

        accountsFilter();
        $('#search_accounts').siblings('.wdgt_icon').addClass('toreset');

        if (useBlur)
        {
            $('#search_accounts').blur();
        }
    }
    if ($('#search_accounts').val() == '')
    {
        $('#search_accounts').val(dealerPhrase);
        $('#search_accounts').siblings('.wdgt_icon').removeClass('toreset');
    }

}


function cancelGroupEdit() {
    G_groupEditType = "";
    arraySelector('none', 'deselect');
    $('#accountCPL_back').css('visibility', 'visible');
    itemsFilter();

}

function editGroup(editType) {
    $('.select_icon').removeClass('active');
    G_groupEditType = editType;
    $('#accountCPL_back').css('visibility', 'hidden'); 
    itemsFilter();
    $('#addProducts_datapanel').scrollTop();
    setGroupEditItemCount(G_accounts_currentIndex);
    if (G_groupEditType == 'expire') {
        
        $('#groupEditInstructor').html('You are about to remove prices for all of the products selected.');
    }
    else
    {
        $('#groupEditInstructor').html('You are about to change pricing for all of the products selected.');
    }
   closeModal();
}

var applyGroupPrice = function(){
   
    if (G_groupEditType == "edit") {
        EditCurrentPrice();
    }
    if (G_groupEditType == "expire") {
        ExpireCurrentPrice();
    }
    if (G_groupEditType == "newpromo") {
        EditCurrentPrice(); 
    }

    return;
}

var EditCurrentPrice = function () {

    var theID = ''; 
    var lineState = '';
    var startDates = '';
    var headerID = G_currentCustomerHeaderVID;
    var headerState = G_currentHeaderStatus;
    var startDate = '';
    var itemCounter = 0;
    var batchSize = 5;
    var useComma = false;
    var proposedPriceBase = '';
    var proposedPriceAdj = '';

    proposedPriceBase = G_groupEditPriceLevel;
    proposedPriceAdj = $("#slider2").slider('option', 'value');

    if (checkLastActivity() == false) {
        return;
    }

    $('.window').fadeOut(100);
    lockoutInput();
    showProcessing('#data_loading');

    for (var i = 0; i < accountCPL_Array.length; i++) {
        // Set default state of all line items to selected
        
        if ((accountCPL_Array[i].ItemSelected == "true") && accountCPL_Array[i].ItemDeleted == "false") {
            accountCPL_Array[i].ItemProcessed = false;
            itemCounter++;
            if (useComma == true) {
                theID += ',';
                lineState += ',';
                startDates += ',';
            }
            theID += accountCPL_Array[i].VID;
            lineState += accountCPL_Array[i].VState;
            startDates += accountCPL_Array[i].StartDate;
            useComma = true
            accountCPL_Array[i].ItemSubmitted = true;
     
        }

        if (itemCounter >= batchSize) {
           
            if (G_groupEditType != "newpromo") {
               //edit
                logEvent(welcomeUserName, "begin post", "savePriceMulti");
                $.post(
                  G_AbsoluteUri + 'Home/savePriceMulti',
                  { headerID: headerID, currentHeaderStatus: headerState, lineIDs: theID, startDates: startDates, tag: "test", currentLineStatus: lineState, proposedPriceBase: proposedPriceBase, proposedPriceAdj: proposedPriceAdj, userID: welcomeUserName, password: welcomePassword },
                  handleMultiEditCurrentPrice
                          );
            }
            else
            {
                //promo
                var startDate = new Date($('#datepicker_start').val()).toString('M/d/yyyy');
                var endDate = new Date($('#datepicker_end').val()).toString('M/d/yyyy');

               
                logEvent(welcomeUserName, "begin post", "savePromoPriceMulti");
                $.post(
                G_AbsoluteUri + 'Home/savePromoPriceMulti',
                { headerID: headerID, currentHeaderStatus: headerState, lineIDs: theID, tag: "test", currentLineStatus: lineState, proposedPriceBase: proposedPriceBase, proposedPriceAdj: proposedPriceAdj, startDate: startDate, endDate: endDate, userID: welcomeUserName, password: welcomePassword },
                handleMultiEditCurrentPrice
                        );
            }

            return;
           
        }

    }


    if (itemCounter > 0) {
        logEvent(welcomeUserName, "begin post", "editCurrentPrice");
        if (G_groupEditType != "newpromo") {
            
            logEvent(welcomeUserName, "begin post", "savePriceMulti");
            $.post(
              G_AbsoluteUri + 'Home/savePriceMulti',
              { headerID: headerID, currentHeaderStatus: headerState, lineIDs: theID, startDates: startDates, tag: "test", currentLineStatus: lineState, proposedPriceBase: proposedPriceBase, proposedPriceAdj: proposedPriceAdj, userID: welcomeUserName, password: welcomePassword },
              handleMultiEditCurrentPrice
                      );
        }
        else {
            //promo
            var startDate = new Date($('#datepicker_start').val()).toString('M/d/yyyy');
            var endDate = new Date($('#datepicker_end').val()).toString('M/d/yyyy');

            
            logEvent(welcomeUserName, "begin post", "savePromoPriceMulti");
            $.post(
            G_AbsoluteUri + 'Home/savePromoPriceMulti',
            { headerID: headerID, currentHeaderStatus: headerState, lineIDs: theID, tag: "test", currentLineStatus: lineState, proposedPriceBase: proposedPriceBase, proposedPriceAdj: proposedPriceAdj, startDate: startDate, endDate: endDate, userID: welcomeUserName, password: welcomePassword },
            handleMultiEditCurrentPrice
                    );
        }


    }

}

function handleMultiEditCurrentPrice(content) {


    try{
        if (content != undefined && content != null && content != "") {

            var responseObject;
            var itemTotal = 0;
            var itemCompleteCount = 0;
            var itemRemainingCount = 0;

            releaseLockout(true);
            responseObject = JSON.parse(content);

            logEvent(welcomeUserName, "handle response", "MultiEditCurrentPrice: " + responseObject.responseCode);
            if (responseObject.responseCode == "SUCCESS") {
                JSONobjectAccounts[G_accounts_currentIndex].status = "revising";
                setCustomerInformation(G_accounts_currentIndex);
                G_items_column_id = "VState";
                G_items_order = "ASC";
                G_items_targetColumn = "col1";

                G_currentCustomerHeaderVID = responseObject.HeaderID;
                JSONobjectAccounts[G_accounts_currentIndex].id = responseObject.HeaderID;


                var responseCounter = 0;
                for (var i = 0; i < accountCPL_Array.length; i++) {

                    if ((accountCPL_Array[i].ItemSelected == "true") && (accountCPL_Array[i].ItemProcessed == false) && (accountCPL_Array[i].ItemSubmitted == true)) {

                        accountCPL_Array[i].ItemProcessed = true;
                        accountCPL_Array[i].pricePointUpdateComplete = false;
                        if (G_groupEditType == "edit")
                        {
                       

                            status = accountCPL_Array[i].LineStatus;

                            if(status != undefined && (status == "add" || status == "newadd")){
                                accountCPL_Array[i].StartDate = responseObject.BeginDate;
                                accountCPL_Array[i].EndDate = responseObject.EndDate;
                                accountCPL_Array[i].VState = "draft";
                                accountCPL_Array[i].MODOBJNUM = 0;
                                accountCPL_Array[i].COPOBJNUM = 0;
                                accountCPL_Array[i].REVOBJNUM = 0;
                                accountCPL_Array[i].ItemProcessed = true;
                                accountCPL_Array[i].pricePointUpdateComplete = false;
                                arraySelector(i, 'deselect');
                                accountCPL_Array[i].ProposedRollPriceVAmountAmount = responseObject.CPLLines[responseCounter].proposedRoll.split(' ')[0];
                                accountCPL_Array[i].RollLoad = responseObject.CPLLines[responseCounter].rollLoad.split(' ')[0];
                                accountCPL_Array[i].ProposedCutPriceVAmountAmount = responseObject.CPLLines[responseCounter].proposedCut.split(' ')[0];
                                accountCPL_Array[i].CutLoad = responseObject.CPLLines[responseCounter].cutLoad.split(' ')[0];
                                //  setLineStatus(i, "add");
                            }
                            else if (status != undefined && (status == "newpromo" )) {
                                //accountCPL_Array[i].StartDate = responseObject.BeginDate;
                                // accountCPL_Array[i].EndDate = responseObject.EndDate;
                                accountCPL_Array[i].VState = "draft";
                                accountCPL_Array[i].MODOBJNUM = 100;
                                accountCPL_Array[i].COPOBJNUM = 0;
                                accountCPL_Array[i].REVOBJNUM = 0;
                                accountCPL_Array[i].ItemProcessed = true;
                                accountCPL_Array[i].pricePointUpdateComplete = false;
                                arraySelector(i, 'deselect');
                                accountCPL_Array[i].ProposedRollPriceVAmountAmount = responseObject.CPLLines[responseCounter].proposedRoll.split(' ')[0];
                                accountCPL_Array[i].RollLoad = responseObject.CPLLines[responseCounter].rollLoad.split(' ')[0];
                                accountCPL_Array[i].ProposedCutPriceVAmountAmount = responseObject.CPLLines[responseCounter].proposedCut.split(' ')[0];
                                accountCPL_Array[i].CutLoad = responseObject.CPLLines[responseCounter].cutLoad.split(' ')[0];
                                //  setLineStatus(i, "newpromo");
                            }
                            else
                            {
                                accountCPL_Array[i].REVOBJNUM = 100;
                                accountCPL_Array[i].pricePointUpdateComplete = false;
                                accountCPL_Array[i].StartDate = responseObject.BeginDate;
                                accountCPL_Array[i].EndDate = responseObject.EndDate;
                                accountCPL_Array[i].VState = "revising";
                                accountCPL_Array[i].ItemProcessed = true;

                                arraySelector(i, 'deselect');
                                accountCPL_Array[i].ProposedRollPriceVAmountAmount = responseObject.CPLLines[responseCounter].proposedRoll.split(' ')[0];
                                accountCPL_Array[i].RollLoad = responseObject.CPLLines[responseCounter].rollLoad.split(' ')[0];
                                accountCPL_Array[i].ProposedCutPriceVAmountAmount = responseObject.CPLLines[responseCounter].proposedCut.split(' ')[0];
                                accountCPL_Array[i].CutLoad = responseObject.CPLLines[responseCounter].cutLoad.split(' ')[0];
                                //  setLineStatus(i, "edit");
                            }

                        }

                        if (G_groupEditType == "newpromo")
                        {
                            if (i < accountCPL_Array.length - 1) {
                            
                                itemCopy = JSON.parse(JSON.stringify(accountCPL_Array.slice(i, i + 1)));
                            }
                            else {
                                itemCopy = JSON.parse(JSON.stringify(accountCPL_Array.slice(i)));
                            }


                            accountCPL_Array[i].StartDate = responseObject.BeginDate;
                            accountCPL_Array[i].EndDate = responseObject.EndDate;
                            accountCPL_Array[i].VID = responseObject.CPLLines[responseCounter].newVID;
                            accountCPL_Array[i].MODOBJNUM = 100;
                            accountCPL_Array[i].VState = "draft";
                            accountCPL_Array[i].pricePointUpdateComplete = false;
                            accountCPL_Array[i].ItemProcessed = true;
                            //accountCPL_Array[i].ItemSelected = "false";
                            arraySelector(i, 'deselect');

                            accountCPL_Array[i].ProposedRollPriceVAmountAmount = responseObject.CPLLines[responseCounter].proposedRoll.split(' ')[0];
                            accountCPL_Array[i].RollLoad = responseObject.CPLLines[responseCounter].rollLoad.split(' ')[0];
                            accountCPL_Array[i].ProposedCutPriceVAmountAmount = responseObject.CPLLines[responseCounter].proposedCut.split(' ')[0];
                            accountCPL_Array[i].CutLoad = responseObject.CPLLines[responseCounter].cutLoad.split(' ')[0];

                            //update the copy
                            itemCopy[0].pricePointUpdateComplete = false;
                            itemCopy[0].ItemProcessed = true;
                            itemCopy[0].ItemSelected = "false";
                            accountCPL_Array.push(itemCopy[0]);
                        }
                    
               
                        responseCounter++;
                    }

                    if (accountCPL_Array[i].ItemSelected == "true") {
                        itemTotal++;
                    }
                    if ((accountCPL_Array[i].ItemSelected == "true") && (accountCPL_Array[i].ItemProcessed == true)) {
                        itemCompleteCount++;
                    }

                    if (accountCPL_Array[i].ItemSelected == "true" && accountCPL_Array[i].ItemDeleted == "false" && accountCPL_Array[i].ItemProcessed == false && accountCPL_Array[i].ItemSubmitted == false) {
                        itemRemainingCount++;
                    }

                }


                if (itemRemainingCount > 0) {
                    showProcessing('#data_loading');
                    EditCurrentPrice();
                    return;
                }

                G_groupEditType = "";
                appstate = 'accountCPL';
                itemsFilter();
                closeModal();
                // reOpenAccount(G_accounts_currentIndex, G_currentCustomerHeaderVID);
               // $('#accountCPL_datapanel').scrollTop(); this line does not work on ipad so we I added line below
                setActiveCPLRow('m_li_target_' + '0', 'false');
          
            }
            else
            {
                //check for values
                if (responseObject.HeaderStatus != "") {
                    JSONobjectAccounts[G_accounts_currentIndex].status = responseObject.HeaderStatus;
                }
                if (responseObject.HeaderID != "") {
                    G_currentCustomerHeaderVID = responseObject.HeaderID;
                    JSONobjectAccounts[G_accounts_currentIndex].id = responseObject.HeaderID;
                }
                if (responseObject.RememberMeCookie == 'INVALID') {
                    logOut();
                    return;
                }

                $("#alertMessageContent").html(responseObject.responseMessage);
                goModal('#alertMessageBox');

            }
        }
        else {
            alert("no content");

        }
    }
    catch (err)
    {
        logError(welcomeUserName, "handleMultiEditCurrentPrice", err.message, err.stack, '');
    }
}





var ExpireCurrentPrice = function () {
    var theID = ''; 
    var lineState = '';
    var headerID = G_currentCustomerHeaderVID;
    var headerState = G_currentHeaderStatus;
    var startDate = G_SystemDate;
    var itemCounter = 0;
    var batchSize = 5;

    if (checkLastActivity() == false) {
        return;
    }

    $('.window').fadeOut(100);
    lockoutInput();
    showProcessing('#data_loading');
    var useComma = false;



    for (var i = 0; i < accountCPL_Array.length; i++) {
        // Set default state of all line items to selected
        if ((accountCPL_Array[i].ItemSelected == "true") && accountCPL_Array[i].ItemDeleted == "false") {
            accountCPL_Array[i].ItemProcessed = false;
            itemCounter++;
            if (useComma == true) {
                theID += ',';
                lineState += ',';
            }
            theID += accountCPL_Array[i].VID;
            lineState += accountCPL_Array[i].VState;
            useComma = true
            accountCPL_Array[i].ItemSubmitted = true;
 
        }
        if (itemCounter >= batchSize) {
            logEvent(welcomeUserName, "begin post", "expireMultiCurrentPrice");
            $.post(
              G_AbsoluteUri + 'Home/expireCurrentPrice',
              { headerID: headerID, currentHeaderStatus: headerState, lineIDs: theID, tag: "test", currentLineStatus: lineState, startDate: startDate, userID: welcomeUserName, password: welcomePassword },
              handleMultiExpireCurrentPrice
                      );
            return;
        }

    }
    if (itemCounter > 0) {
    logEvent(welcomeUserName, "begin post", "expireMultiCurrentPrice");
    $.post(
      G_AbsoluteUri + 'Home/expireCurrentPrice',
      { headerID: headerID, currentHeaderStatus: headerState, lineIDs: theID, tag: "test", currentLineStatus: lineState, startDate: startDate, userID: welcomeUserName, password: welcomePassword },
      handleMultiExpireCurrentPrice
              );
    }
}

function handleMultiExpireCurrentPrice(content) {


    if (content != undefined && content != null && content != "") {

        var responseObject;
        var itemTotal = 0;
        var itemCompleteCount = 0;
        var itemRemainingCount = 0;

        releaseLockout(true);
        responseObject = JSON.parse(content);
        logEvent(welcomeUserName, "handle response", "MultiExpireCurrentPrice: " + responseObject.responseCode);
        if (responseObject.responseCode == "SUCCESS") {
            JSONobjectAccounts[G_accounts_currentIndex].status = "revising";
            setCustomerInformation(G_accounts_currentIndex);
            G_items_column_id = "VState";
            G_items_order = "ASC";
            G_items_targetColumn = "col1";

            G_currentCustomerHeaderVID = responseObject.HeaderID;
            JSONobjectAccounts[G_accounts_currentIndex].id = responseObject.HeaderID;
            for (var i = 0; i < accountCPL_Array.length; i++) {
              
                if ((accountCPL_Array[i].ItemSelected == "true") && (accountCPL_Array[i].ItemProcessed == false) && (accountCPL_Array[i].ItemSubmitted == true)) {
                    accountCPL_Array[i].REVOBJNUM = 100;
                    accountCPL_Array[i].EndDate = responseObject.EndDate;
                    accountCPL_Array[i].VState = "revising";
                    $("#end_date_" + i).text(responseObject.EndDate);
                    accountCPL_Array[i].ItemProcessed = true;
                    arraySelector(i, 'deselect');
                   // accountCPL_Array[i].ItemSelected = "false";
                    setLineStatus(i, "expire");

                }

                if (accountCPL_Array[i].ItemSelected == "true") {
                    itemTotal++;
                }
                if ((accountCPL_Array[i].ItemSelected == "true") && (accountCPL_Array[i].ItemProcessed == true)) {
                    itemCompleteCount++;
                }

                if (accountCPL_Array[i].ItemSelected == "true" && accountCPL_Array[i].ItemDeleted == "false" && accountCPL_Array[i].ItemProcessed == false && accountCPL_Array[i].ItemSubmitted == false) {
                    itemRemainingCount++;
                }

            }

            if (itemRemainingCount > 0) {
                showProcessing('#data_loading');
                ExpireCurrentPrice();
                return;
            }

            G_groupEditType = "";
            appstate = 'accountCPL';
            itemsFilter();
            $('#accountCPL_datapanel').scrollTop();
            closeModal();
        }
        else {
            //check for values
            if (responseObject.HeaderStatus != "") {
                JSONobjectAccounts[G_accounts_currentIndex].status = responseObject.HeaderStatus;
            }
            if (responseObject.HeaderID != "") {
                G_currentCustomerHeaderVID = responseObject.HeaderID;
                JSONobjectAccounts[G_accounts_currentIndex].id = responseObject.HeaderID;
            }

            if (responseObject.RememberMeCookie == 'INVALID') {
                logOut();
                return;
            }

            $("#alertMessageContent").html(responseObject.responseMessage);
            goModal('#alertMessageBox');

        }
    }
    else {
        alert("no content");

    }
}

var configurePriceSetter = function () {
     setPriceStepIncrement(0.09 + 0);
    //disablePriceStepIncrement();
    $('#cal_ind_g').html('=');
    $("#slider2").slider('option', 'value', 0);

    if (G_groupIsCoreCounter <= 0) {
        $('#set_TM1group').removeClass('active');
        $('#set_TM1group').removeClass('disabled');
        $('#set_TM1group').prop('disabled', false);

        $('#set_TM2group').removeClass('disabled');
        $('#set_TM2group').prop('disabled', false);
        $('#set_TM2group').removeClass('active');

        $('#set_TM3group').removeClass('disabled');
        $('#set_TM3group').prop('disabled', false);
        $("#set_TM3group").addClass('active');

        G_groupEditPriceLevel = 'TM3';
        $('#m_cal_value_g').html('TM3 Price');
        $('#buyingGroupMessage').css('display', 'none');


    } else {
        $('#set_TM1group').addClass('disabled');
        $('#set_TM1group').prop('disabled', true);
        $("#set_TM1group").addClass('active');

        $('#set_TM2group').addClass('disabled');
        $('#set_TM2group').prop('disabled', true);
        $("#set_TM3group").removeClass('active');

        $('#set_TM3group').addClass('disabled');
        $('#set_TM3group').prop('disabled', true);
        $("#set_TM3group").removeClass('active');


        G_groupEditPriceLevel = 'TM1';
        $('#m_cal_value_g').html('TM1 Price');
        $('#buyingGroupMessage').css('display', 'block');
    }
}

var showDateSetter = function () {
    $('#setcalendar2').css('visibility', 'visible');
    $('#datepicker_end').val('');
    setEndDate("");
    $('#datepicker_start').val(getPrettyDate());
    configurePriceSetter();
    goModal('#date_setter');
}

var showPriceSetter = function () {
    $('#setcalendar2').css('visibility', 'hidden');
    $('#accountCPL_groupeditprice .priceset').removeClass('active');
    
    configurePriceSetter();
    goModal('#accountCPL_groupeditprice');

}

var disablePriceStepIncrement = function () {
    $('#tab1Cent').removeClass('active');
    $('#tab9Cents').removeClass('active');
    $('#Gtab1Cent').removeClass('active');
    $('#Gtab9Cents').removeClass('active');
    $('#tab1Cent').addClass('disabled');
    $('#tab9Cents').addClass('disabled');
    $('#Gtab1Cent').addClass('disabled');
    $('#Gtab9Cents').addClass('disabled');
    $('#tab1Cent').prop('disabled', true);
    $('#tab9Cents').prop('disabled', true);
    $('#Gtab1Cent').prop('disabled', true);
    $('#Gtab9Cents').prop('disabled', true);

    $('#tab9Cents').addClass('active');
    $('#Gtab9Cents').addClass('active');
    G_priceStep = 0.09;
    $('#tabbar1').css('display','none');
    $('#tabbar2').css('display', 'none');
}
 


var setPriceStepIncrement = function (theValue) {
    $('#tab1Cent').removeClass('disabled');
    $('#tab9Cents').removeClass('disabled');
    $('#Gtab1Cent').removeClass('disabled');
    $('#Gtab9Cents').removeClass('disabled');
    $('#tab1Cent').prop('disabled', false);
    $('#tab9Cents').prop('disabled', false);
    $('#Gtab1Cent').prop('disabled', false);
    $('#Gtab9Cents').prop('disabled', false);
    $('#tabbar1').css('display', 'block');
    $('#tabbar2').css('display', 'block');

    if (theValue == 0.09) {
        G_priceStep = theValue;
        $('#tab1Cent').removeClass('active');
        $('#tab9Cents').addClass('active');
        $('#Gtab1Cent').removeClass('active');
        $('#Gtab9Cents').addClass('active');

    }
    if (theValue == 0.01) {
        G_priceStep = theValue;
        $('#tab9Cents').removeClass('active');
        $('#tab1Cent').addClass('active');
        $('#Gtab9Cents').removeClass('active');
        $('#Gtab1Cent').addClass('active');
    }

}

//expects 30,60,90,YE
var setEndDate = function (daysToAdd) {
    if (daysToAdd == undefined || daysToAdd == "") {
        G_daysToAdd = "";
        $('[id^="dateplus"]').removeClass('active');   
        return;
    }
    G_daysToAdd = daysToAdd;

   

    $('[id^="dateplus"]').removeClass('active');
    $('#dateplus' + daysToAdd).addClass('active');

    if ($('#datepicker_start').val() == "") {
        $('#accountCPL_setdate').addClass('disabled');

        return;
    }

    $('#accountCPL_setdate').removeClass('disabled');
   
    var startDate = new Date($('#datepicker_start').val());//.toString('M/d/yyyy');

    if (daysToAdd != "YE") {
        var newDate = new Date(startDate.getTime() + (parseInt(daysToAdd) * 24 * 60 * 60 * 1000));

        $('#datepicker_end').val(getPrettyDate(newDate));
        return;
    }
    var theYear = startDate.getFullYear();
    var theMonth = 11;//0 offset
    var theDay = 31;
    var newDate = new Date(theYear, theMonth, theDay);
    $('#datepicker_end').val(getPrettyDate(newDate));

}




var startup = function(){
    
    //G_AbsoluteUri initialized in Index.cshtml
    G_lockoutInput = false;
    G_filter_CustomerStatusArray = new Array();
    G_filter_CustomerGroupArray = new Array();
    G_filter_CPLThemeDisplayArray = new Array();
    G_filter_CPLBrandArray = new Array();
    G_filter_CPLPriceLevelArray = new Array();
    G_filter_CPLPromoPriceArray = new Array();
    G_filter_CPLAutoTM3Array = new Array();
    G_filter_ProductThemeDisplayArray = new Array();
    G_filter_CPLCorpPromoArray = new Array();

    initFilter("promo");
    initFilter("cpromo");
    initFilter("autotm3");

  
    $("#btn_OK").click(function () {
        $("#mask").hide();
        $("#alertMessageBox").hide();
    });

    $(document).on("click", ".disabled", function (e) {
        e.preventDefault();
    });

    

    $('#search_accounts').focus(function () {
        if ($('#search_accounts').val() == dealerPhrase)
        {
            $('#search_accounts').val('');
        }
        G_accountsFilterCalled = false;
    });

    $('#search_accounts').keypress(function (event) {
        if (event.keyCode == 13)
        {
            doSearchAccounts(true);
            return;
        }
    });
   
    $('#search_accounts').keyup(function (event) {

        if (event.keyCode == 13)
        {
            doSearchAccounts(true);
            return;
        }
        if ($('#search_accounts').val() == '')
        {
            G_accountsFilterCalled = false;
            doSearchAccounts(true);
            return; 
        }
    });

 
    $('#search_accounts').blur(function () {
        //if (getMobileOperatingSystem() == "iOS") {
        //     doSearchAccounts(false);//DO NOT EVER SET TO TRUE
        //}
        if ($('#search_accounts').val() == '')
        {
            $('#search_accounts').val(dealerPhrase);
            $('#search_icon').removeClass('toreset');
        }
    });

    $('#search_icon').click(function () {
       
        if ($(this).hasClass('toreset'))
        {
            $('#search_accounts').val('');
            $(this).removeClass('toreset');
            accountsFilter();
            $('#search_accounts').val(dealerPhrase);

        }
        else
        {
            accountsFilter();
        }
        focusOnElement('#search_accounts');

    });

    $('#search_accountCPL').focus(function () {
        if ($('#search_accountCPL').val() == searchCPLPhrase)
        {
            $('#search_accountCPL').val('');
        }
        G_itemsFilterCalled = false;

    });

    

    $('#search_accountCPL').blur(function () {
        //if (getMobileOperatingSystem() == "iOS") {
        //     doSearchAccountCPL(false); // DO NOT EVER SET TO TRUE
        //}
        if ($('#search_accountCPL').val() == '')
        {
            $('#search_accountCPL').val(searchCPLPhrase);
            $('#search_icon2').removeClass('toreset');

        }
    });

    $('#search_icon2').click(function () {

        if ($(this).hasClass('toreset'))
        {
            $('#search_accountCPL').val('');
            $(this).removeClass('toreset');

            itemsFilter();
            $('#search_accountCPL').val(searchCPLPhrase);

        }
        focusOnElement('#search_accountCPL');
     
    });


    $('#search_accountCPL').keyup(function (event) {
        if (event.keyCode == 13)
        {
            doSearchAccountCPL(true);
            return;
        }
       
        if ($('#search_accountCPL').val() == '')
        {
            G_itemsFilterCalled = false;
            doSearchAccountCPL(true);
            return;

        }
    });

    $('#search_accountCPL').keypress(function (event) {
        if (event.keyCode == 13) {
            doSearchAccountCPL(true);
            return;
        }

    });

  
    //$('#customSearchByDM').keypress(function (event) {
    //    if (event.keyCode == 13) {
    //        customerSearchOnChange();
    //        return;
    //    }
    //});

    //$('#customSearchByDM').keyup(function (event) {

    //    if (event.keyCode == 13) {
    //        customerSearchOnChange();
    //        return;
    //    }
    //    if ($('#customSearchByDM').val() == '') {
    //        $('#optmsg').html('You must enter at least 2 characters <br />to initiate a search by customer.');
    //        return;
    //    }
    //});


    $('#accountCPL_back').click(function () {
        goBack();
    });

    $('#btn_InactivityOK').click(function () {
        goBack();

    });

    

   

   // Search Add Products
    $('#search_addproducts').focus(function () {
       onFocus_search_addproducts();
    });



    $('#search_addproducts').blur(function () {
        //if (getMobileOperatingSystem() == "iOS")
        //{
        //     doSearchAvailable(false);
        //}
        if ($('#search_addproducts').val() == '') {
            $('#search_icon3').removeClass('toreset');
            $('#search_addproducts').val(searchCPLPhrase);
        }
       
    });

    $('#search_icon3').click(function () {
        if ($(this).hasClass('toreset'))//look for X
        {
            $('#search_addproducts').val('');
            $(this).removeClass('toreset');

            G_availableFilterCalled = false;
            doSearchAvailable(false);
           
        }
        //focusOnElement('#search_addproducts');
        $('#search_addproducts').focus();

    });


    $('#search_addproducts').keyup(function (event) {
        
        if (event.keyCode == 13) {
            doSearchAvailable(true);
            return;
        }

        if ($('#search_addproducts').val() == '') {
            G_availableFilterCalled = false;
            doSearchAvailable(false);
            return;
        }
    });

    $('#search_addproducts').keypress(function (event) {
        if (event.keyCode == 13) {
            G_availableFilterCalled = false;
            doSearchAvailable(true);
            return;
        }

    });

    //End Search Add Products



    $("#themedisplay_select").change(function () {
        var checkval = $('#themedisplay_select').val();

        if (checkval == 'none')
        {
            // Check value of #available_search
            checkval = $('#available_search').val();
            if (checkval == 'Style Name or Number')
            {
                $('#addProducts_search_btn').addClass('disabled');
            }
        }
        else {
            $('#addProducts_search_btn').removeClass('disabled');
        }
    });





    $('.filter_widget').click(function () {
        var state = $('.filter_widget').hasClass('active');
        var id = $(this).children('span').attr('id');
        var target = id.substring(id.lastIndexOf("_") + 1); // Everything after "_"
        setFilters(target);
    });



    $('#accounts_filter_apply').click(function () {
       // $('.filter_widget').addClass('active');
       // $('#filter_opts_accounts').html('Filters Applied');
    });

    $('#accountCPL_filter_apply').click(function () {
        $("filter_opts_accountCPL_widget").addClass('active');;
        $('#filter_opts_accountCPL').html('Filters Applied');
    });

    $('#accounts_filter_clear').click(function () {
        G_accountsFilterCalled = false;
        unsetFilters('accounts');
    });

    $('#cplaccounts_filter_clear').click(function () {
        G_itemsFilterCalled = false;
        unsetFilters('accountCPL');
    });


    $('.clear_widget').click(function () {
        //debugger;
        var id = $(this).attr('id');
        var target = id.substring(0, id.indexOf("_")); // Everything before "_";
        G_itemsFilterCalled = false;
        G_accountsFilterCalled = false;
        unsetFilters(target);
    });

    $('#addProducts_clear').click(function () {
        clearProducts();
    });

    $('[id^="group_"], [id^="status_"]').click(function () {
        var id = $(this).attr('id');
        var id_o = id.substring(id.lastIndexOf("_") + 1); // Everything after "_"
        var id_a = id.substring(0, id.indexOf("_")); // Everything before "_"
        id = id_a + "_all";

        if (id_o != 'all')
        {
            document.getElementById(id).checked = false;
        }
        else {
            $('[id^="' + id_a + '_"]').attr('checked', false);
            document.getElementById(id).checked = true;
        }

    });


    $('.sort').click(function () {
       
        var column_id;
        var order;
        var section;
        var targetColumn;
        // Get column id
        var id = $(this).attr('id');
        var column_id_array = id.toString().split("_", 2);
        column_id = column_id_array[1];
        // Get section and sort panel idf
         section = appstate; 
         order = 'ASC';
        var isActive = $(this).hasClass('active');
        var classList = $(this).attr('class').split(/\s+/);
        $.each(classList, function (index, item) {
            if (item.indexOf("col") != -1) {
                targetColumn = item;
            }
        });

        logEvent(welcomeUserName, "sort-click", appstate );

        $('.sort').removeClass('active');
        $('.line').removeClass('active');

        $(this).addClass('active');

        if (isActive == true) {
            var bg = $(this).children().children('.sort_icon').css('background-image');
            bg = bg.substring(0, bg.length - 1);
            var fileNameIndex = bg.lastIndexOf("/") + 1;
            var filename = bg.substr(fileNameIndex);
            filename = filename.replace('"', '');
            filename = filename.replace("'", "");

            if (filename == 'drop_sorter_up.png')
            {
                order = 'ASC';
                // Change icon for .sort_icon
                $('.sort.active .sort_icon').css('background-image', 'url(' + G_AbsoluteUri + 'Content/images/ui/drop_sorter.png)');
            }
            else
            {
                  order = 'DESC';
                // Change icon for .sort_icon
                $('.sort.active .sort_icon').css('background-image', 'url(' + G_AbsoluteUri + 'Content/images/ui/drop_sorter_up.png)');
            }
        }
        else
        {
            order = 'ASC';
            $('.sort').removeClass('active');
            $('.line').removeClass('active');
            $(this).addClass('active');
            $('.sort.active .sort_icon').css('background-image', 'url(' + G_AbsoluteUri + 'Content/images/ui/drop_sorter.png)');
        }

        switch (appstate)
        {
            case 'accounts':
                G_accounts_column_id = column_id;
                G_accounts_order = order;
                G_accounts_section = section;
                G_accounts_targetColumn = targetColumn;
                break;
            case 'accountCPL':
                G_items_column_id = column_id;
                G_items_order = order;
                G_items_section = section;
                G_items_targetColumn = targetColumn;
                break;
            case 'addProducts':
                break;
            default:

        }
        //now change the contexts befor calling the sort.
        //this will cancel any processing of updates that have already been submitted 
        //with the previous context.

        if ($('.calpanel').is(':visible')) {
            $('.calpanel').slideUp(300, function () {
                setTimeout(function () { sortColumn(column_id, section, order, targetColumn); }, 40);
            });
        }
        else
        {
            sortColumn(column_id, section, order, targetColumn);
        }

    });


    // Set initial input target as active - var input_target = '#m_cal_value_l';
    $(input_target).addClass('active');

    $('#m_cal_value_l').click(function (e) {
        try {
            if (constrainedPrice == true) {
                e.preventDefault();
            }
            else {
                input_target = '#m_cal_value_l';
                var state = $(this).hasClass('active');
                var target = $(this);

                // Set slider value
                var thisvalue = $(this).html();
                thisvalue = parseFloat(thisvalue.split(' ')[1]);
                thisvalue = thisvalue - current_Load;
                buildSlider(thisvalue, current_Load);

                if (state != true) {
                    $('.m_cal_value').removeClass('active');
                    $('.m_cal_indicator').animate({ 'opacity': 0 }, 300, function () {

                        $('#cal_ind_l').animate({ 'opacity': 1 }, 300);
                        $(target).addClass('active');
                    });

                }

            }
        }
        catch (err) {
            logError(welcomeUserName, "#m_cal_value_l.click", err.message, err.stack, '');

        }

    });


    $('#m_cal_value_r').click(function (e) {
        try {
            if (constrainedPrice == true) {
                e.preventDefault();
            }
            else {
                input_target = '#m_cal_value_r';
                var state = $(this).hasClass('active');
                var target = $(this);

                // Set slider value
                var thisvalue = $(this).html();
                thisvalue = parseFloat(thisvalue.split(' ')[1]);
                thisvalue = thisvalue - current_Load;
                buildSlider(thisvalue, current_Load);

                if (state != true) {
                    $('.m_cal_value').removeClass('active');
                    $('.m_cal_indicator').animate({ 'opacity': 0 }, 300, function () {

                        $('#cal_ind_r').animate({ 'opacity': 1 }, 300);
                        $(target).addClass('active');
                    });

                }

            }
        }
        catch (err) {
            logError(welcomeUserName, "#m_cal_value_r.click", err.message, err.stack, '');

        }

    });

   


    $('#accountCPL_edit_btn').click(function () {
   
        if ($('#accountCPL_edit_btn').hasClass('disabled')) {
            //alert('no no no');
            //cancel button press here
            return;
        }
        if (checkLastActivity() == false) {
            return;
        }
        if (isLockout() == false) {
           
            $('.window').fadeOut(100);
            var theID = accountCPL_Array[G_current_Index].VID;
            var lineState = accountCPL_Array[G_current_Index].VState;
            var startDate =  accountCPL_Array[G_current_Index].StartDate;
            var proposedRoll = $("#m_cal_value_l").text().replace("$", "").replace(" ", "");
            var proposedCut = $("#m_cal_value_r").text().replace("$", "").replace(" ", "");
            var headerID = G_currentCustomerHeaderVID;
            var headerState = G_currentHeaderStatus;
        
            lockoutInput();
            showProcessing('#data_loading');

            if (G_submitAs != "newpromo")
            {
                logEvent(welcomeUserName, "begin post", "savePrice");
                $.post(
                  G_AbsoluteUri + 'Home/savePrice',
                  { headerID: headerID, currentHeaderStatus: headerState, startDate: startDate, lineIDs: theID , tag: "test", currentLineStatus: lineState, proposedRoll: proposedRoll, proposedCut: proposedCut, userID: welcomeUserName, password: welcomePassword },
                  handleSavePrice
                          );
            }
            else
            {
                //promo
                var startDate = new Date($('#datepicker_start').val()).toString('M/d/yyyy');
                var endDate = new Date($('#datepicker_end').val()).toString('M/d/yyyy');


                logEvent(welcomeUserName, "begin post", "savePromoPrice");
                $.post(
                G_AbsoluteUri + 'Home/savePromoPrice',
                { headerID: headerID, currentHeaderStatus: headerState, lineIDs: theID, tag: "test", currentLineStatus: lineState, proposedRoll: proposedRoll, proposedCut: proposedCut, startDate: startDate, endDate: endDate , userID: welcomeUserName, password: welcomePassword },
                handleSavePrice
                        );
            }
        }

    });

    
    //function handleSetLoggingStatus(content) {

    //    if (content != undefined && content != null && content != "")
    //    {

    //        var responseObject;
    //        var endIndexNumber = G_current_Index;
    //        var itemCopy;
    //        var newLineID;
    //        var newStatuss;
    //        responseObject = JSON.parse(content);
    //        logEvent(welcomeUserName, "handle response", "SetLogStatus: " + responseObject.responseCode);
    //        if (responseObject.responseCode == "SUCCESS")
    //        {
    //            //update the status
    //            if (responseObject.responseMessage == "Off")
    //            {
    //                G_loggingEnabled = false;
    //            } else {
    //                G_loggingEnabled = true;
    //            }

    //            $("#logging_status").html("<a>logging is " + responseObject.responseMessage + "</a>");
    //        }
    //        else
    //        {
    //            G_loggingEnabled = false;
    //        }
    //    }
    //}

    function handleSavePrice(content) {
        releaseLockout(true);
        
        if (content != undefined && content != null && content != "") 
        {

            var responseObject;
            var endIndexNumber = G_current_Index;
            var itemCopy;
            var newLineID;
            var newStatuss;

          
            responseObject = JSON.parse(content);
            logEvent(welcomeUserName, "handle response", "savePrice: " + responseObject.responseCode);
            if (responseObject.responseCode == "SUCCESS")
            {

               
                if (G_currentHeaderStatus == "denied" || G_currentHeaderStatus == "withdrawn") {
                    updateCPLLineStatus(responseObject.HeaderID);
                }

                JSONobjectAccounts[G_accounts_currentIndex].status = "revising";

                G_items_column_id = "VState";
                G_items_order = "ASC";
                G_items_targetColumn = "col1";

                setCustomerInformation(G_accounts_currentIndex);
                if (endIndexNumber < accountCPL_Array.length - 1) {
                    endIndexNumber++;
                    itemCopy = JSON.parse(JSON.stringify(accountCPL_Array.slice(G_current_Index, endIndexNumber)));
                }
                else {
                    itemCopy = JSON.parse(JSON.stringify(accountCPL_Array.slice(G_current_Index)));
                }

                
                newLineID = responseObject.LineIDs[0];
                newStatuss = responseObject.Statuss[0];

                accountCPL_Array[G_current_Index].VID = newLineID;
                accountCPL_Array[G_current_Index].ProposedCutPriceVAmountAmount = $("#m_cal_value_r").text().replace("$", "").replace(" ", "");
                $("#rollprice").text($("#m_cal_value_r").text());
                accountCPL_Array[G_current_Index].ProposedRollPriceVAmountAmount = $("#m_cal_value_l").text().replace("$", "").replace(" ", "");
                $("#cutprice").text($("#m_cal_value_l").text());
              
               
                if (accountCPL_Array[G_current_Index].RollLoad == 0) {
                    accountCPL_Array[G_current_Index].PRELOADROLL = accountCPL_Array[G_current_Index].ProposedRollPriceVAmountAmount;
                }
                if (accountCPL_Array[G_current_Index].CutLoad == 0) {
                    accountCPL_Array[G_current_Index].PRELOADCUT = accountCPL_Array[G_current_Index].ProposedCutPriceVAmountAmount;
                }
                
                accountCPL_Array[G_current_Index].IsAutoTM3Promo = "";
                $("#cpl_indicator_" + G_current_Index).removeClass("autoTM3");
                isAutoTM3Promo--;

                $("#cutLoadIndicator_" + G_current_Index).removeClass("loaded");
                $("#rollLoadIndicator_" + G_current_Index).removeClass("loaded");

                $("#proposedCutAmountAmount_" + G_current_Index).text(CurrencyFormatted(accountCPL_Array[G_current_Index].ProposedCutPriceVAmountAmount));
                $("#proposedRollAmountAmount_" + G_current_Index).text(CurrencyFormatted(accountCPL_Array[G_current_Index].ProposedRollPriceVAmountAmount));

                G_currentCustomerHeaderVID = responseObject.HeaderID;
                JSONobjectAccounts[G_accounts_currentIndex].id = responseObject.HeaderID;


                if (G_submitAs == "add") 
                {

                    accountCPL_Array[G_current_Index].VState = newStatuss;
                    setLineStatus(G_current_Index, "add");

                    accountCPL_Array[G_current_Index].StartDate = G_SystemDate;
                    accountCPL_Array[G_current_Index].pricePointUpdateComplete = false;
                    
                    var lineID = accountCPL_Array[G_current_Index].VID;
                   
                    sectionLoader(appstate);
                
                    setActiveCPLRow('m_li_target_' + current_Line.toString(), 'false');
                 
                }

              
                if (G_submitAs == "edit") {

                    accountCPL_Array[G_current_Index].REVOBJNUM = 100;
                    accountCPL_Array[G_current_Index].VState = newStatuss;
                    setLineStatus(G_current_Index, "edit");
                    accountCPL_Array[G_current_Index].pricePointUpdateComplete = false;
                    var startDate = new Date(accountCPL_Array[G_current_Index].StartDate);
                    var todayDate = new Date(G_SystemDate);
                    if (startDate < todayDate) {
                        accountCPL_Array[G_current_Index].StartDate = G_SystemDate;
                    }

                    sectionLoader(appstate);
                
                    setActiveCPLRow('m_li_target_' + current_Line.toString(), 'false');
                
                }
               

              
                if (G_submitAs == "newpromo") {

                    
                    var startDate = new Date($('#datepicker_start').val()).toString('M/d/yyyy');
                    var endDate = new Date($('#datepicker_end').val()).toString('M/d/yyyy');
                    accountCPL_Array[G_current_Index].StartDate = startDate;
                    accountCPL_Array[G_current_Index].EndDate = endDate;
                    accountCPL_Array[G_current_Index].VID = newLineID;
                    accountCPL_Array[G_current_Index].MODOBJNUM = 100;
                    accountCPL_Array[G_current_Index].VState = "draft";
                    accountCPL_Array[G_current_Index].pricePointUpdateComplete = false;
                  
                    itemCopy[0].pricePointUpdateComplete = false;

                    accountCPL_Array.push(itemCopy[0]);
                    appstate = 'accountCPL';
                       
                    sectionLoader(appstate);
                  
                    setActiveCPLRow('m_li_target_' + current_Line.toString(), 'false');
      

                }

                

                closeModal();
            }
            else
            {

                //check for values
                if (responseObject.HeaderStatus != "") {
                    JSONobjectAccounts[G_accounts_currentIndex].status = responseObject.HeaderStatus;
                }
               
                if (responseObject.HeaderID != "") {
                    G_currentCustomerHeaderVID = responseObject.HeaderID;
                    JSONobjectAccounts[G_accounts_currentIndex].id = responseObject.HeaderID;
                }

                $('#datepicker_end').val('');
                setEndDate("");
                $('#datepicker_start').val(getPrettyDate());

                if (responseObject.RememberMeCookie == 'INVALID')
                {
                    logOut();
                    return;
                }

                $("#alertMessageContent").html(responseObject.responseMessage);
                goModal('#alertMessageBox');

            }
        } 
        else 
        {
            alert("no content");
            
        }
    }



   

    $('#accountCPL_expire_btn').click(function () {
      
        var theID = accountCPL_Array[G_current_Index].VID;
        var lineState = accountCPL_Array[G_current_Index].VState;
        var headerID = G_currentCustomerHeaderVID;
        var headerState = G_currentHeaderStatus;
        var startDate = accountCPL_Array[G_current_Index].StartDate;

        if (checkLastActivity() == false) {
            return;
        }

        $('.window').fadeOut(100);
        lockoutInput();
        showProcessing('#data_loading');
        logEvent(welcomeUserName, "begin post", "expireCurrentPrice");
        $.post(
          G_AbsoluteUri + 'Home/expireCurrentPrice',
          { headerID: headerID, currentHeaderStatus: headerState, lineIDs: theID, tag: "test", currentLineStatus: lineState, startDate: startDate ,userID: welcomeUserName, password: welcomePassword },
          handleExpireCurrentPrice
                  );
    });

    function handleExpireCurrentPrice(content) {
     
        releaseLockout(true);
        if (content != undefined && content != null && content != "") {

            var responseObject;
            
            responseObject = JSON.parse(content);
            logEvent(welcomeUserName, "handle response", "ExpireCurrentPrice: " + responseObject.responseCode);
            if (responseObject.responseCode == "SUCCESS")
            {
                JSONobjectAccounts[G_accounts_currentIndex].status = "revising";
                setCustomerInformation(G_accounts_currentIndex);
                G_items_column_id = "VState";
                G_items_order = "ASC";
                G_items_targetColumn = "col1";

                G_currentCustomerHeaderVID = responseObject.HeaderID;
                JSONobjectAccounts[G_accounts_currentIndex].id = responseObject.HeaderID;

                accountCPL_Array[G_current_Index].REVOBJNUM = 100;
                accountCPL_Array[G_current_Index].EndDate = responseObject.EndDate;
                accountCPL_Array[G_current_Index].VState = "revising";
                $("#end_date_" + G_current_Index).text(responseObject.EndDate);
                setLineStatus(G_current_Index, "expire");
               
                var newLineID = accountCPL_Array[G_current_Index].VID;
                appstate = 'accountCPL';
                sectionLoader(appstate);  
                setActiveCPLRow('m_li_target_' + current_Line.toString(), 'false');
                closeModal();
            }
            else {
                //check for values
                if (responseObject.HeaderStatus != "")
                {
                    JSONobjectAccounts[G_accounts_currentIndex].status = responseObject.HeaderStatus;
                }
                if (responseObject.HeaderID != "")
                {
                    G_currentCustomerHeaderVID = responseObject.HeaderID;
                    JSONobjectAccounts[G_accounts_currentIndex].id = responseObject.HeaderID; 
                }

                if (responseObject.RememberMeCookie == 'INVALID') {
                    logOut();
                    return;
                }

                $("#alertMessageContent").html(responseObject.responseMessage);
                goModal('#alertMessageBox');
              
            }
        }
        else
        {
            alert("no content");

        }
    }

    var updatePage = function (contextID) {
  
        for (j = CPLpageArray[G_pagingCPLCurrentIndex].firstRow; j <= CPLpageArray[G_pagingCPLCurrentIndex].lastRow; j++) {
            accountCPL_Array[j].ThreadNumber = j;
            if (contextID == G_pricePointItemsContext) {
                processPricePointItemUI(accountCPL_Array[j], j);
            }
        }

    }

    $('#accountCPL_datapanel').scroll(function () {
        try {
            if (accountCPL_Array.length >= G_pagingCPLMaxSize && G_pagingCPLCurrentIndex < CPLpageArray.length) {
                var targetRow = (CPLpageArray[G_pagingCPLCurrentIndex].lastRow - CPLpageArray[G_pagingCPLCurrentIndex].firstRow) + CPLpageArray[G_pagingCPLCurrentIndex].firstRow;

                if ($("#accpl_line_" + targetRow).offset().top < $('#accountCPL_datapanel').scrollTop() + $('#accountCPL_datapanel').outerHeight()) {

                    G_pagingCPLCurrentIndex += 1;
                    if (G_pagingCPLCurrentIndex < CPLpageArray.length) {
                        var myContext = G_pricePointItemsContext;
                        $('#accountCPL_datapanel').append(CPLpageArray[G_pagingCPLCurrentIndex].pageContent);
                        $('#endPage_' + (G_pagingCPLCurrentIndex - 1).toString()).slideUp(600);
                        //now update the pricelevels
                        setTimeout(updatePage(myContext), 200);
                    }
                    else {
                        $('#endPage_' + (G_pagingCPLCurrentIndex - 1).toString()).css('display', 'none');;
                    }
                }
            }
        } catch (err) {
            var test = err.message + err.stack;
        }
    });
   



    $('#constrainer').click(function () {
        var state = $(this).hasClass('active');
        if (state == true) {
            setTimeout($(this).removeClass('active'), 500);
    

            $('.m_cal_value').removeClass('active');
            $('.m_cal_indicator').animate({ 'opacity': 0 }, 300, function () {

                if (input_target == '#m_cal_value_l') {
                    $('#cal_ind_l').animate({ 'opacity': 1 }, 300);
                }
                else {
                    $('#cal_ind_r').animate({ 'opacity': 1 }, 300);
                }

                $(input_target).addClass('active');
            });

            constrainedPrice = false;

            // Set slider value
            var thisvalue = $(input_target).html();
            thisvalue = parseFloat(thisvalue.split(' ')[1]);
            thisvalue = thisvalue - current_Load;
            buildSlider(thisvalue, current_Load);

        }
        else {
            setTimeout($(this).addClass('active'), 500);
            $('.m_cal_indicator').animate({ 'opacity': 0 }, 300, function () {

                $('#m_cal_value_l').addClass('active');
                $('#m_cal_value_r').addClass('active');
            });
            input_target = '#m_cal_value_l';
            constrainedPrice = true;
            buildSlider(0, current_Load);

        }

    });

    $('#minus_btn').click(function () {
        calculateClick(G_priceStep * -1 , this.id);
    });

    $('#plus_btn').click(function () {
        calculateClick(G_priceStep, this.id);
    });

    $('#gminus_btn').click(function () {
        calculateGroupClick(G_priceStep * -1);
    });

    $('#gplus_btn').click(function () {
        calculateGroupClick(G_priceStep);
    });

    // MODAL WINDOWS
    //Select all the a tag with name equal to modal
    $('a[name=modal]').click(function (e) {
        //Cancel the link behavior
        e.preventDefault();
        //Get the A tag
        var id = $(this).attr('href');
        goModal(id);
    });

    $('.window .close').click(function (e) {
        e.preventDefault();
        $('#mask, #mask2').fadeOut(600);
        $('.window').fadeOut(100);
    });

    //if mask is clicked
    $('#mask').click(function () {
        $(this).fadeOut(600);
        $('.window').fadeOut(100);
    });

    $('#mask2').click(function () {
        $(this).fadeOut(600);
        $('.window').fadeOut(100);
    });


    $('#accountCPL_setdate').click(function (e) {
        var nogo = $(this).hasClass('disabled');
        if (nogo == true) {
            e.preventDefault();
        }
        else {
            if (G_groupEditType == "newpromo") {
                innerModal('#accountCPL_groupeditprice');
            }
            else {
            innerModal('#accountCPL_editprice');
            }
        }

    });

    //todays date
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;

    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    var mm_str = month[today.getMonth()];

    var yyyy = today.getFullYear();
    today = mm_str + ' ' + dd + ', ' + yyyy;
    today = getPrettyDate();

    $('.startdate input').val(getPrettyDate());

    $('#datepicker_start').Zebra_DatePicker({
        onChange: function (view, elements) {
            // If needed
            $('#datepicker_txt').html('To apply, click the day you wish this <br />limited time price to begin.');
        },
        onSelect: function (view, elements) {
            // If needed
            $('#datepicker_txt').html('To set a date, click on the input fields or <br />on the calendar icon next to the input fields.');

            
            // Check that endDate is not earlier than startDate, if so change endDate
            startDate = $('.startdate input').val();
            endDate = $('.enddate input').val();

            var valsplit = startDate.split(',');
            var startDateInt = valsplit[0];
            var startDateYear = parseInt(valsplit[1]);

            valsplit = startDateInt.split(' ');
            startDateInt = parseInt(valsplit[1]);
            var startDateMonth = valsplit[0];

            valsplit = endDate.split(',');
            var endDateInt = valsplit[0];
            var endDateYear = parseInt(valsplit[1]);

            valsplit = endDateInt.split(' ');
            endDateInt = parseInt(valsplit[1]);
            var endDateMonth = valsplit[0];


            var startDateMonthIndex = month.indexOf(startDateMonth);
            var endDateMonthIndex = month.indexOf(endDateMonth);

            // Test paired selector
            var validval = isNaN(endDateInt);
            if (validval == true) {
                endDateInt = 0;
            }

            if ((startDateInt < endDateInt) && (startDateMonthIndex <= endDateMonthIndex) && (startDateYear <= endDateYear)) {
                // All is good
            }
            else {
                if ((startDateMonthIndex < endDateMonthIndex) || (startDateYear < endDateYear)) {
                    // All is good
                }
                else {
                    if (endDateInt != 0) {
                        // Change end date automatically
                        var changeEnd = startDateMonth + ' ' + (startDateInt + 1) + ', ' + startDateYear;
                        $('.enddate input').val(changeEnd);
                    }
                }



            }

            setEndDate(G_daysToAdd);

            // Check if both fields have values
            if (endDate != '') {
               
                $('#accountCPL_setdate').removeClass('disabled');
            }

        },
        onClear: function (view, elements) {
            $('#accountCPL_setdate').addClass('disabled');
             setEndDate(G_daysToAdd);
        },
        format: 'F d, Y',
        first_day_of_week: 0,
        inside: false,
        pair: $('#datepicker_end'),
        direction: true,
        offset: [0, 0]

    });

    $('#datepicker_end').Zebra_DatePicker({
        onChange: function (view, elements) {
            // If needed
            $('#datepicker_txt').html('To apply, click the day you wish this <br />limited time price to expire.');
        },
        onSelect: function (view, elements) {
            // If needed
            $('#datepicker_txt').html('To set a date, click on the input fields or <br />on the calendar icon next to the input fields.');

            // Check that endDate is not earlier than startDate, if so change endDate
            startDate = $('.startdate input').val();
            endDate = $('.enddate input').val();

            // Check if both fields have values
            if (startDate != '') {
                $('#accountCPL_setdate').removeClass('disabled');
            }
            setEndDate("");

        },
        onClear: function (view, elements) {
            $('#accountCPL_setdate').addClass('disabled');
            setEndDate("");
        },
        format: 'F d, Y',
        first_day_of_week: 0,
        inside: false,
        direction: 1,
        offset: [0, 0]

    });


    
    $.post(
        G_AbsoluteUri + 'Home/getConfigParameters',
        { username: welcomeUserName, password: welcomePassword, parameters: "GroupEditMinimumValue,GroupEditMaximumValue,GroupEditEnabled,MaximumInactivityDuration" },
        handleGetConfigParameters
            );

}
//end startup


$(document).ready(function () {
    try {
        if (startup) {
            startup();
        }
        if (doOnReady) {
            doOnReady();
        }
       
        
    } catch (err) {
        //do nothing here
        logError(welcomeUserName, "document.ready", err.message, err.stack, '');
       
    }

});

function startPricePointUpdates() {

    accountCPL_ArrayIndex = [{ "indexCount": 0, "indexMax": 0 }, { "indexCount": 0, "indexMax": 0 }, { "indexCount": 0, "indexMax": 0 }, { "indexCount": 0, "indexMax": 0 }, { "indexCount": 0, "indexMax": 0 }];
    G_cancelGetPricePointItems = "false";
    G_pricePointItemsComplete = "false";
    accountCPL_ArrayIndex[0].indexCount = 0;
    accountCPL_ArrayIndex[1].indexCount = 0;
    accountCPL_ArrayIndex[2].indexCount = 0;
    accountCPL_ArrayIndex[3].indexCount = 0;
    accountCPL_ArrayIndex[4].indexCount = 0;

    if (accountCPL_Array.length > 0) {
        accountCPL_Array[0].indexMax = accountCPL_Array.length - 1;
        var segmentCount = 4;
        var segmentSize = Math.floor(accountCPL_Array.length / segmentCount);
        var segmentRemainder = accountCPL_Array.length % segmentCount;
        if (accountCPL_Array.length > 25) {
            accountCPL_ArrayIndex[0].indexCount = 0;
            accountCPL_ArrayIndex[0].indexMax = (segmentSize * 1) - 1;
            accountCPL_ArrayIndex[1].indexCount = (segmentSize * 1);
            accountCPL_ArrayIndex[1].indexMax = (segmentSize * 2) - 1;
            accountCPL_ArrayIndex[2].indexCount = (segmentSize * 2);
            accountCPL_ArrayIndex[2].indexMax = (segmentSize * 3) - 1;
            accountCPL_ArrayIndex[3].indexCount = (segmentSize * 3);
            accountCPL_ArrayIndex[3].indexMax = (segmentSize * 4) - 1;
            accountCPL_ArrayIndex[4].indexCount = (segmentSize * 4)
            accountCPL_ArrayIndex[4].indexMax = (segmentSize * 4) + segmentRemainder - 1;

            accountCPLDataUpdate(0);
            setTimeout(function () { accountCPLDataUpdate(1) }, 500);
            setTimeout(function () { accountCPLDataUpdate(2) }, 700);
            setTimeout(function () { accountCPLDataUpdate(3) }, 900);
            setTimeout(function () { accountCPLDataUpdate(4) }, 1200);
        } else {
            accountCPL_ArrayIndex[0].indexCount = 0;
            accountCPL_ArrayIndex[0].indexMax = (accountCPL_Array.length) - 1;
            accountCPLDataUpdate(0);
        }
    }
}


function handleItemResult(content) {
   

    releaseLockout(true);
    if (content != undefined && content != null && content != "") {
        
        var responseObject;
        responseObject = JSON.parse(content);
        logEvent(welcomeUserName, "handle response", "ItemResult: " + responseObject.responseCode);
        if (responseObject.responseCode == "SUCCESS") {
            G_SystemDate = responseObject.SystemDate;

        }
        else {
            if (responseObject.RememberMeCookie == 'INVALID') {
                logOut();
                return;
            }
            setWelcomeMessage(welcomeFullName);
            $("#alertMessageContent").html(responseObject.responseMessage);
            goModal('#alertMessageBox');
            return;
        }

        G_readOnly = true;

        if (welcomeUserName.toUpperCase() == JSONobjectAccounts[G_accounts_currentIndex].workFlowOwner.toUpperCase()) {
            G_readOnly = false;
        }
        if (G_userRole == "system-user") {
            G_readOnly = false;
        }
      
        //init group edit indicator here
        G_groupEditType = "";
        accountCPL_Array = responseObject.CPLLines;

        appstate = 'accountCPL';
        initFilter("theme");
        initFilter("brand");
        initFilter("promo");
        initFilter("cpromo");
        initFilter("autotm3");
        initFilter("pricelevel");
      
        G_items_column_id = "VState";
        G_items_order = "ASC";
        G_items_targetColumn = "col1";
        sectionLoader(appstate);
        setActiveCPLRow('m_li_target_' + current_Line.toString(), 'false');
   
    }
}

var handlePriceList = function (content) {
    //do something
    var testme = content;
    G_selectType = "User";
   // debugger
    if (content) {
        $("#theBody").removeClass('mpa_login');
        $("#theBody").addClass('mpa_app');
        $("#theBody").html(content);

        if (startup) {
            startup();
        }
        if (doOnPriceListReady) {
            doOnPriceListReady();
        }
        setLogoutButtons();
        //getConnectionSpeed();

    }
}

var handlePriceListAndSelectCustomer = function (content) {
    //do something
    var testme = content;
    // debugger
    if (content) {
        $("#theBody").removeClass('mpa_login');
        $("#theBody").addClass('mpa_app');
        $("#theBody").html(content);

        if (startup) {
            startup();
        }
        //if (doOnPriceListReady) {
        //    doOnPriceListReady();
        //}

        //getConnectionSpeed();
        $.post(
         G_AbsoluteUri + 'Home/getAccount',
         { UserName: welcomeUserName, Domain: "NA", Password: welcomePassword, VID: G_currentCustomerHeaderVID,  UserNameAs: welcomeUserNameAs },
         handleGetSingleAccount
        );

    }
}
var setLogoutButtons = function(){
    if (G_userRole != "TM" && G_selectType == "User") {
        $("#logging_status").html('<a  href="javascript:goBackToAccountSelect();"  >Change User </a>');

    }
    else if (G_userRole != "TM" && G_selectType != "User") {
        $("#logging_status").html('<a href="javascript:goBackToAccountSelect();" >Change Customer </a>');
    }
    else {
        $("#logging_status").html("");
    }
}


var selectUser = function (itemIndex) {

    G_SelectCustomerState = "byOwner";
    welcomeUserNameAs = G_ownerList[itemIndex].ownerCode;
    welcomeFullNameAs = G_ownerList[itemIndex].ownerFullName;
    //G_ownerList = [];
    $.post(
     G_AbsoluteUri + 'Home/_priceList',              
     { UserName: welcomeUserName, Domain: "NA", Password: welcomePassword, UserNameAs: welcomeUserNameAs },
     handlePriceList
   
    );
}

var handleGetSingleAccount = function (content) {
    var id = "accnt_line_0";
    var theTargetLine = "0";
    G_selectType = "Customer";
    releaseLockout(true);
    if (content != undefined && content != null && content != "") {

        var responseObject;
        responseObject = JSON.parse(content);
        logEvent(welcomeUserName, "handle response", "GetAccounts: " + responseObject.responseCode);
        if (responseObject.responseCode == "SUCCESS") {
            JSONobjectAccounts = responseObject.CPLList;

        }
        else {
            $("#alertMessageContent").html(responseObject.responseMessage);
            goModal('#alertMessageBox');
            return;
        }

        setLogoutButtons();
        getConnectionSpeed();
        accountsFilter();


    }

    on_m_li_click(id, 'accnt_line_');
}

var selectCustomer = function (itemIndex) {
   
    G_SelectCustomerState = "byCustomer";
  
    G_currentCustomerHeaderVID = G_customerList[itemIndex].vid;
    welcomeUserNameAs = G_customerList[itemIndex].workFlowOwner;
    //add this single customer to the accountArray;

    //G_customerList = [];
    $.post(
    G_AbsoluteUri + 'Home/_priceList',
    { UserName: welcomeUserName, Domain: "NA", Password: welcomePassword, UserNameAs: welcomeUserNameAs },
    handlePriceListAndSelectCustomer

   );
    
}


var goBackToAccountSelect = function(){
    try{
    lockoutInput();
    closeModal();
    showProcessing('#data_loading');
    G_cancelGetPricePointItems = "true";
    appstate = 'accounts';
    setWelcomeMessage(welcomeFullName);
    G_accountsFilterCalled = false;
    clearFilters('accounts');
    clearFilters('accountCPL');
    clearFilters('addProducts');
    $('#search_accountCPL').val("");

        $.post(
                   G_AbsoluteUri + 'Home/_account_select',
                   { UserName: welcomeUserName, Domain: "NA", Password: welcomePassword, UserNameAs: welcomeUserNameAs },
                   handleAccountSelect
                    );
         
    } catch (err)
    {
        logError(welcomeUserName, " goBackToAccountSelect", err.message, err.stack, '');
    }
}


function gotoBranchSelect() {
    try {
        $.post(
                    G_AbsoluteUri + 'Home/_branch_select',
                    { UserName: welcomeUserName, Domain: "NA", Password: welcomePassword, UserNameAs: welcomeUserNameAs },
                    handleBranchSelect
                    );

    } catch (err) {
        logError(welcomeUserName, " goBackToBranchSelect", err.message, err.stack, '');
    }
}

   

function goBack() {
    try {
        debugger;
        lockoutInput();
        closeModal();
        showProcessing('#data_loading');
        G_cancelGetPricePointItems = "true";
        appstate = 'accounts';
        setWelcomeMessage(welcomeFullName);
        G_accountsFilterCalled = false;
        clearFilters('accounts');
        clearFilters('accountCPL');
        clearFilters('addProducts');
        $('#search_accountCPL').val("");
      
       

        if (G_userRole == 'TM' |  G_selectType == "User") {
            $.post(
                   G_AbsoluteUri + 'Home/getAccounts',
                       { UserName: welcomeUserName, Domain: "NA", Password: welcomePassword, UserNameAs: welcomeUserNameAs },
                       handleGetAccounts
                   );
        } else {
            $.post(
                       G_AbsoluteUri + 'Home/_account_select',
                       { UserName: welcomeUserName, Domain: "NA", Password: welcomePassword, UserNameAs: welcomeUserNameAs },
                       handleAccountSelect
                        );
            }
    
          

       
    } catch (err) {
        logError(welcomeUserName, "goBack", err.message, err.stack, '');
      
    }
}

var addTheseNow = function (parm1) {

    if (isLockout() == false) {

        $('.window').fadeOut(100);


        var headerID = G_currentCustomerHeaderVID;
        var headerState = G_currentHeaderStatus;
        var owningGroup = G_customerGroupNumber;
        var themeIDs = "";
        var itemCounter = 0;
        var batchSize = 10;

        if (checkLastActivity() == false) {
            return;
        }

        lockoutInput();
        showProcessing('#data_loading');

        //get line IDs from the array here
        for (var i = 0; i < addProducts_Array.length; i++) {
            if (addProducts_Array[i].ItemSelected == "true" && addProducts_Array[i].ItemDeleted == "false" && addProducts_Array[i].ItemProcessed == false && addProducts_Array[i].ItemSubmitted == false) {
                itemCounter += 1;
                if (itemCounter > 1) {
                    themeIDs += ","
                }

                addProducts_Array[i].ItemSubmitted = true;
                themeIDs += addProducts_Array[i].ThemeDisplayID;
            }
            if (itemCounter >= batchSize) {
                logEvent(welcomeUserName, "begin post", "AddItems");
                $.post(
                          G_AbsoluteUri + 'Home/AddItems',
                          { headerID: headerID, themeIDs: themeIDs, currentHeaderStatus: headerState, owningGroup: owningGroup, userID: welcomeUserName, password: welcomePassword },
                          handleAddItems
                                  );
                return;
            }
        }

        if (itemCounter > 0) {
            logEvent(welcomeUserName, "begin post", "addItems");
            $.post(
              G_AbsoluteUri + 'Home/AddItems',
              { headerID: headerID, themeIDs: themeIDs, currentHeaderStatus: headerState, owningGroup: owningGroup, userID: welcomeUserName, password: welcomePassword },
              handleAddItems
                      );
        }

    }


}

var addThese = function (parm1) {
    setTimeout(function () { addTheseNow(parm1); }, 500);
}

var doesItemExist = function (style, size,backing) {

    try {
        for (var i = 0; i < accountCPL_Array.length; i++) {

            if (accountCPL_Array[i].SellingStyle == style
                && accountCPL_Array[i].SellingSize == size
                  && accountCPL_Array[i].Back == backing
                ) {
                return true;
            }
        }
    }
        catch(err){
            logError(welcomeUserName, "doesItemExist", err.message, err.stack, '');
        }
    return false;
}

function handleAddItems(content) {
    releaseLockout(true);

    if (content != undefined && content != null && content != "") {

        var responseObject;
        var endIndexNumber = G_current_Index;
        var itemCopy;
        var newLineID;
        var newStatus;
        var newThemeID;
        var newOwningGroup;
        var responseCounter = 0;
        var itemTotal = 0;
        var itemCompleteCount = 0;
        var itemRemainingCount = 0;


        responseObject = JSON.parse(content);
        logEvent(welcomeUserName, "handle response", "addItems: " + responseObject.responseCode);
        if (responseObject.responseCode == "SUCCESS") {

            newLineID = responseObject.LineIDs[responseCounter];
            newThemeID = responseObject.ThemeIDs[responseCounter];
            newOwningGroup = responseObject.OwningGroups[responseCounter];

            G_currentHeaderStatus = "revising";
            JSONobjectAccounts[G_accounts_currentIndex].status = "revising";
            G_currentCustomerHeaderVID = responseObject.HeaderID;
            //first append to array
            //get all selected items from the add products array
            for (var i = 0; i < addProducts_Array.length; i++) {
              
                if ((addProducts_Array[i].ItemSelected == "true") && (addProducts_Array[i].ItemProcessed == false) && (addProducts_Array[i].ItemSubmitted == true)) {
                    itemCopy = JSON.parse(JSON.stringify(addProducts_Array.slice(i, i + 1)));
                    itemCopy[0].itemIndex = accountCPL_Array.length;
                    itemCopy[0].VState = "draft";
                    itemCopy[0].MODOBJNUM = 0 ;
                    itemCopy[0].COPOBJNUM = 0 ;
                    itemCopy[0].REVOBJNUM = 0;
                    itemCopy[0].EndDate = "EOT";
                    itemCopy[0].OwningGroup = responseObject.OwningGroups[responseCounter];
                    itemCopy[0].ItemSelected = "new";              
                    addProducts_Array[i].ItemProcessed = true;
 
                    itemCopy[0].VID = responseObject.LineIDs[responseCounter];
                  
                    var newLength = accountCPL_Array.push(itemCopy[0]);
                   

                    responseCounter++;

                }
                if (addProducts_Array[i].ItemSelected == "true") {
                    itemTotal++;
                }
                if ((addProducts_Array[i].ItemSelected == "true") && (addProducts_Array[i].ItemProcessed == true)) {
                    itemCompleteCount++;
                }

                if (addProducts_Array[i].ItemSelected == "true" && addProducts_Array[i].ItemDeleted == "false" && addProducts_Array[i].ItemProcessed == false && addProducts_Array[i].ItemSubmitted == false) {
                    itemRemainingCount++;
                }

            }

            if (itemRemainingCount > 0) {
                showProcessing('#data_loading');
                addThese('');
                return;
            }

            hideProgress('#progress_message_container');
            appstate = "accountCPL"
            G_items_column_id = "VState";
            G_items_order = "ASC";
            G_items_targetColumn = "col1";
            sectionLoader(appstate);

            setActiveCPLRow('m_li_target_' + current_Line.toString(), 'false');

            var firstItemIndex = -1;

            for (var i = 0; i < accountCPL_Array.length; i++) {

                if (accountCPL_Array[i].ItemSelected == "new") {
                    accountCPL_Array[i].ItemSelected == "false";
                    if (firstItemIndex < 0) { firstItemIndex = i;}
                    getPricePointItemSinglePhaseII(i,
                        G_pricePointItemsContext,
                        accountCPL_Array[i].SellingStyle,
                        accountCPL_Array[i].SellingSize,
                        accountCPL_Array[i].Back,
                        accountCPL_Array[i].Brand,
                        accountCPL_Array[i].ProductType,
                        null,
                        accountCPL_Array[i].OwningGroup,
                        G_customerNumber,
                        G_customerGroupNumber,
                        accountCPL_Array[i].StartDate,
                        0,
                        accountCPL_Array[i].EndDate
                        );

                }
            }

            closeModal();
        }
        else {

            if (responseObject.RememberMeCookie == 'INVALID') {
                logOut();
                return;
            }
            $("#alertMessageContent").html(responseObject.responseMessage);
            goModal('#alertMessageBox');

        }
    }
    else {
        alert("no content");

    }
}

function focusOnElement(elementID) {
    $(elementID).focus();
}


function on_m_li_target_click(id) {

    setActiveCPLRow(id, 'true');
    return;

}

function on_m_li_click(id,theTargetLine) {
    debugger;
    if (isLockout() == false) {
        lockoutInput();
        var target = id.substr(id.indexOf(theTargetLine) + 11);
        id = target;
        target = (parseInt(target));
        var number = JSONobjectAccounts[target].id;
        setCustomerInformation(target);
        G_customerGroupNumber = JSONobjectAccounts[id].custGroupNumber;
        showProcessing('#data_loading');
        G_accounts_currentIndex = target;
        G_currentCustomerHeaderVID = JSONobjectAccounts[target].id;
       
        openAccount(id, number);

    }

}

function logOut() {
    welcomePassword = "";
    window.location.href = G_Home;

   
}

function onLogout() {
    welcomePassword = "";
    welcomeUserName = "";
    window.location.href = G_Home;

}

function handleLogout(content) {
    welcomePassword = "";
    welcomeUserName = "";
    window.location.href = G_Home;

}





function handleGetAvailProducts(content) {
    releaseLockout(true);
    initFilter("producttheme");
  


    if (content != undefined && content != null && content != "") {

        var responseObject;
        responseObject = JSON.parse(content);
        logEvent(welcomeUserName, "handle response", "GetAvailableProducts: " + responseObject.responseCode);
        if (responseObject.responseCode == "SUCCESS") {
            addProducts_Array = responseObject.CPLLines;

            for (i = 0 ; i < addProducts_Array.length ; i++) {
                if (doesItemExist(addProducts_Array[i].SellingStyle,
                           addProducts_Array[i].SellingSize,
                           addProducts_Array[i].Back
                           ) == true) {
                    
                    addProducts_Array[i].ItemDeleted = "true";
                   
                }
            }
        }
        else {

            if (responseObject.RememberMeCookie == 'INVALID') {
                logOut();
                return;
            }
          
            $("#alertMessageContent").html(responseObject.responseMessage);
            goModal('#alertMessageBox');
            return;
        }
 
        appstate = "addProducts";
        clearProducts();

    }
}


function handleGetConfigParameters(content) {
    if (content != undefined && content != null && content != "") {
        var responseObject;
        responseObject = JSON.parse(content);
        if (responseObject.responseCode == "SUCCESS") {
            var parameters = JSON.parse(responseObject.responseMessage);

            if (parameters.GroupEditMinimumValue != undefined) {
                G_groupEditMinimumValue = parameters.GroupEditMinimumValue * 1;
            }

            if (parameters.GroupEditMaximumValue != undefined) {
                G_groupEditMaximumValue = parameters.GroupEditMaximumValue * 1;
            }
            if (parameters.MaximumInactivityDuration != undefined) {
                G_maxInactivityDuration = parameters.MaximumInactivityDuration * 1;
            }

            if (parameters.GroupEditEnabled != undefined) {
                var tempvalue = parameters.GroupEditEnabled;
                if (tempvalue == "true") {
                    G_GroupEditEnabled = true;
                }
                else {
                    G_GroupEditEnabled = false;
                }
            }

           

        }
        else
        {
            //nothing just go with initial values
            return;
        }
    }
}





function handleGetAccounts(content) {

    releaseLockout(true);
    if (content != undefined && content != null && content != "") {
        
        var responseObject;
        responseObject = JSON.parse(content);
        logEvent(welcomeUserName, "handle response", "GetAccounts: " + responseObject.responseCode);
        if (responseObject.responseCode == "SUCCESS") {
            JSONobjectAccounts = responseObject.CPLList;
           
        }
        else {
            $("#alertMessageContent").html(responseObject.responseMessage);
            goModal('#alertMessageBox');
            return;
        }

     
        if (responseObject.AppVersion != G_appVersion) {
           // debugger
            window.location.href = G_Home;
            return;
        }
       
        accountsFilter();

        $.post(
         G_AbsoluteUri + 'Home/getConfigParameters',
         { username: welcomeUserName, password: welcomePassword, parameters: "GroupEditMinimumValue,GroupEditMaximumValue,GroupEditEnabled" },
         handleGetConfigParameters
             );
      
    }
}

var resetFilterCount = function (filterCategory) {
    var targetArray = getTargetArray(filterCategory);
    if (targetArray == null) {
        return false;
    }

    for (var i = 0; i < targetArray.length; i++) {
        targetArray[i].count = 0;
        targetArray[i].absoluteCount = 0;
        targetArray[i].potentialCount = 0;
    }

}

var initFilter = function (filterCategory) {
    switch (filterCategory) {
        case "group":
            return G_filter_CustomerGroupArray = [];

            break;
        case "status":
            return G_filter_CustomerStatusArray = [];

            break;
        case "theme":
            return G_filter_CPLThemeDisplayArray = [];

            break;
        case "producttheme":
            return G_filter_ProductThemeDisplayArray = [];

            break;
        case "brand":
            return G_filter_CPLBrandArray = [];
            break;

        case "pricelevel":
            return G_filter_CPLPriceLevelArray = [];
            break;

        case "promo":
            G_filter_CPLPromoPriceArray = [];
            var newItem = new FilterItem("Yes", 0);
            G_filter_CPLPromoPriceArray.push(newItem);
            newItem = new FilterItem("No", 0);
            G_filter_CPLPromoPriceArray.push(newItem);
            return G_filter_CPLPromoPriceArray;
            break;
        case "cpromo":
            G_filter_CPLCorpPromoArray = [];
            var newItem = new FilterItem("Yes", 0);
            G_filter_CPLCorpPromoArray.push(newItem);
            newItem = new FilterItem("No", 0);
            G_filter_CPLCorpPromoArray.push(newItem);
            return G_filter_CPLCorpPromoArray;
            break;
        case "autotm3":
            G_filter_CPLAutoTM3Array = [];
            var newItem = new FilterItem("Yes", 0);
            G_filter_CPLAutoTM3Array.push(newItem);
            newItem = new FilterItem("No", 0);
            G_filter_CPLAutoTM3Array.push(newItem);
            return G_filter_CPLAutoTM3Array;
            break;
        default:
           
    }
   
}

var clearFilter = function (filterCategory) {
   
    var targetArray = getTargetArray(filterCategory);
    if (targetArray == null) {
        return false;
    }

    for (var i = 0; i < targetArray.length; i++) {
        targetArray[i].count = 0;
        targetArray[i].checked = 0;
        targetArray[i].absoluteCount = 0;
        targetArray[i].potentialCount = 0;

    }

    if (filterCategory == "producttheme") {
        updateCPLFilterDisplay(filterCategory);
        return;
    }

    if (filterCategory == "group" || filterCategory == "status") {
        updateFilterDisplay(filterCategory);
    } else {
        updateCPLFilterDisplay(filterCategory);
    }

}

var getTargetArray = function (arrayname) {
    switch (arrayname) {
        case "group":
            return G_filter_CustomerGroupArray;

            break;
        case "status":
            return G_filter_CustomerStatusArray;

            break;
        case "theme":
            return G_filter_CPLThemeDisplayArray;

            break;
        case "brand":
            return G_filter_CPLBrandArray;

            break;
        case "promo":
            return G_filter_CPLPromoPriceArray;

        case "cpromo":
            return G_filter_CPLCorpPromoArray;

            break;
        case "autotm3":
            return G_filter_CPLAutoTM3Array;
            break;

        case "pricelevel":
            return G_filter_CPLPriceLevelArray;
            break;
        case "producttheme":
            return G_filter_ProductThemeDisplayArray;

            break;
        default:
            return null;
    }
}

    var getTargetCounter = function(arrayname){
        switch (arrayname) {
            case "group":
                return G_filter_CustomerGroupArrayFilteredCount;
           
                break;
            case "status":
                return G_filter_CustomerStatusArrayFilteredCount;
          
                break;
            case "theme":
                return G_filter_CPLThemeDisplayArrayFilteredCount;

                break;
            case "producttheme":
                return G_filter_ProductThemeDisplayArrayFilteredCount;

                break;
            case "brand":
                return G_filter_CPLBrandArrayFilteredCount;

                break;
            case "promo":
                return G_filter_CPLPromoPriceArrayFilteredCount;

            case "cpromo":
                return G_filter_CPLCorpPromoArrayFilteredCount;

                break;
            case "autotm3":
                return G_filter_CPLAutoTM3ArrayFilteredCount;

                break;
            case "pricelevel":
                return G_filter_CPLPriceLevelArrayFilteredCount;

                break;
            default:
                return null;
        }
    }

    var setTargetCounter = function (arrayname, theCount) {
        switch (arrayname) {
            case "group":
                G_filter_CustomerGroupArrayFilteredCount = theCount;
                break;
            case "status":
                G_filter_CustomerStatusArrayFilteredCount = theCount;
                break;
            case "theme":
                G_filter_CPLThemeDisplayArrayFilteredCount = theCount;
                break;
            case "producttheme":
                G_filter_ProductThemeDisplayArrayFilteredCount = theCount;
                break;
            case "brand":
                G_filter_CPLBrandArrayFilteredCount = theCount;
                break;
            case "promo":
                G_filter_CPLPromoPriceArrayFilteredCount = theCount;
                break;
            case "cpromo":
                G_filter_CPLCorpPromoArrayFilteredCount = theCount;
                break;
            case "autotm3":
                G_filter_CPLAutoTM3ArrayFilteredCount = theCount;
                break;
            case "pricelevel":
                G_filter_CPLPriceLevelArrayFilteredCount = theCount;
                break;
            default:
                return null;
        }
    }



var isFilterChecked = function (filterCategory) {
    
    var targetArray = getTargetArray(filterCategory);
    if (targetArray == null) {
        return false;
    }

    for (var i = 0; i < targetArray.length; i++) {
        if (targetArray[i].checked == 1 ) {
                return true;
            }
        }
        return false;
}

var toggleFilterDisplay = function (filterCategory) {
    var targetArray = getTargetArray(filterCategory);
    if (targetArray == null) {
        return ;
    }


    if ($("#" + filterCategory + "_all").hasClass('selected')) {
        for (var i = 0; i < targetArray.length; i++) {
            targetArray[i].checked = 0;
        }
    }
    else {
        for (var i = 0; i < targetArray.length; i++) {
            targetArray[i].checked = 1;
        }
    }

    updateFilterDisplay(filterCategory);
}

var toggleCPLFilterDisplay = function (filterCategory) {
    var targetArray = getTargetArray(filterCategory);
    if (targetArray == null) {
        return false;
    }


    if ($("#" + filterCategory + "_all").hasClass('selected')) {
        for (var i = 0; i < targetArray.length; i++) {
            targetArray[i].checked = 0;
        }
    }
    else {
        for (var i = 0; i < targetArray.length; i++) {
            targetArray[i].checked = 1;
        }
    }

    updateCPLFilterDisplay(filterCategory);
}

var updateFilterDisplay = function (filterCategory) {
    var foundItem = false;
    var selectedCounter = 0;

    var targetArray = getTargetArray(filterCategory);
    if (targetArray == null) {
        return false;
    }

    for (var i = 0; i < targetArray.length; i++) {
 
        if (targetArray[i].checked == 1) {
            $("#" + filterCategory + "_" + i).addClass('selected');
            $("#" + filterCategory + "_" + i).attr('checked', 'checked');
            foundItem = true;
            selectedCounter++;
        }
        else {
            $("#" + filterCategory + "_" + i).removeClass('selected');
            $("#" + filterCategory + "_" + i).removeAttr('checked');
        }
       
    }

    setTargetCounter(filterCategory, selectedCounter);
    

    if (selectedCounter >= targetArray.length) {
        $("#" + filterCategory + "_all").addClass('selected');
        $("#" + filterCategory + "_all").attr('checked', 'checked');
 
    }
    else {
        $("#" + filterCategory + "_all").removeClass('selected');
        $("#" + filterCategory + "_all").removeAttr('checked');
    }

   
    if ((isFilterChecked("group") == true) || ((isFilterChecked("status") == true))) {
       
        $('#filter_opts_accounts_widget').addClass('active');
        $('#filter_opts_accounts').html('Filters Applied');
    }else{
  
        $('#filter_opts_accounts_widget').removeClass('active');
        $('#filter_opts_accounts').html('Filter Options');
    }

    if (isFilterChecked(filterCategory) == true) {
        $('#' + filterCategory).addClass('selected');

    }
    else {
        $('#' + filterCategory).removeClass('selected');
    }

}


var updateCPLFilterDisplay = function (filterCategory) {
    var foundItem = false;
    var selectedCounter = 0;

    var targetArray = getTargetArray(filterCategory);
    if (targetArray == null) {
        return false;
    }

    for (var i = 0; i < targetArray.length; i++) {

        if (targetArray[i].checked == 1) {
            $("#" + filterCategory + "_" + i).addClass('selected');
            $("#" + filterCategory + "_" + i).attr('checked', 'checked');
            foundItem = true;
            selectedCounter++;
        }
        else {
            $("#" + filterCategory + "_" + i).removeClass('selected');
            $("#" + filterCategory + "_" + i).removeAttr('checked');
        }

    }

    setTargetCounter(filterCategory, selectedCounter);

    if (selectedCounter >= targetArray.length) {
        $("#" + filterCategory + "_all").addClass('selected');
        $("#" + filterCategory + "_all").attr('checked', 'checked');

    }
    else {
        $("#" + filterCategory + "_all").removeClass('selected');
        $("#" + filterCategory + "_all").removeAttr('checked');
    }

    if (isFilterChecked("producttheme") == true) {

        $('#filter_opts_addproducts_widget').addClass('active');
        $('#filter_opts_addproducts').html('Theme(s) Applied');
    }
    else {
        $('#filter_opts_addproducts_widget').removeClass('active');
        $('#filter_opts_addproducts').html('Select Theme');
    }
   
        if (
            (isFilterChecked("theme") == true) || (isFilterChecked("brand") == true)
             || (isFilterChecked("promo") == true)
             || (isFilterChecked("cpromo") == true)
             || (isFilterChecked("autotm3") == true)
              || (isFilterChecked("pricelevel") == true)
            ) {

            $('#filter_opts_accountCPL_widget').addClass('active');
            $('#filter_opts_accountCPL').html('Filters Applied');
        } else {

            $('#filter_opts_accountCPL_widget').removeClass('active');
            $('#filter_opts_accountCPL').html('Filter Options');
        }
    

    if (isFilterChecked(filterCategory) == true) {
        $('#' + filterCategory).addClass('selected');

    }
    else {
        $('#' + filterCategory).removeClass('selected');
    }


}


// Filter button actions
$(document).on("click", "[id^='group_'], [id^='status_'], [id^='producttheme_'],[id^='theme_'], [id^='pricelevel_'], [id^='brand_'],[id^='cpromo_'], [id^='promo_'], [id^='autotm3_']", function (e) {
    //categoryClick

    G_itemsFilterCalled = false;
    G_accountsFilterCalled = false;

    var id = $(this).attr('id');
  
    var id_o = id.substring(id.lastIndexOf("_") + 1); // Everything after "_"
    var id_a = id.substring(0, id.indexOf("_")); // Everything before "_"

    id = id_a + "_all";

    if (id_o != 'all') {
        var checkClass = $(this).hasClass('selected');
        var checkType = $(this).children('span').hasClass('radio');

        var targetArray = getTargetArray(id_a);
        if (targetArray == null) {
            return false;
        }
       

        if (targetArray[id_o].checked == 1) 
        {
            targetArray[id_o].checked = 0;
        }
        else 
        {
            targetArray[id_o].checked = 1;
        }

        if(id_a == "producttheme"){
            updateCPLFilterDisplay(id_a);
            productsFilter();
            updateCPLFilterDisplay(id_a);
            return;
        }

        if (id_a == "group" || id_a == "status") {
            appstate = "accounts";
            //NOTE: you must call updateFilterDisplay() before accountsFilter()
            updateFilterDisplay(id_a);
            accountsFilter(id_a);

        }
        else {
            appstate = "accountCPL";
            //NOTE: you must call updateCPLFilterDisplay() before itemsFilter()
            updateCPLFilterDisplay(id_a);
            itemsFilter(id_a);

        }

    }
    else
    {
        if (id_a == "producttheme") {
            toggleCPLFilterDisplay(id_a);
            productsFilter();
            updateCPLFilterDisplay(id_a);
            return;
        }


        if (id_a == "group" || id_a == "status") {

            toggleFilterDisplay(id_a);
            accountsFilter(id_a);
            updateFilterDisplay(id_a);
        }
        else {
            toggleCPLFilterDisplay(id_a);
            itemsFilter(id_a);
            updateCPLFilterDisplay(id_a);
        }

    }
 
});





// Document Bindings
//$(document).on("click", ".select_icon, [id^='editselectrow_'],#master_select", function () {
$(document).on("click", "[id^='editselectrow_'],[id^='editselect_'] ,#master_select,#sort_VState", function () {

    if (G_groupEditType == "") {
            return;
    }



    var id = $(this).attr('id');
    var row_id_array = id.toString().split("_", 2);
    var row_id = row_id_array[1];
    var state = false;

    if (id.indexOf("editselect_") >= 0) {
        return;
    }
    if (id == "master_select" ) {
        return;

    }

    if (id == "master_select" || id == "sort_VState") {
        state = $('#master_select').hasClass('active');

    }
    else {
        state = $("#editselect_" + row_id).hasClass('active');
    }

    if (state == true) {
        if (id == "master_select" || id == "sort_VState") {
            //$('.select_icon').removeClass('active');
            $('#master_select').removeClass('active');
            // Deselect all in array
            arraySelector( 'none', 'deselect');

        }
        else {
            //$("#editselect_" +  row_id).removeClass('active');
            //setLineStatus(row_id, "");
            $('#master_select').removeClass('active');
            arraySelector( row_id, 'deselect');

        }
    }
    else {
        if (id == "master_select" || id == "sort_VState") {
           // $('.select_icon').addClass('active');
            $('#master_select').addClass('active');
            // Deselect all in array
            arraySelector('all', 'select');

        }
        else {
           
            //$("#editselect_" + row_id).addClass('active');

            arraySelector(row_id, 'select');

        }
        
    }

});

//productsSelect
//$(document).on("click", ".addselect_icon, #product_sort_status ,[id^='addselectrow_']", function () {
 $(document).on("click", "#product_sort_status ,[id^='addselectrow_']", function () {

    var state = $(this).hasClass('active');
    var id = $(this).attr('id');

    if (id == "master_addselect") {
        return;
    }



    if (id.indexOf("addselect_") >= 0) {
        return;
    }


    if (id == "product_sort_status") {
        id = "master_addselect";
        var state = $('#master_addselect').hasClass('active');
    }

    var row_id_array = id.toString().split("_", 2);
    var row_id = row_id_array[1];

    if (id.indexOf("addselectrow") >= 0) {
        id = "addselect_" + row_id;
        state = $('#'+ id).hasClass('active');
    }

    var group_btn = $('#addthese').hasClass('disabled');

    if (state == true) {
        if (id == "master_addselect") {
            $('.addselect_icon').removeClass('active');
            $('#addthese').addClass('disabled');
            $("[id^='addpr_line_']").removeClass('li_add');
            totalSelectedProducts = 0;

            // Deselect all in array
            arraySelector2( 'none', 'deselect');

        }
        else {
            $('#' + id).removeClass('active');
            $('#addpr_line_' + row_id).removeClass('li_add');
            totalSelectedProducts = totalSelectedProducts - 1;
            $('#addselect_total').html(totalSelectedProducts);
            
            $('#master_addselect').removeClass('active');
           
            // Deselect just this item in array
            addProducts_Array[row_id].ItemSelected = "false";
          
            if ($('.addselect_icon.active').length < 1) {
                $('#addthese').addClass('disabled');
               
            }

            arraySelector2(row_id, 'deselect');

        }
    }
    else {
        if (id == "master_addselect") {
            $('.addselect_icon').addClass('active');
            $("[id^='addpr_line_']").addClass('li_add');
            totalSelectedProducts = totalAddProducts;
           

            if (group_btn == true) {
                $('#addthese').removeClass('disabled');
            }

            // Select all in array
            arraySelector2( 'all', 'select');

        }
        else {

            $('#' + id).addClass('active');
            $('#addpr_line_' + row_id).addClass('li_add');
            totalSelectedProducts = totalSelectedProducts + 1;
            addProducts_Array[row_id].ItemSelected = "true";
            if (group_btn == true) {
                $('#addthese').removeClass('disabled');
            }

            if ($('.addselect_icon').length == ($('.addselect_icon.active').length + 1)) {
                $('#master_addselect').addClass('active');
            }
            else {
                $('#master_addselect').removeClass('active');

            }

            // Select just this item in array
           
            arraySelector2(row_id, 'select');

        }
    }

    if (totalSelectedProducts > 0)
    {
        $('#addselect_total').addClass('li_add');
    }
    else
    {
        $('#addselect_total').removeClass('li_add');
    }

    $('#addselect_total').html(totalSelectedProducts);

});


$(document).on("click", ".disabled", function (e) {
    e.preventDefault();
});

$(document).on("click", ".state_flag", function (e) {
    e.preventDefault();
    // Get width of this
    var flagWidth = $(this).width();
    if (flagWidth > 20) {
        // flag is expanded, so close this
        $(this).children('.flaginfo').css('display', 'none');
        $(this).animate({ 'width': '20px' }, 300, function () {
        $(this).css('background-image', 'url(' + G_AbsoluteUri + 'Content/images/ui/state_flag_arrow.png)'); //background-image:url('../images/ui/state_flag_arrow.png');

        });
    }
    else {
        $(this).css('background-image', 'none');
        $(this).animate({ 'width': '100%' }, 300, function () {
            //$(this).children('.flaginfo').css('display', 'block');
        });
        setTimeout($(this).children('.flaginfo').css('display', 'block'),900);
    }




});


// Functions



var JSONtoArray = function (targetJSON, targetArray) {

    var key;
    for (key in targetJSON) {
        targetArray.push(targetJSON[key]); // Push the key's value on the array
    }
}


var setLineIndex =function(indexNum) {
    G_current_Index = indexNum;
}


var setWelcomeMessage = function (theName) {
    //debugger;
    var msg = '';
    if (welcomeFullNameAs != "") {
        msg = '<h4 class="single">Working with &nbsp;<b>' + welcomeFullNameAs + '</b> Select a customer to begin.</h4>';
    } else {
        msg = '<h4 class="single"><b>Welcome&nbsp;' + welcomeFullName + '</b> Select a customer to begin.</h4>';
    }

    $('#main_console').delay(300).animate({ 'opacity': 0 }, 600, function () {
        $('.m_console_data').html(msg);
        $('#main_console').animate({ 'opacity': 1 }, 600);

    });      
}

var formatStatus = function(theStatus){
    var status = "";
    switch (theStatus) {
        case "revising":
            status = 'Revising';
            break;
        case "submitted":
            status = 'Submitted';
            break;
        case "approved":
            status = '';
            break;
        case "denied":
            status = 'Denied';
            break;

    }
    return status;
}

$.addTemplateFormatter({
    formatStatus: function (value, template) {
        var status = "";
        switch (value) {
            case "revising":
                status = 'Revising';
                break;
            case "submitted":
                status = 'Submitted';
                break;
            case "approved":
                status = '';
                break;
            case "denied":
                status = 'Denied';
                break;

        }
        return status;
    }
    ,
    setStatusIcon: function (value, template) {
        $(this).addClass(value);
        return;
    },

    warehousePricing: function (value, template) {
        if (value != undefined && value != null && value != "") {
            $(this).css('display', 'block');
        }
        else {
            $(this).css('display', 'none');
        }
        return;
    },

    CurrencyFormatted: function (value, template) {
   
        if (value == "") {
            return "";
        }
        var i = parseFloat(value);
        if (isNaN(i)) { i = 0.00; }
        var minus = '';
        if (i < 0) { minus = '-'; }
        i = Math.abs(i);
        i = parseInt((i + .005) * 100);
        i = i / 100;
        s = new String(i);
        if (s.indexOf('.') < 0) { s += '.00'; }
        if (s.indexOf('.') == (s.length - 2)) { s += '0'; }
        s = minus + s;
        return s;
    },

    UseAltClass: function (value, template) {
        var theValue = value;
        $(this).parent().parent().attr('onclick', 'selectUser(\'' + value + '\');');
        if (G_UseAltClass == true) {
           
            G_UseAltClass = false;
            $(this).parent().parent().addClass('alt');

        }
        else {
            G_UseAltClass = true;
           // $(this).parent().parent().removeClass('alt');
        }
        return theValue;
    },

    FormatCustomer: function (value, template) {
        var theValue = value;
        $(this).parent().parent().attr('onclick', 'selectCustomer(\'' + value + '\');');
        if (G_UseAltClass == true) {

            G_UseAltClass = false;
            $(this).parent().parent().addClass('alt');

        }
        else {
            G_UseAltClass = true;
            
        }
        return theValue;
    },
    FormatCustomerFullName: function (value, template) {
        
        return value;
    },


});

var setCustomerInformation = function (customerIndexNumber) {
    var msg = '';
    G_accounts_currentIndex = customerIndexNumber;
    G_currentCustomerHeaderVID = JSONobjectAccounts[customerIndexNumber].id;
    G_currentHeaderStatus = JSONobjectAccounts[customerIndexNumber].status;
    G_customerGroupNumber = JSONobjectAccounts[customerIndexNumber].custGroupNumber;
    G_customerNumber = JSONobjectAccounts[customerIndexNumber].number;

    try {
        var testthis = "no";
        if (testthis == "yes") {
            var customerInfoObject = [{
                name: JSONobjectAccounts[customerIndexNumber].name,
                status: G_currentHeaderStatus,
                formattedStatus: formatStatus(G_currentHeaderStatus),
                number: JSONobjectAccounts[customerIndexNumber].number,
                warehousePricing: JSONobjectAccounts[customerIndexNumber].warehousePricingEnabled,
                phone: JSONobjectAccounts[customerIndexNumber].phone.replace(/[^0-9]/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3'),
                street: JSONobjectAccounts[customerIndexNumber].street,
                city: JSONobjectAccounts[customerIndexNumber].city,
                custGroup: JSONobjectAccounts[customerIndexNumber].custGroup,
                state: JSONobjectAccounts[customerIndexNumber].state,
                zip: JSONobjectAccounts[customerIndexNumber].zip,
                cpl_address: JSONobjectAccounts[customerIndexNumber].street + ', '
                              + ' ' + JSONobjectAccounts[customerIndexNumber].city + ', '
                              + ' ' + JSONobjectAccounts[customerIndexNumber].state
                              + ' ' + JSONobjectAccounts[customerIndexNumber].zip
            }];


          
            $('#main_console').delay(300).animate({ 'opacity': 0 }, 600, function () {
                $('#m_console_data').loadTemplate("#customerInformationTemplate", customerInfoObject);
                $('#main_console').animate({ 'opacity': 1 }, 600);
             });

            return;
        }

        


            msg = "";
   
            msg = '<div class="m_console_data">';

            msg += '<div class="console_col1">';
            msg += '<h4><b>' + JSONobjectAccounts[customerIndexNumber].name + '</b></h4>';
            msg += '<div class="staus_widget" style="float:right;">';
            msg += '<span class="status_icon ' + G_currentHeaderStatus + '"></span>' + formatStatus(G_currentHeaderStatus) + ' </span>';
            msg += '</div>';
            msg += '<h5>' + JSONobjectAccounts[customerIndexNumber].number + '</h5>';
            msg += '</div>';

            msg += '<div class="console_col2">';

            if (JSONobjectAccounts[customerIndexNumber].warehousePricingEnabled != undefined && JSONobjectAccounts[customerIndexNumber].warehousePricingEnabled != null && JSONobjectAccounts[customerIndexNumber].warehousePricingEnabled != "") {
                msg += '<h6>Warehouse Pricing</h6>';
            }
            msg += '<p><b>' + JSONobjectAccounts[customerIndexNumber].phone.replace(/[^0-9]/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') + '</b> <br>';
            msg += '<span class="cpl_address">';
            msg += '' + JSONobjectAccounts[customerIndexNumber].street + ', ';
            msg += '' + JSONobjectAccounts[customerIndexNumber].city + ', ' + JSONobjectAccounts[customerIndexNumber].state + ' ' + JSONobjectAccounts[customerIndexNumber].zip;
            msg += '   </span> <br>';
            msg += 'Customer Group: ' + JSONobjectAccounts[customerIndexNumber].custGroup + '</p>';
            msg += '</div>';

            msg += '</div>';

        

         $('#main_console').delay(300).animate({ 'opacity': 0 }, 600, function () {
           $('.m_console_data').html(msg);
           $('#main_console').animate({ 'opacity': 1 }, 600);
        });

    }
    catch (err)
    {
        logError(welcomeUserName, "setCustomerInformation", err.message, err.stack, '');
    }
}


var setCPLItemCount = function (customerIndex) {
    
    statusData = '';
    statusData += '<h3><span id="m_total">' + totalItems + '</span> Total</h3>\n';
    statusData += '<div class="staus_widget"><span class="cpli_icon promo"></span>Limited Time </div>\n';
    statusData += '<div class="staus_widget"><span class="cpli_icon autoTM3" ></span>Auto TM </div>\n';
    statusData += '<div class="staus_widget"><span class="cpli_icon cpromo"></span>Corp Promo </div>\n';
    statusData += '<div class="staus_widget"><span class="cpli_icon loaded"></span>Loads </div>\n';

    controlData = '';
    //Add Products Button
    controlData = '<a href="javascript:addProducts(\'addProducts\');" id="btn_add_products" ';
    //if (JSONobjectAccounts[customerIndex].status == "approved" || JSONobjectAccounts[customerIndex].status == "revising" || JSONobjectAccounts[customerIndex].status == "draft") {
    if (JSONobjectAccounts[customerIndex].status != "submitted" && G_readOnly == false) {
        controlData += 'class="btn " ';
    }
    else {
        controlData += '   class="btn disabled" disabled ';
    }  
    controlData += ' >Add New Products</a>\n';

    //Email CPL Button

    if (JSONobjectAccounts[customerIndex].status == "approved" ) {
        controlData += '<a href="javascript:emailCPL(\'' + G_currentCustomerHeaderVID + '\' );" id="email_cpl" class="btn " >Email Dealer CPL</a>\n';
      
    }
    else { 
        controlData += '<a href="javascript:emailCPL(\'' + G_currentCustomerHeaderVID + '\' );" id="email_cpl" class="btn disabled" disabled>Email Dealer CPL</a>\n';
    }
    //Group Edit Button
   // controlData += '<a href="javascript:goModal(\'#accountCPL_groupedit\');" id="group_edit" class="btn disabled"  disabled >Group Edit Price</a>\n';
    controlData += '<a href="javascript:goModal(\'#accountCPL_groupedit\');buildGroupSlider(0);" id="btn_group_edit" ';
    //if ((JSONobjectAccounts[customerIndex].status == "approved"
    //    || JSONobjectAccounts[customerIndex].status == "revising"
    //    || JSONobjectAccounts[customerIndex].status == "draft")
    //    && G_GroupEditEnabled == true)
    //{
    if (JSONobjectAccounts[customerIndex].status != "submitted" && G_readOnly == false) {
        controlData += 'class="btn " ';
    }
    else {
        controlData += '   class="btn disabled" disabled ';
    }
    controlData += ' >Group Pricing</a>\n';


    //Submit Pricing Button
    controlData += '<a ';
    if (G_readOnly == false && (JSONobjectAccounts[customerIndex].status == "revising" || JSONobjectAccounts[customerIndex].status == "draft")) {
        controlData += 'class="btn "';
    }
    else {
        controlData += '   class="btn disabled" disabled ';
    }
    controlData += ' href="#" id="btn_submit_pricing" >Submit Pricing</a>\n';

    $('.status_bar').html(statusData);
    $('.controls2').html(controlData);

    $("#btn_submit_pricing").unbind().click(function () {
        //Stuff
    });

    $("#btn_submit_pricing").click(function () {
        if ( $('#btn_submit_pricing').hasClass('disabled') || $('#btn_submit_pricing').is(':disabled')   ) {
        }
        else {
           
            goModal('#accountCPL_submitprice');
            $("#submitComments").text("");
            $("#submitComments").val('');
            
        
        }
    });


    $("#submit_pricingComments").unbind().click(function () {
        //Stuff
    });

    $("#submit_pricingComments").click(function (e) {
   
        var winH = $(window).height();
        var winW = $(window).width();
        var id = "#accountCPL_comments";

        //Close other modals
        $('.window').css('display', 'none');

        //Set the popup window to center
        if (winH >= 700) {
            $("#accountCPL_comments").css('top', 100);
            $("#accountCPL_comments").css('left', winW / 2 - $(id).width() / 2);

        }
        else {
            $("#accountCPL_comments").css('top', winH / 2 - $(id).height() / 2);
            $("#accountCPL_comments").css('left', winW / 2 - $(id).width() / 2);

        }

        $("#accountCPL_comments").css('display', 'block');

        //calling this function is required on iOS. setting focus must be called from withing a function
        focusOnElement('#submitComments');
        
    });


    $("#submitComments").focus(function (e)
    {
       //nothing
    });
    
    $("#submit_pricingOK").unbind().click(function () {
            //Stuff
    });
    $("#submit_pricingWithCommentsOK").unbind().click(function () {
        //Stuff
    });

    $("#submit_pricingOK, #submit_pricingWithCommentsOK").click(function (e) {
        try {
          

            if (isLockout() == false) {
                if (checkLastActivity() == false) {
                    return;
                }
                var myComments = $("#submitComments").val();
                var headerID = G_currentCustomerHeaderVID;
                var customerNumber = JSONobjectAccounts[G_accounts_currentIndex].id
                closeModal();
                lockoutInput();
                showProcessing('#data_loading');
                logEvent(welcomeUserName, "begin post", "submitCPL");
                $.post(
                  G_AbsoluteUri + 'Home/submitCPL',
                  { headerID: headerID,  comments: myComments, userID: welcomeUserName, password: welcomePassword },
                  handleSubmitPrice
                          );
            }
            
        }catch(err)
        {
            logError(welcomeUserName, "#submit_pricingOK.click", err.message, err.stack, '');
        }
    });


    function handleSubmitPrice(content) {
       
        releaseLockout(true);
        try{
            if (content != undefined && content != null && content != "") {
         
                var responseObject;
                responseObject = JSON.parse(content);
                logEvent(welcomeUserName, "handle response", "Submit CPL: " + responseObject.responseCode);
                if (responseObject.responseCode == "SUCCESS") {
                    goBack();
                    $("#submitComments").val('');
                }
                else {
                    if (responseObject.RememberMeCookie == 'INVALID') {
                        logOut();
                        return;
                    }
                    $("#alertMessageContent").html(responseObject.responseMessage);
                    goModal('#alertMessageBox');
                }
            }
            else {
                alert("no content");

            }
        } catch (err) {
            logError(welcomeUserName, "handleSubmitPrice", err.message, err.stack, '');
         
        }
    }

}


var setGroupEditItemCount = function (customerIndex) {

    statusData = '';
    statusData += '<h3><span id="groupEditItemSelectedCounter" >' + G_groupEditItemSelectedCounter + '</span> Total</h3>\n';
    statusData += '<div class="staus_widget"><span class="cpli_icon promo"></span>Limited Time </div>\n';
    statusData += '<div class="staus_widget"><span class="cpli_icon autoTM3" ></span>Auto TM </div>\n';
    statusData += '<div class="staus_widget"><span class="cpli_icon cpromo" ></span>Corp Promo </div>\n';
    statusData += '<div class="staus_widget"><span class="cpli_icon loaded"></span>Price Loads </div>\n';

    controlData = '';
    ////Add Products Button
    //controlData = '<a href="javascript:addProducts(\'addProducts\');" id="btn_add_products" ';
    //if (JSONobjectAccounts[customerIndex].status == "approved" || JSONobjectAccounts[customerIndex].status == "revising" || JSONobjectAccounts[customerIndex].status == "draft") {
    //    controlData += 'class="btn " ';
    //}
    //else {
    //    controlData += '   class="btn disabled" disabled ';
    //}
    //controlData += ' >Add New Products</a>\n';

    if (G_groupEditType == "edit") {
        controlData += '<a href="javascript:showPriceSetter();" id="btn_apply_group_edit" ';
        if (G_groupEditItemSelectedCounter <= 0) {
            controlData += ' class="btn disabled" disabled ';
        }
        else {
            controlData += ' class="btn "';
        }
        controlData += ' >Set Group Price</a>\n';
    }
    if (G_groupEditType == "expire") {
        controlData += '<a href="javascript:goModal(\'#confirmGroupEdit\');" id="btn_apply_group_edit" ';
      
        if (G_groupEditItemSelectedCounter <= 0) {
            controlData += ' class="btn disabled" disabled ';
        }
        else {
            controlData += ' class="btn "';
        }
        controlData += ' >Remove Selected Products</a>\n';
    }
    if (G_groupEditType == "newpromo") {
        controlData += '<a href="javascript:showDateSetter();" id="btn_apply_group_edit" ';
        if (G_groupEditItemSelectedCounter <= 0) {
            controlData += ' class="btn disabled" disabled ';
        }
        else {
            controlData += ' class="btn "';
        }
        // class="btn disabled" disabled
        controlData += ' >Set Limited Time Price</a>\n';
    }
    //Group Edit Button
    // controlData += '<a href="javascript:goModal(\'#accountCPL_groupedit\');" id="group_edit" class="btn disabled"  disabled >Group Edit Price</a>\n';
    controlData += '<a href="javascript:cancelGroupEdit();" id="btn_cancel_group_edit" ';
    //if (JSONobjectAccounts[customerIndex].status == "approved" || JSONobjectAccounts[customerIndex].status == "revising" || JSONobjectAccounts[customerIndex].status == "draft") {
       controlData += 'class="btn " ';
    //}
    //else {
     //   controlData += '   class="btn disabled" disabled ';
    // }
       if (G_groupEditType == "edit") {
           controlData += ' >Cancel Group Pricing</a>\n';
       }
       if (G_groupEditType == "expire") {
           controlData += ' >Cancel Group Pricing</a>\n';
       }
       if (G_groupEditType == "newpromo") {
           controlData += ' >Cancel Group Pricing</a>\n';
       }


    ////Submit Pricing Button
    //controlData += '<a ';
    //if (JSONobjectAccounts[customerIndex].status == "revising" || JSONobjectAccounts[customerIndex].status == "draft") {
    //    controlData += 'class="btn "';
    //}
    //else {
    //    controlData += '   class="btn disabled" disabled ';
    //}
    //controlData += ' href="#" id="btn_submit_pricing" >Submit Pricing</a>\n';

    $('.status_bar').html(statusData);
    $('.controls2').html(controlData);

    $("#btn_submit_pricing").unbind().click(function () {
        //Stuff
    });

    $("#btn_submit_pricing").click(function () {
        if ($('#btn_submit_pricing').hasClass('disabled') || $('#btn_submit_pricing').is(':disabled')) {
        }
        else {

            goModal('#accountCPL_submitprice');
            $("#submitComments").text("");
            $("#submitComments").val('');


        }
    });


    $("#submit_pricingComments").unbind().click(function () {
        //Stuff
    });

    $("#submit_pricingComments").click(function (e) {

        var winH = $(window).height();
        var winW = $(window).width();
        var id = "#accountCPL_comments";

        //Close other modals
        $('.window').css('display', 'none');

        //Set the popup window to center
        if (winH >= 700) {
            $("#accountCPL_comments").css('top', 100);
            $("#accountCPL_comments").css('left', winW / 2 - $(id).width() / 2);

        }
        else {
            $("#accountCPL_comments").css('top', winH / 2 - $(id).height() / 2);
            $("#accountCPL_comments").css('left', winW / 2 - $(id).width() / 2);

        }

        $("#accountCPL_comments").css('display', 'block');

        //calling this function is required on iOS. setting focus must be called from withing a function
        focusOnElement('#submitComments');

    });


    $("#submitComments").focus(function (e) {
        //nothing
    });

    $("#submit_pricingOK").unbind().click(function () {
        //Stuff
    });
    $("#submit_pricingWithCommentsOK").unbind().click(function () {
        //Stuff
    });

    $("#submit_pricingOK, #submit_pricingWithCommentsOK").click(function (e) {
        try {

            if (isLockout() == false) {
                if (checkLastActivity() == false) {
                    return;
                }
                var myComments = $("#submitComments").val();
                var headerID = G_currentCustomerHeaderVID;
                closeModal();
                lockoutInput();
                showProcessing('#data_loading');
                logEvent(welcomeUserName, "begin post", "submitCPL");
                $.post(
                  G_AbsoluteUri + 'Home/submitCPL',
                  { headerID: headerID, comments: myComments, userID: welcomeUserName, password: welcomePassword },
                  handleSubmitPrice
                          );
            }

        } catch (err) {
            logError(welcomeUserName, "#submit_pricingOK.click", err.message, err.stack, '');
        }
    });


    function handleSubmitPrice(content) {

        releaseLockout(true);
        try {
            if (content != undefined && content != null && content != "") {

                var responseObject;
                responseObject = JSON.parse(content);
                logEvent(welcomeUserName, "handle response", "Submit CPL: " + responseObject.responseCode);
                if (responseObject.responseCode == "SUCCESS") {
                    goBack();
                    $("#submitComments").val('');
                }
                else {
                    $("#alertMessageContent").html(responseObject.responseMessage);
                    goModal('#alertMessageBox');
                }
            }
            else {
                alert("no content");

            }
        } catch (err) {
            logError(welcomeUserName, "handleSubmitPrice", err.message, err.stack, '');

        }
    }

}




var setActiveCPLRow = function (id, openLine) {

    var number = id.substr(id.indexOf('m_li_target_') + 12);
    var target = "#calpanel_" + number;
    var point = '#accpl_line_' + number;
    var scroll_t = 4;
   
    accountCPLDataUpdateSingle(number);

    // Determine if this line has been is a "Corporate Promo"
    var promocheck = $(target + ' div:first-child').hasClass('li_cpromo');
    //var promocheck = true;
    //console.log(promocheck);
    if (promocheck == true) {
        $(target).css('height', '210px');
    }
    else {
        $(target).css('height', '168px');
    }


    if (number > (accountCPL_Array.length - scroll_t)) {
        $('#cpanel_expander').css('height', '168px');
    }
    else {
        $('#cpanel_expander').css('height', '0px');
    }

    if ($(target).is(':visible')) {
        $(target).slideUp(300, function () {
            // Fix last item over expansion issue
            $('#cpanel_expander').animate({ 'height': '0px' }, 300);
        });

        if(openLine == "false") {
            $('#accpl_line_' + number).removeClass('active');
        }

    }
    else {

            // Close existing line and open target line
            $('#accountCPL_datapanel .m_li').removeClass('active');
            $("#accpl_line_" + number).removeClass('active');
            $('#calpanel_' + current_Line).slideUp(300, function () {
                current_Line = number;
               
                
                    $('#accountCPL_datapanel').scrollTo(point, 300, function () {
                        if (openLine == "true") {
                            $(target).slideDown(300);
                            $('#accpl_line_' + number).addClass('active');
                        }
                        else {
                            $('#accpl_line_' + number).removeClass('active');
                        }
                        // Fix last item over expansion issue
                        $('#cpanel_expander').animate({ 'height': '0px' }, 300);
                    });
                

            });
        
    }
}

var sortColumn = function (column_id, section, order, targetColumn) {
    debugger;
    var targetArray,
        targetDataPanel, targetDataPanel1, targetDataPanel2,
        targetLine;
    $('#accounts_datapanel').html('');
    $('#accountCPL_datapanel').html('');
    $('#inbox_datapanel').html('');
    $('#inprocess_datapanel').html('');
    $('#completed_datapanel').html('');
    $('#addProducts_datapanel').html('');

    switch (section) {
        //case 'opes':
        //    targetArray = OPEs;
        //    targetDataPanel = '#inbox_datapanel';
        //    targetDataPanel1 = '#inprocess_datapanel';
        //    targetDataPanel2 = '#completed_datapanel';
        //    targetLine = 'lineid_'; // MUST BE 11 Characters!
        //    targetArray.sort(propComparator2(column_id));
        //    break;
        case 'accounts':
            targetArray = JSONobjectAccounts;
            targetDataPanel = '#accounts_datapanel';
            targetLine = 'accnt_line_'; // MUST BE 11 Characters!
            targetArray.sort(propComparator2(column_id));          
            break;
        case 'accountCPL':
            targetArray = accountCPL_Array;
            targetDataPanel = '#accountCPL_datapanel';
            targetLine = 'accpl_line_'; // MUST BE 11 Characters!
            G_pricePointItemsContext += 1;
            targetArray.sort(propComparator2(column_id));
            break;
        case 'addProducts':
            targetArray = addProducts_Array;
            targetDataPanel = '#addProducts_datapanel';
            targetLine = 'addpr_line_'; // MUST BE 11 Characters!
            targetSortPanel = '#addProducts_columns';
            targetArray.sort(propComparator2(column_id));
            break;
        default:
            targetArray = accounts_Array;
            targetDataPanel = '#accounts_datapanel';
            targetLine = 'accnt_line_'; // MUST BE 11 Characters!
            targetArray.sort(propComparator(column_id));
    }


    if (order == 'DESC') {
        targetArray.reverse();
    }

    accountsData = "";
    accountsData1 = "";
    accountsData2 = "";
    if (appstate == 'accounts') {
        accountsData = accountDataRender(targetLine);
        buildFilterOptions();
    }
    //else if (appstate == 'opes') {
    //    accountsData = opeaccountDataRender(targetLine);
    //    accountsData1 = opeaccountDataRender(targetLine);
    //    accountsData2 = opeaccountDataRender(targetLine);
    //    $(targetDataPanel1).html(accountsData1);
    //    $(targetDataPanel2).html(accountsData2);
    //}
    else if (appstate == 'accountCPL') {
        accountsData = accountCPLDataRender();
        if (accountsData != "") {
            setActiveCPLRow('m_li_target_' + current_Line.toString(), 'false');
            buildCPLFilterOptions();
            startPricePointUpdates();
           

        }
        else {
            accountsData = "<div  >No Match Found</div>"
        }
       
    }
    else if (appstate == 'addProducts') {
        accountsData = addProductsDataRender(totalAddProducts);
        setThemeOptionsHTML('producttheme');
        
        
    }
    else {
        accountsData = accountDataRender();
    }

    $(targetDataPanel).html(accountsData);
    targetColumn = '.' + targetColumn;
    $('.sort').removeClass('active');
    $(targetColumn).addClass('active');

    
    var opeaccountDataRender = function (targetLine) {
        debugger;
        total = OPEs.length;
        statusCompleted = 0;
        statusInProgress = 0;
        statusInbox = 0;
        statusTotal = 0;


        for (var i = 0; i < total; i++) {
            var v = i;
            if ((v + 1) % 2 == 0) {
                lineval = " even";
            }
            else {
                lineval = "";
            }


            if (OPEs[i].account.name.indexOf("\'") >= 0) {
                OPEs[i].account.name = replaceAll('\'', '`', OPEs[i].account.name);
            }


            var status = OPEs[i].status;

            if (OPEs[i].itemVisible == "true") {
                switch (status) {
                    case 'completed':
                        statusCompleted++;
                        statusTotal++;
                        break;
                    case 'inprogress':
                        statusInProgress++;
                        statusTotal++;
                        break;
                    case 'inbox':
                        statusInbox++;
                        statusTotal++;
                        break;
                }

            }


            accountsData += '<div onclick="on_m_li_click(this.id,\'' + targetLine + '\');" class="m_li container fluid' + lineval + '" id="lineid_' + i + '"';
            if (OPEs[i].itemVisible == "true") {
                accountsData += ' style="display:block"  >\n';
            }
            else {
                accountsData += ' style="display:none"  >\n';
            }
            accountsData += '<div class="container custom">\n';
            accountsData += '<div class="starter line col1">\n';
            accountsData += '<p>' + OPEs[i].orderNo + '</p>\n';
            accountsData += '</div>\n';
            accountsData += '<div class="line col2">\n';
            accountsData += '<p>' + OPEs[i].orderLine + '</p>\n';
            accountsData += '</div>\n';
            accountsData += '<div class="line col3">\n';
            accountsData += '<p>' + OPEs[i].account.name + '</p>\n';
            accountsData += '</div>\n';
            accountsData += '<div class="line col4">\n';
            accountsData += '<p>' + OPEs[i].account.number + '</p>\n';
            accountsData += '</div>\n';
            accountsData += '<div class="line col5">\n';
            accountsData += '<p>' + OPEs[i].account.customerGroup + '</p>\n';
            accountsData += '</div>\n';
            accountsData += ' <div class="line col6 ender active">\n';
            accountsData += '<p>' + OPEs[i].dateCreated + '</p>\n';
            accountsData += '</div>\n';
            accountsData += '</div>\n';

            accountsData += '</div>\n';


        }

        return accountsData;

    }

   

    $('.priceset').unbind().click(function () {
        //Stuff
    });

    $('.priceset').click(function (e) {

        if ($(this).hasClass('disabled')) {
            e.preventDefault();

        }
        else {
            $('.priceset').removeClass('active');
            $(this).addClass('active');
            $('#accountCPL_edit_btn').removeClass('disabled');
            $('#accountCPL_edit_btn').prop('disabled', false);
            $('#price_target').html('$ 0.00');
            switch (this.id) {
                case 'set_TM1':
                    //left side
                    $('#m_cal_value_l').html('$ ' + CurrencyFormatted(accountCPL_Array[G_current_Index].TM1Roll));
                    //right side
                    $('#m_cal_value_r').html('$ ' + CurrencyFormatted(accountCPL_Array[G_current_Index].TM1Cut));
                    break;

                case 'set_TM2':
                    //left side
                    $('#m_cal_value_l').html('$ ' + CurrencyFormatted(accountCPL_Array[G_current_Index].TM2Roll));
                    //right side
                    $('#m_cal_value_r').html('$ ' + CurrencyFormatted(accountCPL_Array[G_current_Index].TM2Cut));
                    break;
                case 'set_TM3':
                    //left side
                    $('#m_cal_value_l').html('$ ' + CurrencyFormatted(accountCPL_Array[G_current_Index].TM3Roll));
                    //right side
                    $('#m_cal_value_r').html('$ ' + CurrencyFormatted(accountCPL_Array[G_current_Index].TM3Cut));
                    break;
                case "set_TM1group":
                    $('#accountCPL_groupeditprice .priceset').removeClass('active');
                    $('#m_cal_value_g').html('TM1 Price');
                    $('#cal_ind_g').html('=');
                    $(this).addClass('active');
                    G_groupEditPriceLevel = 'TM1';
                    $("#slider2").slider('option', 'value', 0);

               //     buildGroupSlider(0);

                    return;
                   // doGroupEdit = 'TM1';

                    break;

                case "set_TM2group":
                    $('#m_cal_value_g').html('TM2 Price');
                    $('#cal_ind_g').html('=');
                    $('#accountCPL_groupeditprice .priceset').removeClass('active');
                    $("#slider2").slider('option', 'value', 0);
                    G_groupEditPriceLevel = 'TM2';
                    $(this).addClass('active');
                //    buildGroupSlider(0);
                    return;
                    break;

                case "set_TM3group":
                    $('#m_cal_value_g').html('TM3 Price');
                    $('#cal_ind_g').html('=');
                    $('#accountCPL_groupeditprice .priceset').removeClass('active');
                    $("#slider2").slider('option', 'value', 0);
                    G_groupEditPriceLevel = 'TM3';
                    $(this).addClass('active');
                 //   buildGroupSlider(0);
                    return;

                    break;
                default:
                    break;
            }

            // Rebuild Slider with these values
            // Set slider value
            var thisvalue = $(input_target).html();
            thisvalue = parseFloat(thisvalue.split(' ')[1]);
            thisvalue = thisvalue - current_Load;
            buildSlider(thisvalue, current_Load);

        }
    
    });

    //$('.select_icon').unbind().click(function () {
    //    //Stuff
    //});

    //$('.select_icon').click(function () {
    //    var state = $(this).hasClass('active');
    //    var id = $(this).attr('id');
  
    //    if (state == true) {
    //        if (id == "master_select") {
    //            $('.select_icon').removeClass('active');
    //        }
    //        else {
    //            $(this).removeClass('active');
    //            $('#master_select').removeClass('active');
    //        }
    //    }
    //    else {
    //        if (id == "master_select") {
    //            $('.select_icon').addClass('active');
    //        }
    //        else {

    //            $(this).addClass('active');
    //            if ($('.select_icon').length == ($('.select_icon.active').length + 1)) {
    //                $('#master_select').addClass('active');
    //            }
    //            else {
    //                $('#master_select').removeClass('active');
    //            }
    //        }
    //    }

    //});
}


var buildSlider = function (price, load) {
    // Add custom slider component
    //Store frequently elements in variables
    var slider = $('#slider'),
    input_percent = $('#input_percent'),
    price_target = price,
    slider_price = 0,
    minval = 0,
    maxval = 5.4,
    value_l = $('#m_cal_value_l').html(),
    value_r = $('#m_cal_value_r').html();

    value_l = parseFloat(value_l.split(' ')[1]);
    value_r = parseFloat(value_r.split(' ')[1]);

    value_l = value_l - load;
    value_r = value_r - load;

    if (value_r <= 0 || value_l <= 0) {

        $('#accountCPL_edit_btn').addClass('disabled');
        $('#accountCPL_edit_btn').prop('disabled', true);


        if (value_r <= 0) { $('#m_cal_value_r').html('$ 0.00'); }

        if (value_l <= 0) { $('#m_cal_value_l').html('$ 0.00'); }

        priceAlert();
    } else {

        $('#accountCPL_edit_btn').removeClass('disabled');
        $('#accountCPL_edit_btn').prop('disabled', false);
    }




    if (constrainedPrice == false) {
        minval = 0;
        maxval = price_target + price_target + G_priceStep;
        slider_price = price_target.toFixed(2);
       // $('#price_target').html('$ ' + (price_target.toFixed(2)));
    }
    else {
        minval = -5.40;
        maxval = 5.40;
        slider_price = 0;

       // $('#price_target').html('$ 0.00');

       

    }

    var testCurrentPrice = 0;
    var testTargetPrice = 0;
    if (input_target == '#m_cal_value_l') {
        testCurrentPrice = parseFloat($('#current_roll').html().replace('$', ''));
        testTargetPrice = parseFloat($(input_target).html().replace('$', '').replace(' ', ''));

    }
    else {
        testCurrentPrice = parseFloat($('#current_cut').html().replace('$', ''));
        testTargetPrice = parseFloat($(input_target).html().replace('$', '').replace(' ', ''));
    }
    testCurrentPrice = (testCurrentPrice + 0).toFixed(2);
    testTargetPrice = (testTargetPrice + 0).toFixed(2);
    $('#price_target').html('$ ' + (testTargetPrice - testCurrentPrice).toFixed(2));

    
    //Call the Slider
    slider.slider({
        //Config
        range: "min",
        min: minval,
        max: maxval,
        step: G_priceStep,
        value: slider_price,

        start: function (event, ui) {

        },

        //Slider Event
        slide: function (event, ui) { //When the slider is sliding
            
            var value = slider.slider('value');
 
            var value_roll = value_l;
            var value_cut = value_r;

            if (input_target == '#m_cal_value_l') {
                value_roll = value;
                value_cut = value_r;
            }
            else {
                value_roll = value_l;
                value_cut = value;
            }

            if (constrainedPrice == false) {
                price_eval = comparePriceValues(value_roll, value_cut, "minus_btn");
                if (price_eval == false) {

                    $('#accountCPL_edit_btn').addClass('disabled');
                    $('#accountCPL_edit_btn').prop('disabled', true);
                    priceAlert();
                }
            }


          // $('#price_target').html('$ ' + value.toFixed(2));  //Adjust the input accordingly
           

            


            if (constrainedPrice == false) {
                $(input_target).html('$ ' + (value + 0).toFixed(2));
             
            }
            else {
                $('#m_cal_value_l').html('$ ' + ((value_l + parseFloat(value) + 0).toFixed(2)));
                $('#m_cal_value_r').html('$ ' + ((value_r + parseFloat(value) + 0).toFixed(2)));

            }

            var testCurrentPrice = 0;
            var testTargetPrice = 0;
            if (input_target == '#m_cal_value_l') {
                testCurrentPrice = parseFloat($('#current_roll').html().replace('$', ''));
                testTargetPrice = parseFloat($(input_target).html().replace('$', '').replace(' ', ''));

            }
            else {
                testCurrentPrice = parseFloat($('#current_cut').html().replace('$', ''));
                testTargetPrice = parseFloat($(input_target).html().replace('$', '').replace(' ', ''));
            }
            testCurrentPrice = (testCurrentPrice + 0).toFixed(2);
            testTargetPrice = (testTargetPrice + 0).toFixed(2);
            $('#price_target').html('$ ' + (testTargetPrice - testCurrentPrice).toFixed(2));

           
        },

        stop: function (event, ui) {
            if (price_eval == false) {
                // Reset roll price and evaluate
                // Get cut price and subtract .09 to set roll price
               
                var value_r = $('#m_cal_value_r').html();
                var value_l = $('#m_cal_value_l').html();
                value_r = parseFloat(value_r.split(' ')[1]);
                value_l = parseFloat(value_l.split(' ')[1]);

                $('#m_cal_value_l').html('$ ' + ((value_r - G_priceStep).toFixed(2)));
                price_eval = true;

                if (input_target == '#m_cal_value_l') {
                    buildSlider(((value_r - G_priceStep) - 0), current_Load);
                }
                else {
                    buildSlider((value_r - 0), current_Load);
                }

            }

            

            $('.m_cal_value').removeClass('alerted');
            var value_r = $('#m_cal_value_r').html();
            var value_l = $('#m_cal_value_l').html();
            
            value_r = parseFloat(value_r.split(' ')[1]);
            value_l = parseFloat(value_l.split(' ')[1]);
            
            if (value_r <= 0 || value_l <= 0) {

                $('#accountCPL_edit_btn').addClass('disabled');
                $('#accountCPL_edit_btn').prop('disabled', true);

                if(value_r <= 0) { $('#m_cal_value_r').html('$ 0.00'); }

                if (value_l <= 0) { $('#m_cal_value_l').html('$ 0.00'); }

                priceAlert();
            } else {

                $('#accountCPL_edit_btn').removeClass('disabled');
                $('#accountCPL_edit_btn').prop('disabled', false);
            }

        }
    });

}


var buildGroupSlider = function (iprice) {
    // Reset value to 0
    iprice = 0.00; // Temporarily set input price at 0
    $('#m_cal_value_g').html('$ 0.00');
    $('#cal_ind_g').html('');
   // $('#accountCPL_groupeditprice .priceset').removeClass('active');




    var slider = $('#slider2'),
                  //input_percent = $('#input_percent'),
            //price_target = price,
            slider_price = iprice,
           // minval = -5.49,
           //maxval = 5.49,
            minval = G_groupEditMinimumValue,
            maxval = G_groupEditMaximumValue,
            value_g = $('#m_cal_value_l').html();

    // Reset value to 0
    $('#m_cal_value_g').html('$ 0.00');

    slider.slider({
        range: "min",
        min: minval,
        max: maxval,
        step: G_priceStep,
        value: slider_price,

        start: function (event, ui) {
            //var value  = ui.value;

        },

        //Slider Event
        slide: function (event, ui) { //When the slider is sliding
            var value = ui.value;
            var valuee = Math.abs(value);
            $('#m_cal_value_g').html('$ ' + valuee.toFixed(2));  //Adjust the input accordingly

        },

        stop: function (event, ui) {
            var value = ui.value;
            var valuee = Math.abs(value);
            var calcOperator = '';
          
           // $('#m_cal_value_g').html('$ ' + valuee.toFixed(2));  //Adjust the input accordingly
            //$('#cal_ind_g').html(G_groupEditPriceLevel);
            switch (true) {
                case (value > 0):
                    // Positive
                    //$('#cal_ind_g').html('+');
                    $('#cal_ind_g').html(G_groupEditPriceLevel);
                    calcOperator = '+'
                    $('#m_cal_value_g').html(calcOperator + ' $ ' + valuee.toFixed(2));  //Adjust the input accordingly
                    break;
                case (value < 0):
                    // Negative
                    //$('#cal_ind_g').html('-');
                    $('#cal_ind_g').html(G_groupEditPriceLevel);
                    calcOperator = '-'
                    $('#m_cal_value_g').html(calcOperator + ' $ ' + valuee.toFixed(2));  //Adjust the input accordingly
                    break;
                case (value == 0):
                   $('#cal_ind_g').html('=');
                    calcOperator = '='
                    $('#m_cal_value_g').html(G_groupEditPriceLevel + ' Price');
                    break;

            }
          //  $('#m_cal_value_g').html( calcOperator + ' $ ' + valuee.toFixed(2));  //Adjust the input accordingly

            doGroupEdit = value;

        }
    });



}

var calculateGroupClick = function (increment) {
    var value_g = $("#slider2").slider('option', 'value'),
    //var value_g = $('#m_cal_value_g').html(),
        input_target = $('#m_cal_value_g'),
        ind = $('#cal_ind_g').html(),
        add = 0;

    add = parseFloat(increment);
    value_g = parseFloat(value_g);


    var newval_abs = Math.abs(value_g + add);
    newval_abs = newval_abs.toFixed(2);
    var newval = (value_g + add);
    newval = newval.toFixed(2);


    $('#cal_ind_g').html(G_groupEditPriceLevel);
    var calcOperator = '';
    switch (true) {
        case (newval > 0):
            // Positive
            //$('#cal_ind_g').html('+');
            calcOperator = '+';
            break;
        case (newval < 0):
            // Negative
            //$('#cal_ind_g').html('-');
            calcOperator = '-';
            break;

        default:
            //  $('#cal_ind_g').html('');
           // $('#cal_ind_g').html('=');
           // $('#m_cal_value_g').html(G_groupEditPriceLevel + ' Price');

    }

    

    if ((newval <= G_groupEditMaximumValue) && (newval >= G_groupEditMinimumValue)) {
        if (newval == 0) {
            //$(input_target).html(calcOperator + ' $ ' + newval_abs);
            $('#cal_ind_g').html('=');
            $('#m_cal_value_g').html(G_groupEditPriceLevel + ' Price');
            $("#slider2").slider('option', 'value', newval);

            doGroupEdit = newval;
        }
        else {
            $(input_target).html(calcOperator + ' $ ' + newval_abs);
            $("#slider2").slider('option', 'value', newval);
            doGroupEdit = newval;
        }
    }
    else {
        $('.m_cal_value_group').addClass('alerted');
        $('.m_cal_value_group').fadeOut(300, function () {
            $('.m_cal_value_group').removeClass('alerted');

            $('.m_cal_value_group').fadeIn(300, function () {
                //
            });

        });

    }

}

var calculateClick = function (increment,buttonID) {
 
    var value_l = $('#m_cal_value_l').html(),
    value_r = $('#m_cal_value_r').html(),
    value_target = $(input_target).html(),
    value_slider = $('#price_target').html();

    value_l = parseFloat(value_l.split(' ')[1]);
    value_r = parseFloat(value_r.split(' ')[1]);
    value_target = parseFloat(value_target.split(' ')[1]);
    value_slider = parseFloat(value_slider.split(' ')[1]);

    if (input_target == '#m_cal_value_l') {
        if (constrainedPrice == false) {
            price_eval = comparePriceValues((value_l + increment), value_r, buttonID);
        }
        else {
            price_eval = comparePriceValues((value_l + increment),( value_r + increment), buttonID);
        }
    }
    else {
        if (constrainedPrice == false) {
            price_eval = comparePriceValues(value_l, (value_r + increment), buttonID);
        }
        else {
            price_eval = comparePriceValues((value_l  + increment), (value_r + increment), buttonID);
        }
    }

    if (price_eval == true) {

        if (constrainedPrice == false) {
            $(input_target).html('$ ' + (value_target + increment).toFixed(2));
          


            $("#slider").slider('option', 'value', ((value_target + increment) - 0).toFixed(2));

        }
        else {
            $('#m_cal_value_l').html('$ ' + ((parseFloat(value_l + increment)).toFixed(2)));
            $('#m_cal_value_r').html('$ ' + ((parseFloat(value_r + increment)).toFixed(2)));

           


            $("#slider").slider('option', 'value', (value_slider + increment).toFixed(2));

        }

        var testCurrentPrice = 0;
        var testTargetPrice = 0;
        if (input_target == '#m_cal_value_l') {
            testCurrentPrice = parseFloat($('#current_roll').html().replace('$', ''));
            testTargetPrice = parseFloat($(input_target).html().replace('$', '').replace(' ', ''));

        }
        else {
            testCurrentPrice = parseFloat($('#current_cut').html().replace('$', ''));
            testTargetPrice = parseFloat($(input_target).html().replace('$', '').replace(' ', ''));
        }
        testCurrentPrice = (testCurrentPrice + 0).toFixed(2);
        testTargetPrice = (testTargetPrice + 0).toFixed(2);
        $('#price_target').html('$ ' + (testTargetPrice - testCurrentPrice).toFixed(2));

        $('#accountCPL_edit_btn').removeClass('disabled');
        $('#accountCPL_edit_btn').prop('disabled', false);
    }
    else {

        if (value_r <= 0 || value_l <= 0) {
           
            $('#accountCPL_edit_btn').addClass('disabled');
            $('#accountCPL_edit_btn').prop('disabled', true);
        } else {
           
            $('#accountCPL_edit_btn').removeClass('disabled');
            $('#accountCPL_edit_btn').prop('disabled', false);
        }
        priceAlert();

    }

}

var comparePriceValues = function (roll, cut,buttonID) {
    if(buttonID == "minus_btn"){
        if (roll <= 0 || cut <= 0) {
            return false;
        }
    }

    if (roll > cut) {
        return false;
    }
    else {
        return true;
    }

}

var priceAlert = function () {
        $(input_target).addClass('alerted');
        $(input_target).fadeOut(800, function () {
        $(input_target).removeClass('alerted');

        $(input_target).fadeIn(800, function () {
            //
        });

    });

}

function filterDealer(theObject) {
    return true;
}

function priceLevelComparator() {
    return function (a, b) {
        var aString = a["category"];
        var bString = b["category"];

            switch (aString) {
                case 'GT-TM1':
                    aString = "1";
                    break;
                case 'EQ-TM1':
                    aString = "2";
                    break;
                case 'TM1-TM2':
                    aString = "3";
                    break;   
                case 'TM1-2':
                    aString = "3A";
                    break;
                case 'EQ-TM2':
                    aString = "4";
                    break;
                case 'TM2-TM3':
                    aString = "5";
                    break;
                case 'TM2-3':
                    aString = "5A";
                    break;
                case 'EQ-TM3':
                    aString = "6";
                    break;
                case 'LT-TM3':
                    aString = "7";
                    break;
                default:
                    aString = "Z";
                    break;

            }

            switch (bString) {
                case 'GT-TM1':
                    bString = "1";
                    break;
                case 'EQ-TM1':
                    bString = "2";
                    break;
                case 'TM1-TM2':
                    bString = "3";
                    break;
                case 'TM1-2':
                    bString = "3A";
                    break;
                case 'EQ-TM2':
                    bString = "4";
                    break;
                case 'TM2-TM3':
                    bString = "5";
                    break;
                case 'TM2-3':
                    bString = "5A";
                    break;
                case 'EQ-TM3':
                    bString = "6";
                    break;
                case 'LT-TM3':
                    bString = "7";
                    break;
                default:
                    bString = "Z";
                    break;

            }

        if (aString < bString)
            return -1;
        if (aString > bString)
            return 1;
        return 0;
    }

}

// prop is column name
function propComparator(prop) {
    return function (a, b) {
        var aString = a[prop];
        var bString = b[prop];





        if (aString < bString)
            return -1;
        if (aString > bString)
            return 1;
        return 0;
    }

}

function propComparator2(prop) {

    return function (a, b) {
        var aString = a[prop];
        var bString = b[prop];
        var aIndex = a['itemIndex'];
        var bIndex = b['itemIndex'];
        var altStringA1 = null;
        var altStringB1 = null;
        var altStringA2 = null;
        var altStringB2 = null;
        var altStringA3 = null;
        var altStringB3 = null;
        var altStringA4 = null;
        var altStringB4 = null;
       
      
        if (prop == "VState") {
           
            if (aString == undefined || aString == "approved" || aString == "") {
                aString = "z";
            }
            else {
                aString = "a";
            }

            if (bString == undefined || bString == "approved" || aString == "") {
                bString = "z";
            } else {
                bString = "a";
            }

            altStringA1 = a["StyleName"];
            altStringB1 = b["StyleName"];

            altStringA2 = a["SellingSize"];
            altStringB2 = b["SellingSize"];
        }

        if (prop == "StyleName") {

            altStringA1 = a["SellingSize"];
            altStringB1 = b["SellingSize"];
        }

        if (prop == "status") {
           
            altStringA1 = a["name"];
            altStringB1 = b["name"];
        }

        if (prop == "sales") {

            altStringA1 = a["name"];
            altStringB1 = b["name"];
        }

        if (prop == "MonthsSales") {

            altStringA1 = a["StyleName"];
            altStringB1 = b["StyleName"];
        }

        if (prop == "PriceLevel") {

            switch (aString) {
                case 'GT-TM1':
                    aString = "1";
                    break;
                case 'EQ-TM1':
                    aString = "2";
                    break;
                case 'TM1-TM2':
                    aString = "3";
                    break;
                case 'TM1-2':
                    aString = "3A";
                    break;
                case 'EQ-TM2':
                    aString = "4";
                    break;
                case 'TM2-TM3':
                    aString = "5";
                    break;
                case 'TM2-3':
                    aString = "5A";
                    break;
                case 'EQ-TM3':
                    aString = "6";
                    break;
                case 'LT-TM3':
                    aString = "7";
                    break;
                default:
                    aString = "Z";
                    break;

            }

            switch (bString) {
                case 'GT-TM1':
                    bString = "1";
                    break;
                case 'EQ-TM1':
                    bString = "2";
                    break;
                case 'TM1-TM2':
                    bString = "3";
                    break;
                case 'EQ-TM2':
                    bString = "4";
                    break;
                case 'TM2-TM3':
                    bString = "5";
                    break;
                case 'EQ-TM3':
                    bString = "6";
                    break;
                case 'LT-TM3':
                    bString = "7";
                    break;
                default:
                    bString = "Z";
                    break;

            }


        }


        if (altStringA2 != null) {
            if (altStringA2 == altStringB2) {               
                if ((aString == bString)) {
                    if (altStringA1 == altStringB1) {
                        if (altStringA2 < altStringB2)
                        return -1;
                    if (altStringA2 > altStringB2)
                        return 1;
                    return 0;
                   }
              }  
           }    
        }


        if (altStringA1 != null) {
            if ((aString == bString)) {
                if (altStringA1 < altStringB1)
                    return -1;
                if (altStringA1 > altStringB1)
                    return 1;
                return 0;
            }
        }
        

        if (aIndex != undefined && (aString == bString)) {
            if (parseInt(aIndex) < parseInt(bIndex))
                return 1;
            if (parseInt(aIndex) > parseInt(bIndex))
                return -1;
        }


        if (aString < bString)
            return -1;
        if (aString > bString)
            return 1;
        return 0;
    }

}




function numberWithCommas(x) {
    return  CommaFormatted(CurrencyFormatted(x,false));
}

function CurrencyFormatted(amount) {
   
    if (amount == "") {
        return "";
    }
    var i = parseFloat(amount);
    if (isNaN(i)) { i = 0.00; }
    var minus = '';
    if (i < 0) { minus = '-'; }
    i = Math.abs(i);
    i = parseInt((i + .005) * 100);
    i = i / 100;
    s = new String(i);
    if (s.indexOf('.') < 0) { s += '.00'; }
    if (s.indexOf('.') == (s.length - 2)) { s += '0'; }
    s = minus + s;
    return s;
}

function CommaFormatted(amount, boolTruncateDecimal) {
    var delimiter = ","; // replace comma if desired
    var a = amount.toString().split('.', 2)
    var d = "";
    if (a.length > 1) {
        d = a[1];
    }
    var i = parseInt(a[0]);
    if (isNaN(i)) { return ''; }
    var minus = '';
    if (i < 0) { minus = '-'; }
    i = Math.abs(i);
    var n = new String(i);
    var a = [];
    while (n.length > 3) {
        var nn = n.substr(n.length - 3);
        a.unshift(nn);
        n = n.substr(0, n.length - 3);
    }
    if (n.length > 0) { a.unshift(n); }
    n = a.join(delimiter);

    if (boolTruncateDecimal = true || d.length < 1) { amount = n; }
    else { amount = n + '.' + d; }
    amount = minus + amount;
    return amount;
}



var addStatusFilter = function (status, isVisible, isVisiblePotential) {
    var foundItem = false;
    
    for (var i = 0; i < G_filter_CustomerStatusArray.length;i++)
        {
        if (G_filter_CustomerStatusArray[i].category === status) {
            if (isVisible == "true") {
                G_filter_CustomerStatusArray[i].count++;
            }
            if (isVisiblePotential == "true") {
                G_filter_CustomerStatusArray[i].potentialCount++;

            }
            G_filter_CustomerStatusArray[i].absoluteCount++;
            foundItem = true;
            break;

        }
    }
    if (foundItem === false) {
        var newItem = new FilterItem(status, 1, isVisible, isVisiblePotential);
        G_filter_CustomerStatusArray.push(newItem);
    }
}

var addGroupFilter = function (groupname, isVisible, isVisiblePotential) {
    var foundItem = false;
    for (var i = 0; i < G_filter_CustomerGroupArray.length; i++) {
        if (G_filter_CustomerGroupArray[i].category === groupname) {
            if (isVisible == "true") {
                G_filter_CustomerGroupArray[i].count++;
            }
            if (isVisiblePotential == "true") {
                G_filter_CustomerGroupArray[i].potentialCount++;

            }
            G_filter_CustomerGroupArray[i].absoluteCount++;
            
            foundItem = true;
            break;
        }
    }
    if (foundItem === false) {
        var newItem = new FilterItem(groupname, 1, isVisible, isVisiblePotential);
        G_filter_CustomerGroupArray.push(newItem);
    }
}

var addCPLCategoryFilter = function (columnname, categoryname,isVisible,isVisiblePotential) {
   
    var foundItem = false;
    var targetArray = getTargetArray(columnname);
    if (targetArray == null) {
        return false;
    }


    for (var i = 0; i < targetArray.length; i++) {
        if (targetArray[i].category === categoryname) {
            if (isVisible == "true") {
                targetArray[i].count++;
            }
            if (isVisiblePotential == "true") {
                targetArray[i].potentialCount++;

            }

            targetArray[i].absoluteCount++;
            foundItem = true;
            break;
        }
    }
    if (foundItem === false) {
        var newItem = new FilterItem(categoryname, 1, isVisible,isVisiblePotential);
        targetArray.push(newItem);
    }

   
   

}



var setFilterOptionsHTML = function (ArrayName) {

    var cgroups = ""
    var theArray = getTargetArray(ArrayName)
    if (theArray == null) {
        return cgroups;
    }

    theArray.sort(propComparator("category"));
    for (var i = 0; i < theArray.length; i++) {

        if (theArray[i].count > 0 || theArray[i].potentialCount > 0) {
            cgroups += '<li><a href="#" id="' + ArrayName + '_' + i + '"><span class="checker"></span> ' + theArray[i].category + '<span class="tqty" id="' + ArrayName + 'qty_' + i + '">';

            if (theArray[i].count > 0) {
                cgroups += ' (' + theArray[i].count + ')';
            } else {
                cgroups += ' (' + theArray[i].potentialCount + ')';
            }

            cgroups += '</span></a></li> \n';
        }
    }
    $('#account_' + ArrayName + 'list').html(cgroups);
 

}


var setThemeOptionsHTML = function (ArrayName) {

    var cgroups = ""
    var theArray = getTargetArray(ArrayName)
    if (theArray == null) {
        return cgroups;
    }

    theArray.sort(propComparator("category"));
    for (var i = 0; i < theArray.length; i++) {

        if (theArray[i].count > 0 || theArray[i].potentialCount > 0) {
            cgroups += '<li><a href="#" id="' + ArrayName + '_' + i + '"><span class="checker"></span> ' + theArray[i].category + '<span class="tqty" id="' + ArrayName + 'qty_' + i + '">';

            if (theArray[i].count > 0) {
                cgroups += ' (' + theArray[i].count + ')';
            } else {
                cgroups += ' (' + theArray[i].potentialCount + ')';
            }

            cgroups += '</span></a></li> \n';
        }
    }
    $('#products_theme' + 'list').html(cgroups);

}

var setCPLFilterOptionsHTML = function (ArrayName) {

    var cgroups = ""
    var theCategory = "";
    var theArray = getTargetArray(ArrayName)
    if (theArray == null) {
        return cgroups;
    }

    theArray.sort(propComparator("category"));
    for (var i = 0; i < theArray.length; i++) {
        theCategory = theArray[i].category;
        if (ArrayName == "pricelevel" && theCategory == "") {
            theCategory = "No Price Level";
        }

        if (theArray[i].count > 0 || theArray[i].potentialCount > 0) {
            cgroups += '<li><a href="#" id="' + ArrayName + '_' + i + '"><span class="checker"></span> ' + theCategory + '<span class="tqty" id="' + ArrayName + 'qty_' + i + '">';

            if (theArray[i].count > 0) {
                cgroups += ' (' + theArray[i].count + ')';
            } else {
                cgroups += ' (' + theArray[i].potentialCount + ')';
            }
            
            cgroups += '</span></a></li> \n';
        }
    }
    $('#cplaccount_' + ArrayName + 'list').html(cgroups);

}

var buildCPLFilterOptions = function () {
    //logEvent(welcomeUserName, "buildCPLFilterOptions", "Begin");
    //THEME DISPLAY
    var cgroups = "";
    
    setCPLFilterOptionsHTML("theme");
    setCPLFilterOptionsHTML("brand");
    setCPLFilterOptionsHTML("promo");
    setCPLFilterOptionsHTML("cpromo");
    setCPLFilterOptionsHTML("autotm3");
    setCPLFilterOptionsHTML("pricelevel");
    //logEvent(welcomeUserName, "buildCPLFilterOptions", "End");
    return;
   

}

var buildFilterOptions = function () {
    var cgroups = "";
    setFilterOptionsHTML("group");

    setFilterOptionsHTML("status");
    return;

}

function arraySelector(indexParam, action) {
    var targetArray = accountCPL_Array;
    
    if (indexParam == 'all') {
        G_groupEditItemSelectedCounter = 0;
        G_groupIsCoreCounter = 0;
        for (var i = 0; i < targetArray.length; i++) {
            // Set default state of all line items to selected
            if ((targetArray[i].ItemVisible == "true" || targetArray[i].ItemSelected == "true") && targetArray[i].ItemDeleted == "false") {
                targetArray[i].ItemSelected = "true";
                targetArray[i].ItemSubmitted = false;
                targetArray[i].ItemProcessed = false;
                $("#editselect_" + i).addClass("active");

                //if (G_groupEditType == "edit") {
                //    $("#editselect_" + i).addClass("active");
                //    //$("#accpl_line_" + i).addClass("li_edit");
                //    //$("#accpl_line_" + i).addClass("active");
                //   // setLineStatus(i, "edit");
                //}
                //if (G_groupEditType == "expire") {
                //   // setLineStatus(i, "expire");
                //    $("#expireselect_" + i).addClass("active");
                //    //$("#accpl_line_" + i).addClass("li_expire");
                //    //$("#accpl_line_" + i).addClass("active");
                //}
                //if (G_groupEditType == "newromo") {
                //    $("#newpromoselect_" + i).addClass("active");
                //    //$("#accpl_line_" + i).addClass("li_promo");
                //    //$("#accpl_line_" + i).addClass("active");
                //    //setLineStatus(i, "newpromo");
                //}
                if (targetArray[i].Iscore != undefined && targetArray[i].Iscore != "0") {
                    G_groupIsCoreCounter += 1;
                }
                G_groupEditItemSelectedCounter += 1;
            }
            else {
                targetArray[i].ItemSelected = "false";
                $("#editselect_" + i).removeClass("active");
                //$("#expireselect_" + i).removeClass("active");
                //$("#newpromoselect_" + i).removeClass("active");
                ////$("#accpl_line_" + i).removeClass("li_edit");
                //$("#accpl_line_" + i).removeClass("li_expire");
                //$("#accpl_line_" + i).removeClass("li_promo");
                //$("#accpl_line_" + i).removeClass("active");
                //   setLineStatus(i, "");
            }

        }



    }
    else if (indexParam == 'none') {
        G_groupEditItemSelectedCounter = 0;
        G_groupIsCoreCounter = 0;
        for (var i = 0; i < targetArray.length; i++) {
            // Set default state of all line items to unselected
            targetArray[i].ItemSelected = "false";
            targetArray[i].ItemSubmitted = false;
            targetArray[i].ItemProcessed = false;
            $("#editselect_" + i).removeClass("active");
            //$("#expireselect_" + i).removeClass("active");
            //$("#newpromoselect_" + i).removeClass("active");
            //$("#accpl_line_" + i).removeClass("li_edit");
            //$("#accpl_line_" + i).removeClass("li_expire");
            //$("#accpl_line_" + i).removeClass("li_promo");
            //$("#accpl_line_" + i).removeClass("active");
          
           // setLineStatus(i, "");

        }


    }
    else {

        if (action == "select") {
            targetArray[indexParam].ItemSelected = "true";
            $("#editselect_" + indexParam).addClass("active");
            targetArray[indexParam].ItemSubmitted = false;
            targetArray[indexParam].ItemProcessed = false;
            //if (G_groupEditType == "edit") {

            //    $("#editselect_" + indexParam).addClass("active");
            //    //$("#accpl_line_" + indexParam).addClass("li_edit");
            //    //$("#accpl_line_" + indexParam).addClass("active");
            //   // setLineStatus(indexParam, "edit");
            //}
            //if (G_groupEditType == "expire") {
            //    //setLineStatus(indexParam, "expire");
            //    $("#expireselect_" + indexParam).addClass("active");
            //    //$("#accpl_line_" + indexParam).addClass("li_expire");
            //    //$("#accpl_line_" + indexParam).addClass("active");
            //}
            //if (G_groupEditType == "newpromo") {
            //    $("#newpromoselect_" + indexParam).addClass("active");
            //    //$("#accpl_line_" + indexParam).addClass("li_promo");
            //    //$("#accpl_line_" + indexParam).addClass("active");
            //   // setLineStatus(indexParam, "newpromo");
            //}
            if (targetArray[indexParam].Iscore != undefined && targetArray[indexParam].Iscore != "0") {
                G_groupIsCoreCounter += 1;
            }
            
            G_groupEditItemSelectedCounter += 1;

        }
        else {
            G_groupEditItemSelectedCounter -= 1;
            if (targetArray[indexParam].Iscore != undefined && targetArray[indexParam].Iscore != "0") {
                G_groupIsCoreCounter -= 1;
            }
            targetArray[indexParam].ItemSelected = "false";
            $("#editselect_" + indexParam).removeClass("active");
            //$("#expireselect_" + indexParam).removeClass("active");
            //$("#newpromoselect_" + indexParam).removeClass("active");
            //$("#accpl_line_" + indexParam).removeClass("li_edit");
            //$("#accpl_line_" + indexParam).removeClass("li_expire");
            //$("#accpl_line_" + indexParam).removeClass("li_promo");
            //$("#accpl_line_" + indexParam).removeClass("active");

           // setLineStatus(indexParam, "");
        }

    }

    $('#groupEditItemSelectedCounter').html(G_groupEditItemSelectedCounter);

    if (G_groupEditItemSelectedCounter > 0) {
        $('#btn_apply_group_edit').removeClass('disabled');
        $('#btn_apply_group_edit').removeAttr('disabled');
    }
    else {
        $('#btn_apply_group_edit').addClass('disabled');
        $('#btn_apply_group_edit').attr('disabled','disabled');
    }
  

}

function arraySelector2( indexParam, action) {

    if (indexParam == 'all') {
      
        for (var i = 0; i < addProducts_Array.length; i++) {
            // Set default state of all line items to selected
            if ((addProducts_Array[i].ItemVisible == "true" || addProducts_Array[i].ItemSelected == "true") && addProducts_Array[i].ItemDeleted == "false") {
                addProducts_Array[i].ItemSelected = "true";
            }
            else {
                addProducts_Array[i].ItemSelected = "false";
            }

        }



    }
    else if (indexParam == 'none') {
      
        for (var i = 0; i < addProducts_Array.length; i++) {
            // Set default state of all line items to unselected
            addProducts_Array[i].ItemSelected = "false";

        }


    }
    else {
      
        if (action == "select") {
            addProducts_Array[indexParam].ItemSelected = "true";
        }
        else {
            addProducts_Array[indexParam].ItemSelected = "false";
        }

    }

}

var accountDataRender = function (targetLine) {
    debugger;
    total = JSONobjectAccounts.length;
    statusApproved = 0;
    statusDenied = 0;
    statusRevising = 0;
    statusSubmitted = 0;
    statusTotal = 0;
    resetFilterCount("status");
    resetFilterCount("group");
    

    for (var i = 0; i < total; i++) {
        var v = i;
        if ((v + 1) % 2 == 0) {
            lineval = " even";
        }
        else {
            lineval = "";
        }

   
        if (JSONobjectAccounts[i].name.indexOf("\'") >= 0) {
            JSONobjectAccounts[i].name = replaceAll('\'', '`', JSONobjectAccounts[i].name);
        }

        var isVisible = JSONobjectAccounts[i].itemVisible;
        var isVisiblePotential = JSONobjectAccounts[i].itemVisiblePotential;

        var status = JSONobjectAccounts[i].status;
        if (status == "draft") {
            status = "revising";
        }


        if (JSONobjectAccounts[i].itemVisible == "true") {
            switch (status) {
                case 'approved':
                    statusApproved++;
                    statusTotal++;
                    break;
                case 'submitted':
                    statusSubmitted++;
                    statusTotal++;
                    break;
                case 'revising':
                    statusRevising++;
                    statusTotal++;
                    break;
                case 'draft':
                    statusRevising++;
                    statusTotal++;
                    status = "revising";
                    break;
                case 'denied':
                    statusDenied++;
                    statusTotal++;
                    break;
            }
            
        }
        addStatusFilter(status, isVisible, isVisiblePotential );
       
        addGroupFilter(JSONobjectAccounts[i].custGroup, isVisible, isVisiblePotential );

      
        accountsData += '<div onclick="on_m_li_click(this.id,\'' + targetLine + '\');" class="m_li container fluid' + lineval + '" id="accnt_line_' + i + '"';
        if (JSONobjectAccounts[i].itemVisible == "true")
        {
            accountsData += ' style="display:block"  >\n';
        }
        else
        {
            accountsData += ' style="display:none"  >\n';
        }
        accountsData += '<div class="container custom">\n';
        accountsData += '<div class="starter line col1">\n';
        accountsData += '<span class="status_icon ' + status + '"></span>\n';
        accountsData += '</div>\n';
        accountsData += '<div class="line col2">\n';
        accountsData += '<p>' + JSONobjectAccounts[i].number + '</p>\n';
        accountsData += '</div>\n';
        accountsData += '<div class="line col3">\n';
        accountsData += '<p>' + JSONobjectAccounts[i].name + '</p>\n';
        accountsData += '</div>\n';
        accountsData += '<div class="line col4">\n';
        accountsData += '<p>' + JSONobjectAccounts[i].custGroup + '</p>\n';
        accountsData += '</div>\n';
        accountsData += '<div class="line col5 ender">\n';
        accountsData += '<span class="currency">$</span>\n';
        accountsData += '<p>' + CommaFormatted(JSONobjectAccounts[i].sales,true) + '</p>\n';
        accountsData += '</div>\n';
        
        accountsData += '</div>\n';

        accountsData += '</div>\n';

    }
  
    return accountsData;

}


var accountCPLDataUpdateSingle = function (indexNumber) {


    if (accountCPL_Array.length > 0) {
     
            getPricePointItemSinglePhaseII(indexNumber,
                                G_pricePointItemsContext,
                                accountCPL_Array[indexNumber].SellingStyle,
                                accountCPL_Array[indexNumber].SellingSize,
                                accountCPL_Array[indexNumber].Back,
                                accountCPL_Array[indexNumber].Brand,
                                accountCPL_Array[indexNumber].ProductType,
                                accountCPL_Array[indexNumber].Region,
                                accountCPL_Array[indexNumber].OwningGroup,
                                G_customerNumber,
                                G_customerGroupNumber,
                                accountCPL_Array[indexNumber].StartDate,
                                accountCPL_Array[indexNumber].PRELOADROLL,
                                accountCPL_Array[indexNumber].EndDate
                                );
      
    }
}



var accountCPLDataUpdate = function (threadnumber) {
    try{
        if (accountCPL_ArrayIndex[threadnumber].indexCount <= accountCPL_ArrayIndex[threadnumber].indexMax) {
            if (accountCPL_Array[accountCPL_ArrayIndex[threadnumber].indexCount].SellingStyle == "P1J41") {
                var test = "";
            }
            var foundOne = false;
            while (foundOne == false && accountCPL_ArrayIndex[threadnumber].indexCount <= accountCPL_ArrayIndex[threadnumber].indexMax) {
                if (accountCPL_Array[accountCPL_ArrayIndex[threadnumber].indexCount].pricePointUpdateComplete == true) {
                    accountCPL_ArrayIndex[threadnumber].indexCount++;
                }
                else {
                    foundOne = true;
                }
            }

            if (foundOne == true) {
                
                getPricePointItemPhaseII(threadnumber, G_pricePointItemsContext, accountCPL_ArrayIndex[threadnumber].indexCount, accountCPL_Array[accountCPL_ArrayIndex[threadnumber].indexCount].SellingStyle,
                        accountCPL_Array[accountCPL_ArrayIndex[threadnumber].indexCount].SellingSize,
                        accountCPL_Array[accountCPL_ArrayIndex[threadnumber].indexCount].Back,
                        accountCPL_Array[accountCPL_ArrayIndex[threadnumber].indexCount].Brand,
                        accountCPL_Array[accountCPL_ArrayIndex[threadnumber].indexCount].ProductType,
                        accountCPL_Array[accountCPL_ArrayIndex[threadnumber].indexCount].Region,
                        accountCPL_Array[accountCPL_ArrayIndex[threadnumber].indexCount].OwningGroup,
                        G_customerNumber, //global parm
                        G_customerGroupNumber, //global parm
                        accountCPL_Array[accountCPL_ArrayIndex[threadnumber].indexCount].StartDate,
                        accountCPL_Array[accountCPL_ArrayIndex[threadnumber].indexCount].PRELOADROLL,
                        accountCPL_Array[accountCPL_ArrayIndex[threadnumber].indexCount].EndDate

                        );
            }
        }
        else
        {
            if (accountCPL_ArrayIndex[0].indexCount >= accountCPL_ArrayIndex[0].indexMax
                & 
                accountCPL_ArrayIndex[1].indexCount >= accountCPL_ArrayIndex[1].indexMax
                 &
                accountCPL_ArrayIndex[2].indexCount >= accountCPL_ArrayIndex[2].indexMax
                 &
                accountCPL_ArrayIndex[3].indexCount >= accountCPL_ArrayIndex[3].indexMax
                 &
                accountCPL_ArrayIndex[4].indexCount >= accountCPL_ArrayIndex[4].indexMax
                )
            {
 
                G_pricePointItemsComplete = "true";
                $("#pricelevelSpinner").css('display', 'none');
                $("#pricelevel").removeClass("disabled");
                $("#cpromoSpinner").css('display', 'none');
                $("#cpromo").removeClass("disabled");
            }
        }
    }
    catch (err)
    {

        G_pricePointItemsComplete = "true";
        $("#pricelevelSpinner").css('display', 'none');
        $("#pricelevel").removeClass("disabled");
        $("#cpromoSpinner").css('display', 'none');
        $("#cpromo").removeClass("disabled");
        logError(welcomeUserName, "accountCPLDataUpdate", err.message, err.stack, '');
    }

}


function getLineStatus(pMODOBJNUM, pREVOBJNUM, pCOPOBJNUM,pEndDate, pSystemDate, pVstate,pRollPriceAmount) {
   
    var EndOfTime = "12-31-9900";

    var endDate;
    var todayDate = new Date(Date.parse(pSystemDate));
    if (pEndDate == "EOT") {
        endDate = new Date(Date.parse(EndOfTime));
    }
    else
    {
        endDate = new Date(Date.parse(pEndDate));
    }

    if (JSONobjectAccounts[G_accounts_currentIndex].status == "approved") {
        if (pEndDate != "EOT") {
            return "newpromo";
        }
    }

    if ((pMODOBJNUM != 0 || pCOPOBJNUM != 0) && (pEndDate != "EOT")) {
        if (endDate <= todayDate) {
            return "expire";
        }
        else
        {
            return "newpromo";
        }
    }
   

    if (pREVOBJNUM != 0  ) {
       
      
        if (endDate <= todayDate)
        {
            return "expire";
        }
        else
        {
            return "edit";
        }
    }


    if ((pMODOBJNUM != 0 || pCOPOBJNUM != 0) && (pEndDate != "EOT")) {
        if (endDate <= todayDate) {
            return "expire";
        }
        else
        {
            return "newpromo";
        }
    }

    if ((pMODOBJNUM == 0 && pCOPOBJNUM == 0 && pREVOBJNUM == 0) && (pEndDate == "EOT") && (pVstate == "draft")) {
        //add
        if (pRollPriceAmount > 0) {
            return "add";
        }
        else {

            return "newadd";
        }
            
       
    }

    return "";

}

var getButtonStatus = function (pTheLineStatus, pButtonName,pVState) {
    //all buttons
    if(G_readOnly == true) {
        return "disabled";
    }

    if (JSONobjectAccounts[G_accounts_currentIndex].status == "submitted") {
        return "disabled";
    }
    if (G_groupEditType != "") {
        return "disabled";
    }

    //all buttons
    if (pVState == "approved") {
        return "enabled";
    }

    if (pButtonName == "edit") {
        if ((pTheLineStatus == "" || pTheLineStatus == "add" || pTheLineStatus == "newadd" || pTheLineStatus == "edit" || pTheLineStatus == "approved" || pTheLineStatus == "newpromo") & (JSONobjectAccounts[G_accounts_currentIndex].status != "submitted")) {
            return "enabled";
        }
        else
        {
            return "disabled";
        }
    }
    if (pButtonName == "promo") {
        if (((pVState == "draft" || pVState == "revising" || pVState == "denied" || pVState == "withdrawn") & (JSONobjectAccounts[G_accounts_currentIndex].status != "submitted")) || JSONobjectAccounts[G_accounts_currentIndex].status == "submitted") {
            return "disabled";
        }
        else
        {
            return "enabled";
        }
    }
    
    if (pButtonName == "expire") {
        if (((pVState == "draft" || pVState == "revising" || pVState == "denied" || pVState == "withdrawn") & (JSONobjectAccounts[G_accounts_currentIndex].status != "submitted")) || JSONobjectAccounts[G_accounts_currentIndex].status == "submitted") {
            return "disabled";
        }
        else
        {
            return "enabled";
        }
    }

    return "disabled";
}


var setButtonStatus = function (pIndex,pTheLineStatus,pVState ) {
   

    //edit
    var buttonStatus = getButtonStatus(pTheLineStatus,"edit", pVState)
    if(buttonStatus == "enabled"){
        $('#a_cpl_edit_' + pIndex).removeClass('disabled');
        $('#a_cpl_edit_' + pIndex).prop('disabled', false);
    }
    else {
        $('#a_cpl_edit_' + pIndex).addClass('disabled');
        $('#a_cpl_edit_' + pIndex).prop('disabled', true);
    }

    //promo
    buttonStatus = getButtonStatus(pTheLineStatus, "promo", pVState)
    if (buttonStatus == "enabled") {
        $('#a_cpl_editpromo_' + pIndex).removeClass('disabled');
        $('#a_cpl_editpromo_' + pIndex).prop('disabled', false);
    }
    else {
        $('#a_cpl_editpromo_' + pIndex).addClass('disabled');
        $('#a_cpl_editpromo_' + pIndex).prop('disabled', true);
    }

    //expire
    buttonStatus = getButtonStatus(pTheLineStatus, "expire", pVState)
    if (buttonStatus == "enabled") {
        $('#a_cpl_expire_' + pIndex).removeClass('disabled');
        $('#a_cpl_expire_' + pIndex).prop('disabled', false);
    }
    else {
        $('#a_cpl_expire_' + pIndex).addClass('disabled');
        $('#a_cpl_expiree_' + pIndex).prop('disabled', true);
    }



}

var setLineStatus = function (pIndex, pNewStatus) {
    
    var linestate = '';
    var statelabel = '';

    switch (pNewStatus) {
        case "edit":
            linestate = " li_edit";
            statelabel = 'Edit';
            break;
        case "expire":
            linestate = " li_expire";
            statelabel = 'Remove';
            break;
        case "add":
            linestate = " li_add";
            statelabel = 'Add';
            break;
        case "newadd":
            linestate = " li_add";
            statelabel = 'Add';
            break;
        case "newpromo":
            linestate = " li_promo";
            statelabel = 'Limited Time';
            break;
        case "approved":
            linestate = '';
            statelabel = '';
            break;

        default:
            linestate = '';
            statelabel = '';
    }
    $("#accpl_line_" + pIndex).removeClass("li_edit");
    $("#accpl_line_" + pIndex).removeClass("li_expire");
    $("#accpl_line_" + pIndex).removeClass("li_add");
    $("#accpl_line_" + pIndex).removeClass("li_promo");

    $("#accpl_line_" + pIndex).addClass(linestate);
    $("#editselect_" + pIndex).removeClass("seclect_icon");
    $("#editselect_" + pIndex).addClass(pNewStatus + "select_icon");

    $("#flag_info_" + pIndex).html(statelabel);
    //TESTING USING pIndex vs G_current_Index
    //setButtonStatus(pIndex, pNewStatus, accountCPL_Array[G_current_Index].VState);
    setButtonStatus(pIndex, pNewStatus, accountCPL_Array[pIndex].VState);
}





var accountCPLDataCompile = function () {
    totalItems = 0;
    isPromo = 0;
    isAutoTM3Promo = 0;
    isRollLoad = 0;
    isCutLoad = 0;
    var accountsData = '';
    var accountsDataList = '';
    resetFilterCount("theme");
    resetFilterCount("brand");
    resetFilterCount("promo");
    resetFilterCount("cpromo");
    resetFilterCount("autotm3");
    resetFilterCount("pricelevel");
    logEvent(welcomeUserName, "accountCPLDataCompile", "Begin");
    var visibleRecordCounter = 0;

    for (var i = 0; i < accountCPL_Array.length; i++) {
    }


}
var accountCPLDataRender2 = function () {

    $('.sort').removeClass('active');
    totalItems = 0;
    isPromo = 0;
    isAutoTM3Promo = 0;
    isRollLoad = 0;
    isCutLoad = 0;
    var accountsData = '';
    var accountsDataList = '';
    var visibleRecordCounter = 0;
    var firstRecord = -1;
    G_pagingCPLCurrentIndex = 0;
    G_groupEditItemSelectedCounter = 0;
    CPLpageArray = [];

    resetFilterCount("theme");
    resetFilterCount("brand");
    resetFilterCount("promo");
    resetFilterCount("cpromo");
    resetFilterCount("autotm3");
    resetFilterCount("pricelevel");

    $('#m_console_data').loadTemplate("#customerInformationTemplate", customerInfoObject);
}

var accountCPLDataRender = function () {

    $('.sort').removeClass('active');
     totalItems = 0;
     isPromo = 0;
     isAutoTM3Promo = 0;
     isRollLoad = 0;
     isCutLoad = 0;
     var accountsData = '';
     var accountsDataList = '';
     var visibleRecordCounter = 0;
     var firstRecord = -1;
     G_pagingCPLCurrentIndex = 0;
     G_groupEditItemSelectedCounter = 0;
     CPLpageArray = [];
   



     resetFilterCount("theme");
     resetFilterCount("brand");
     resetFilterCount("promo");
     resetFilterCount("cpromo");
     resetFilterCount("autotm3");
     resetFilterCount("pricelevel");

     //$('.select_icon').removeClass('active');

     logEvent(welcomeUserName, "accountCPLDataRender", "Begin");
     
     current_Line = -1;

    // $('.select_icon').removeClass('active');
    
     for (var i = 0; i < accountCPL_Array.length; i++)
     {
         var v = i;
         if ((v + 1) % 2 == 0) {
             lineval = " even";
         }
         else {
             lineval = "";
         }
        
         var status = accountCPL_Array[i].VState;
         var indicator = '';
         var cutload = '';
         var rollload = '';
         var revised = '';
         var status = '';
         var cadjust = '';
         var cpromo = false;
         //if (accountCPL_Array[i].SellingStyle.indexOf("7") >= 0) {
         //    //undo dave
         //    accountCPL_Array[i].pRoll = 2.22;
         //    accountCPL_Array[i].pCut = 1.23;
         //    accountCPL_Array[i].pStartDate = "1-19-2015";
         //    accountCPL_Array[i].pEndDate = "3-19-2015";
 
         //}
        
         accountCPL_Array[i].LineStatus = getLineStatus(accountCPL_Array[i].MODOBJNUM, accountCPL_Array[i].REVOBJNUM, accountCPL_Array[i].COPOBJNUM, accountCPL_Array[i].EndDate, G_SystemDate, accountCPL_Array[i].VState, accountCPL_Array[i].ProposedRollPriceVAmountAmount);
        
         status = accountCPL_Array[i].LineStatus;

         

         var linestate = '';
         var selector = '';
         var statelabel = '';

         accountsData = '';


         var isVisible = accountCPL_Array[i].ItemVisible;
         var isVisiblePotential = accountCPL_Array[i].ItemVisiblePotential;

         if (current_Line == -1 && isVisible == "true") {
             current_Line = i;
         }

         if (accountCPL_Array[i].ItemSelected == "true") {
             selector = ' active';
             G_groupEditItemSelectedCounter += 1;
            // linestate = ' li_add';
            // totalSelectedProducts++;
         }

        
       
             if (accountCPL_Array[i].VState == "draft" || accountCPL_Array[i].VState == "revising" || accountCPL_Array[i].VState == "submitted" || accountCPL_Array[i].VState == "denied") {
                 switch (status) {
                     case "edit":
                         linestate = " li_edit";
                         statelabel = 'Edit';
                         break;
                     case "expire":
                         linestate = " li_expire";
                         statelabel = 'Remove';
                         break;
                     case "add":
                         linestate = " li_add";
                         statelabel = 'Add';
                         break;
                     case "newadd":
                         linestate = " li_add";
                         statelabel = 'Add';
                         break;
                     case "newpromo":
                         linestate = " li_promo";
                         statelabel = 'Limited Time';
                         break;
                     case "approved":
                         linestate = '';
                         statelabel = '';
                         break;

                     default:
                         linestate = '';
                         statelabel = '';
                 }
             }
         

         if (accountCPL_Array[i].CutLoad > 0) {
             cutload = " loaded";
         }
         if (accountCPL_Array[i].RollLoad > 0) {
             rollload = " loaded";
            
         }
         else
         {
             accountCPL_Array[i].PRELOADROLL = accountCPL_Array[i].ProposedRollPriceVAmountAmount;
             accountCPL_Array[i].PRELOADCUT = accountCPL_Array[i].ProposedCutPriceVAmountAmount;
         }

         //look for corporate promo here
         if (accountCPL_Array[i].pRoll > 0 || accountCPL_Array[i].pCut > 0) {
             cadjust = " indicator_top";
             cpromo = true;
             addCPLCategoryFilter("cpromo", "Yes", isVisible, isVisiblePotential);
         }
         else
         {
             addCPLCategoryFilter("cpromo", "No", isVisible, isVisiblePotential);
         }

         if (accountCPL_Array[i].ItemVisible == "true") {
             totalItems++;
         }

         if (status == "newpromo") {
             if (accountCPL_Array[i].ItemVisible == "true") {
                 isPromo++;
             }
           
             addCPLCategoryFilter("promo", "Yes", isVisible,isVisiblePotential);
           
             indicator = ' promo';
         }
         else
         {
             addCPLCategoryFilter("promo", "No", isVisible, isVisiblePotential);
         }



         if (accountCPL_Array[i].IsAutoTM3Promo == "T") {
          
             if (accountCPL_Array[i].ItemVisible == "true") {
                 isAutoTM3Promo++;
             }
             addCPLCategoryFilter("autotm3", "Yes", isVisible,isVisiblePotential);
             indicator = ' autoTM3';

         }
         else
         {
            
             addCPLCategoryFilter("autotm3", "No", isVisible, isVisiblePotential);
         }

         
         //if (G_groupEditType != "" && accountCPL_Array[i].ItemSelected == "true") {

         //    if (G_groupEditType == "edit") {
         //        linestate = " li_edit";
         //    }
         //    if (G_groupEditType == "expire") {
         //        linestate = " li_expire";
         //    }
         //    if (G_groupEditType == "newpromo") {
         //        linestate = " li_promo";
         //    }

         //}

         accountsData += '<div class="m_li container fluid' + lineval + linestate + '" id="accpl_line_' + i + '"';
         if (accountCPL_Array[i].ItemVisible == "true")
         {
             accountsData += ' style="display:block"  >\n';
 
         }
         else
         {
             accountsData += ' style="display:none"  >\n';
         }

         accountsData += '<div class="container custom">\n';
         accountsData += '<div class="starter line col1" id="editselectrow_' + i + '" >\n';
       
        
             accountsData += '<div class="state_flag"><span class="flaginfo" id="flag_info_' + i + '" >' + statelabel + '</span></div>\n';

         //selector radio button
         if (G_groupEditType != "") {
             accountsData += '<span class="' + G_groupEditType + 'select_icon ' + selector + '" id="editselect_' + i + '" ></span>\n'
         }
        
         accountsData += '<div id="cpl_indicator_' + i + '" class="cpl_indicator' + indicator + cadjust + '" ></div>\n';
        
         accountsData += '<div id="cpromo_indicator_' + i + '" class="cpl_indicator cpromo indicator_bottom" ';
         
         if (cpromo == true) {
             accountsData += ' style="display:block" ';

         }
         else {
             accountsData += ' style="display:none" ';
         }
         accountsData += ' ></div>\n';

         accountsData += '</div>\n';

         accountsData += '<div onclick="on_m_li_target_click(this.id);" class="m_li_target" id="m_li_target_' + i + '"   >\n';

         accountsData += '<div class="line col2">\n';
         accountsData += '<p>' + accountCPL_Array[i].SellingStyle + '</p>\n';
         accountsData += '</div>\n';

         accountsData += '<div class="line col3">\n';
         accountsData += '<p>' + accountCPL_Array[i].StyleName + '</p>\n';
         accountsData += '</div>\n';

         accountsData += '<div class="line col4">\n';
         accountsData += '<p>' + accountCPL_Array[i].SellingSize + '</p>\n';
         accountsData += '</div>\n';

         accountsData += '<div class="line col5">\n';
         accountsData += '<p>' + accountCPL_Array[i].Brand + '</p>\n';
         addCPLCategoryFilter("brand", accountCPL_Array[i].Brand, isVisible, isVisiblePotential);
         accountsData += '</div>\n';


         accountsData += '<div class="line col6">\n';
         accountsData += '<span class="currency">$</span>\n';
         accountsData += '<p id="proposedRollAmount_' + i + '" ><span id="proposedRollAmountAmount_' + i + '" ';
         if (status == "newadd") {
             accountsData += ' style="font-style: italic;" ' ;
         }
         accountsData += '>';
         if (status == "newadd") {
             accountsData += CurrencyFormatted(accountCPL_Array[i].TM1Roll);
            
         }
         else {
             accountsData += CurrencyFormatted(accountCPL_Array[i].ProposedRollPriceVAmountAmount);
         }

         accountsData += '</span><span id="cutLoadIndicator_' + i + '" class="load_indicator' + rollload + '"></span></p>\n';
         accountsData += '</div>\n';

         accountsData += '<div class="line col7">\n';
         if (accountCPL_Array[i].CUTPRICEALLOWED != 'N') {
             accountsData += '<span class="currency">$</span>\n';
             accountsData += '<p  id="proposedCutAmount_' + i + '" ><span id="proposedCutAmountAmount_' + i + '" ';
             if (status == "newadd") {
                 accountsData += ' style="font-style: italic;" ' ;
             }
             accountsData += '>';

             if (status == "newadd") {
                 accountsData += CurrencyFormatted(accountCPL_Array[i].TM1Cut);

             }
             else {
                 accountsData += CurrencyFormatted(accountCPL_Array[i].ProposedCutPriceVAmountAmount);
             }

             accountsData += '</span><span id="rollLoadIndicator_' + i + '" class="load_indicator' + cutload + '"></span></p>\n';
         }
            
         
         accountsData += '</div>\n';

         accountsData += '<div class="line col8">\n';



         if (accountCPL_Array[i].VState != "approved" & accountCPL_Array[i].CutLoad > 0) {
             accountsData += '<p id="PriceLevel_' + i + '"></p>\n';
         }
         else {
            
             if(accountCPL_Array[i].pricePointUpdateComplete == true) { 
                 if (status == "add" ) {
                     accountsData += '<p id="PriceLevel_' + i + '"></p>\n';
                 }
                 else
                 {
                     
                         accountsData += '<p id="PriceLevel_' + i + '"  ';
                         if (status == "newadd") {
                             accountsData += ' style="font-style: italic;" ';
                         }
                         accountsData += '>';
                         accountsData +=  accountCPL_Array[i].PriceLevel;
                         accountsData +=   '</p>\n';
  
                 }

             }
             else
             {
                
                 accountsData += '<p id="PriceLevel_' + i + '"  ';
                 if (status == "newadd") {
                     accountsData += ' style="font-style: italic;" '
                 }
                 accountsData += '>-----</p>\n';
                
             }
         }
       
         addCPLCategoryFilter("pricelevel", accountCPL_Array[i].PriceLevel, isVisible, isVisiblePotential);
         accountsData += '</div>\n';

         accountsData += '<div class="line col9 ender">\n';
         accountsData += '<span class="currency">$</span>';
         accountsData += '<p>' + numberWithCommas(accountCPL_Array[i].MonthsSales) + '</p>\n';
         accountsData += '</div>\n';

         accountsData += '</div>\n';
         accountsData += '</div>\n';


        accountsData += '</div>\n';


         // LINE ITEM DROP DOWN: BEGIN
        accountsData += '<div class="calpanel container fluid" id="calpanel_' + i + '">\n';
         // Add corporate promo here
       
        accountsData += '<div id="cPromoDiv_' + i + '" ';
            if (cpromo == false) 
            {
                accountsData += ' class=" container fluid" style="display:none"  >\n';
            }
            else
            {
                accountsData += ' class="li_cpromo container fluid" style="display:block"  >\n';
            }
        
            //accountsData += '>\n';
            accountsData += '<div class="container custom">';
            accountsData += '<div class="starter line col1">';
            accountsData += '<span class="flaginfo">Corp<br /> Promo</span>';
            accountsData += '</div>';
            accountsData += '<div class="line col2_5">';
            accountsData += '<div class="cpl_dates">';
            accountsData += '<p><span class="dater">Start Date: <span class="start_date"  id="pStartDate_' + i + '" >' + accountCPL_Array[i].pStartDate + '</span></span> <span class="dater">End Date: <span class="end_date"  id="pEndDate_' + i + '" >' + accountCPL_Array[i].pEndDate + '</span></span></p>';
            accountsData += '</div>';
            accountsData += '</div>';
            accountsData += '<div class="line col6">';
            accountsData += '<span class="currency">$</span>';
            accountsData += '<p id="pRoll_' + i + '">' + CurrencyFormatted(accountCPL_Array[i].pRoll) + '</p>';
            accountsData += '</div>';
            accountsData += '<div class="line col7">';
            accountsData += '<span class="currency">$</span>';
            accountsData += '<p  id="pCut_' + i + '" >' + CurrencyFormatted(accountCPL_Array[i].pCut) + '</p>';
            accountsData += '</div>';
            accountsData += '<div class="line col8">';
            accountsData += '<p id="pPriceLevel_' + i + '"  >';
            accountsData += accountCPL_Array[i].pPriceLevel;
            accountsData += '</p>\n';
            accountsData += '<img src="Content/images/ui/blank.gif" height="1" width="1">';
            accountsData += '</div>';
            accountsData += '<div class="line col9 ender active">';
            accountsData += '<img src="Content/images/ui/blank.gif" height="1" width="1">';
            accountsData += '</div>';
            accountsData += '<div class="clear"></div>';
            accountsData += '</div>';

            accountsData += '</div>\n';
        




         accountsData += '<div class="container custom">\n';
         accountsData += '<div class="p_data">\n';
         accountsData += '<div class="starter line col1">\n';
         accountsData += '<img src="' + G_AbsoluteUri + 'Content/images/ui/blank.gif" width="1" height="1" /> \n';
         accountsData += '</div>\n';
         accountsData += '<div class="line col2_5">\n';
         accountsData += '<div class="cpl_dates">\n';
         accountsData += '<p><span class="dater">Start Date: <span class="start_date" id="start_date_' + i + '">' + accountCPL_Array[i].StartDate + '</span></span> <span class="dater">End Date: <span class="end_date" id="end_date_' + i + '">' + accountCPL_Array[i].EndDate + '</span></span></p>\n';
         accountsData += '</div>\n';
         accountsData += '<div class="cpl_info">\n';
         accountsData += '<p><span class="info_label">Standard Roll Size:</span> <span class="info_data" id="rollsize_' + i + '"> ' + accountCPL_Array[i].StandardRollSize + '</span><span>&prime;</span></p>\n';
         if (accountCPL_Array[i].CUTPRICEALLOWED != 'N') {
             accountsData += '<p><span class="info_label">Cut Premium:</span> <span class="info_data" id="cutprem_' + i + '">$' + CurrencyFormatted(accountCPL_Array[i].CutPremium) + '</span></p>\n';
         }

         accountsData += '<p><span class="info_label">Roll Length:</span> <span class="info_data" id="cutsroll_' + i + '">' + '' + '</span></p>\n';
         accountsData += '<p><span class="info_label">Theme Display:</span> <span class="info_data" id="theme_' + i + '">' + accountCPL_Array[i].ThemeDisplay + '</span></p>\n';
        
         addCPLCategoryFilter("theme", accountCPL_Array[i].ThemeDisplay, isVisible, isVisiblePotential);
         accountsData += '</div>\n';
         accountsData += '</div>\n';
         accountsData += '<div class="line col6">\n';

         if (accountCPL_Array[i].RollLoad > 0 & accountCPL_Array[i].VState == "approved") {
             accountsData += '<div class="cpl_load">\n';
             accountsData += '<span class="currency">$</span>\n';
             accountsData += '<p>' + CurrencyFormatted(accountCPL_Array[i].PRELOADROLL) + '</p>\n';
             accountsData += '<div class="loadtxt">(+' + numberForDisplay( accountCPL_Array[i].RollLoad.toString().replace(/^0+/, '')) + ')</div>\n';
             accountsData += '</div>\n';

         }

         else
         {
             if (status == "newadd")
             {
                 accountsData += '<div class="cpl_load">\n';
                 accountsData += '<span class="currency"></span>\n';
                 accountsData += '<p></p>\n';
                 accountsData += '<div id="load_text_' + i + '" class="noshowload">+ Applicable loads may apply</div>\n';
                 //accountsData += '<div id="load_text_' + i + '" class="loadtxt">+ Applicable loads may apply</div>\n';
                 accountsData += '</div>\n';
            }
            else
             {
                 accountsData += '<div class="cpl_noload">\n';
                 accountsData += '<span class="currency"></span>\n';
                 accountsData += '<p></p>\n';
                 accountsData += '<div  id="load_text_' + i + '" class="loadtxt"></div>\n';
                 accountsData += '</div>\n';
            }

         }


         accountsData += '<div class="cpl_TM1">\n';
         accountsData += '<span class="currency">$</span>\n';
         accountsData += '<p id="TM1Roll_' + i + '" >' + CurrencyFormatted(accountCPL_Array[i].TM1Roll) + '</p>\n'; //TM1
         accountsData += '</div>\n';

         accountsData += '<div class="cpl_TM2">\n';
         accountsData += '<span class="currency">$</span>\n';
         accountsData += '<p  id="TM2Roll_' + i + '" >' + CurrencyFormatted(accountCPL_Array[i].TM2Roll) + '</p>\n';//TM2
         accountsData += '</div>\n';

         accountsData += '<div class="cpl_TM3">\n';
         accountsData += '<span class="currency">$</span>\n';
         accountsData += '<p  id="TM3Roll_' + i + '" >' + CurrencyFormatted(accountCPL_Array[i].TM3Roll) + '</p>\n'; //TM3
         accountsData += '</div>\n';

         accountsData += '</div>\n';

         accountsData += '<div class="line col7" >\n'; //column 7

         if (accountCPL_Array[i].CutLoad > 0 & accountCPL_Array[i].VState == "approved") {
             accountsData += '<div class="cpl_load">\n';
             accountsData += '<span class="currency">$</span>\n';
             accountsData += '<p>' + CurrencyFormatted(accountCPL_Array[i].PRELOADCUT) + '</p>\n';
             accountsData += '<span class="loadtxt">(+' + numberForDisplay(accountCPL_Array[i].CutLoad.toString().replace(/^0+/, '')) + ')</span>\n';
             accountsData += '</div>\n';

         }
         else {
             if (status == "newadd")
             {
             //if (accountCPL_Array[i].ProposedCutPriceVAmountAmount == 0 && accountCPL_Array[i].VState == "draft") {
                 accountsData += '<div class="cpl_load">\n';
                 accountsData += '<span class="currency"></span>\n';
                 accountsData += '<p></p>\n';
                 accountsData += '<div class="noshowload"></div>\n';
                 accountsData += '</div>\n';
             }
             else {
                 accountsData += '<div class="cpl_noload">\n';
                 accountsData += '<span class="currency"></span>\n';
                 accountsData += '<p></p>\n';
                 accountsData += '<div class="loadtxt"></div>\n';
                 accountsData += '</div>\n';
             }

         }

         accountsData += '<div class="cpl_TM1">\n';
         accountsData += '<span class="currency">$</span>\n';
         accountsData += '<p id="TM1Cut_' + i + '" >' + CurrencyFormatted(accountCPL_Array[i].TM1Cut) + '</p>\n';
         accountsData += '</div>\n';
         accountsData += '<div class="cpl_TM2">\n';
         accountsData += '<span class="currency">$</span>\n';
         accountsData += '<p id="TM2Cut_' + i + '" >' + CurrencyFormatted(accountCPL_Array[i].TM2Cut) + '</p>\n';
         accountsData += '</div>\n';
         accountsData += '<div class="cpl_TM3">\n';
         accountsData += '<span class="currency">$</span>\n';
         accountsData += '<p id="TM3Cut_' + i + '" >' + CurrencyFormatted(accountCPL_Array[i].TM3Cut) + '</p>\n';
         accountsData += '</div>\n';
         accountsData += '</div>\n';


         accountsData += '<div class="line col8">\n'; //column 8
         if (accountCPL_Array[i].RollLoad > 0 & accountCPL_Array[i].VState == "approved") {
             accountsData += '<div class="cpl_load">\n';
         }
         else {
             
             if (status == "newadd") {
                 accountsData += '<div class="cpl_load">\n';
             }
             else {
                 accountsData += '<div class="cpl_noload">\n';
             }

         }
         accountsData += '<img src="' + G_AbsoluteUri + 'Content/images/ui/blank.gif" width="1" height="1" />\n';
         accountsData += '</div>\n';
        
         accountsData += '<div class="cpl_TM1">\n';
         accountsData += '<p>TM1</p>\n';
         accountsData += '</div>\n';
         accountsData += '<div class="cpl_TM2">\n';
         accountsData += '<p>TM2</p>\n';
         accountsData += '</div>\n';
         accountsData += '<div class="cpl_TM3">\n';
         accountsData += '<p>TM3</p>\n';
         accountsData += '</div>\n';
         accountsData += '</div>\n';

         accountsData += '<div class="line col9 ender active">\n';
         accountsData += '<div class="cpl_editbtns">\n';
         accountsData += '<a id="a_cpl_edit_' + i + '" ';

         var buttonStatus = getButtonStatus(status, "edit", accountCPL_Array[i].VState);
        
         if (buttonStatus == "disabled")  {
             accountsData += '  disabled class="btn disabled"  ';
         }
         else {
             accountsData += ' class="btn"  ';
         }
         accountsData += '  href="javascript:goModal(\'#accountCPL_editprice\'); passCalculatorValues(' + accountCPL_Array[i].ProposedRollPriceVAmountAmount + ', ' + accountCPL_Array[i].ProposedCutPriceVAmountAmount + ', ' + accountCPL_Array[i].RollLoad + ',false, ' + i + ',' + accountCPL_Array[i].PRELOADROLL + ',' + accountCPL_Array[i].PRELOADCUT + ');" class="btn">Edit <br /><span class="min">Current Price</span></a>\n';
   

         accountsData += '<a id="a_cpl_editpromo_' + i + '" ';
         buttonStatus = getButtonStatus(status, "promo", accountCPL_Array[i].VState);

         if (buttonStatus == "disabled" ) {
             accountsData += '  disabled class="btn disabled"  ';
         }
         else {
             accountsData += ' class="btn"  ';
         }
         accountsData += ' href="javascript:goModal(\'#date_setter\');   queueCalculatorValues(' + accountCPL_Array[i].ProposedRollPriceVAmountAmount + ', ' + accountCPL_Array[i].ProposedCutPriceVAmountAmount + ', ' + accountCPL_Array[i].RollLoad + ',true , ' + i + ',' + accountCPL_Array[i].PRELOADROLL + ',' + accountCPL_Array[i].PRELOADCUT + ');" class="btn">Create<br /><span class="min">Limited Time Price</span></a>\n';

         accountsData += '<a id="a_cpl_expire_' + i + '" ';
         buttonStatus = getButtonStatus(status, "expire", accountCPL_Array[i].VState);

         if (buttonStatus == "disabled" ) {
             accountsData += '  disabled class="btn disabled"  ';
         }
         else {
             accountsData += ' class="btn"  ';
         }
         accountsData += ' href="javascript:goModal(\'#accountCPL_expireprice\');setLineIndex(\'' + i + '\');"  >Remove <br /><span class="min">Current Price</span></a>\n';

         accountsData += '</div>\n';
         accountsData += '</div>\n';
         accountsData += '<div class="clear"></div>\n';
         accountsData += '</div>\n';
         accountsData += '</div>\n';
         accountsData += '</div>\n';

        
         if (isVisible == "true")
         {
            
             visibleRecordCounter += 1;

             
            if (firstRecord == -1) {
                firstRecord = i;
            }
            if (visibleRecordCounter >= G_pagingCPLMaxSize) {
                //show spinner
                accountsData += '<div id="endPage_' + (CPLpageArray.length ) + '" style="text-align:center;">\n';
                accountsData += '<i class="fa fa-refresh fa-spin fa-2x"></i><i class="fa  fa-2x">&nbsp;Working...</i>';
                accountsData += '</div>\n';
                accountsDataList += accountsData;
                CPLpageArray.push({ "firstRow": firstRecord, "lastRow": i, "pageContent": accountsDataList });
                accountsDataList = "";
                visibleRecordCounter = 0;
                firstRecord = -1;

            }
            else
            {
                accountsDataList += accountsData;
            }
        }
    }
     accountsData = "";
     if (accountsDataList != "") {
         CPLpageArray.push({ "firstRow": firstRecord, "lastRow": (i - 1), "pageContent": accountsDataList });
     }
     else
     {
         if (CPLpageArray.length <= 0)
         {
         CPLpageArray.push({ "firstRow": -1, "lastRow": -1, "pageContent": "" });
        }
     }
    logEvent(welcomeUserName, "accountCPLDataRender", "End");

     return CPLpageArray[0].pageContent;

}


var addProductsDataRender = function (total) {
    var linestate = "";
   
    if (typeof addProducts_Array[0] !== 'undefined' && addProducts_Array[0] !== null) {

        resetFilterCount("producttheme");
        totalAddProducts = 0;
        totalSelectedProducts = 0;
        accountsData = '';

        $('.addselect_icon').removeClass('active');
        $('#addthese').addClass('disabled');
        $("[id^='addpr_line_']").removeClass('li_add');

        accountsData += '<div class="window load_alert" id="data_loading_accountCPL">\n';
        accountsData += '<div class="center_element">\n';
        accountsData += '<img src="' + G_AbsoluteUri + 'Content/images/ui/loading_screen_ani.gif" width="46" height="45" />\n';
        accountsData += '</div>\n';
        accountsData += '</div>\n';

        var lineval = "";
        var linestate = "";

        for (var i = 0; i < addProducts_Array.length; i++) {
          
            var v = i;
            linestate = "";
            var isVisible = addProducts_Array[i].ItemVisible;
            var isVisiblePotential = addProducts_Array[i].ItemVisiblePotential;

           
            if (addProducts_Array[i].ItemDeleted == "false" && addProducts_Array[i].ItemVisible == "true") {
                addCPLCategoryFilter("producttheme", addProducts_Array[i].ThemeDisplay, isVisible, isVisiblePotential);
                totalAddProducts++;
                if ((v + 1) % 2 == 0) {
                    lineval = " even";
                }
                else {
                    lineval = "";
                }

                var selector = '';
                if (addProducts_Array[i].ItemSelected == "true") {
                    selector = ' active';
                    linestate = ' li_add';
                    totalSelectedProducts++;
                }

                accountsData += '<div class="m_li container fluid ' + linestate + '" id="addpr_line_' + (i ) + '">\n';
                accountsData += '<div class="container custom">\n';

                accountsData += '<div class="starter line col1"  id="addselectrow_' + i + '" >\n';
                accountsData += '<span class="addselect_icon' + selector + '" id="addselect_' + i + '" ></span>\n';
                accountsData += '</div>\n';

                accountsData += '<div class="line col2">\n';
                accountsData += '<p>' + addProducts_Array[i].SellingStyle + '</p>\n';
                accountsData += '</div>\n';

                accountsData += '<div class="line col3">\n';
                accountsData += '<p>' + addProducts_Array[i].StyleName + '</p>\n';
                accountsData += '</div>\n';

             
                accountsData += '<div class="line col4">\n';
                accountsData += '<p>' + addProducts_Array[i].ThemeDisplay + '</p>\n';
                accountsData += '</div>\n';

                accountsData += '<div class="line col5">\n';
                accountsData += '<p>' + addProducts_Array[i].Back + '</p>\n';
                accountsData += '</div>\n';

                accountsData += '<div class="line col6">\n';
                accountsData += '<p>' + addProducts_Array[i].Brand + '</p>\n';
                accountsData += '</div>\n';

                accountsData += '<div class="line col7">\n';
                accountsData += '<p>' + addProducts_Array[i].SellingSize + '</p>\n';
                accountsData += '</div>\n';

                accountsData += '</div>\n';
                accountsData += '</div>\n';

            }

        }

        // Optional spacer
        accountsData += '<div id="cpanel_expander"></div>\n';
        $('#addselect_total').html(totalSelectedProducts);

        if (totalSelectedProducts <= 0) {
            $('#addthese').addClass('disabled');
            $('#addselect_total').addClass('li_add');
        }
        else {
            $('#addthese').removeClass('disabled');
            $('#addselect_total').removeClass('li_add');
        }

        activeProcessing = false;
        return accountsData;

    }
    else {
        accountData = '';
    }

    activeProcessing = false;
    return accountsData;





}


var numberForDisplay = function (floater) {
    var n = floater.toString();
    // Remove zero prior to decimal
    n = n.replace(/^0/, '');
    return n;

}


var sectionLoader = function (appstate) {
    debugger;
    logEvent(welcomeUserName, "sectionLoader", "Start");
    $('.section').css({ 'opacity': 0, 'display': 'none' });

    switch (appstate) {

        case 'opes':
            //sortColumn(G_opeAccounts_column_id, appstate, G_opeAccounts_order, G_opeAccounts_targetColumn);
            $('.m_rule_alt').addClass('m_rule').removeClass('m_rule_alt');
            $('.masthead').find('.downsize').html('<span class="rline">|</span> <b>ORDER PRICE EXCEPTIONS</b>');
            var loadSection = "#" + appstate;            
            //$('#opes').css('opacity', 1);
            //$(loadSection).css({ 'opacity': 1, 'display': 'block' });            
            $(loadSection).css('opacity', 1);
            $(loadSection).fadeIn(300, function () {
                getConsoleMessage(appstate);
            });
            break;
        case 'ope':
            //console.log('Set view to single OPE.');
            $('#ope').css('opacity', 1);
            $('#ope').fadeIn(300, function () {
                getConsoleMessage('ope');
            });
            break;
        case 'accounts':
            sortColumn(G_accounts_column_id, appstate, G_accounts_order, G_accounts_targetColumn);
            var loadSection = "#" + appstate;

            $(loadSection).css({ 'opacity': 1, 'display': 'block' });
            loadControlPanel(appstate);

            break;
        case 'accountCPL':
            sortColumn(G_items_column_id, appstate, G_items_order, G_items_targetColumn);
            var loadSection = "#" + appstate; 
            setCPLItemCount(G_accounts_currentIndex);
            if (G_groupEditType == "") {
                $("#master_select").css('visibility', 'hidden');
                $('#accountCPL_back').css('visibility', 'visible');
                setCPLItemCount(G_accounts_currentIndex);
            }
            else {

                $("#master_select").css('visibility', 'visible');
                setGroupEditItemCount(G_accounts_currentIndex);
            }
            $(loadSection).css({ 'opacity': 1, 'display': 'block' });
            break;
        case 'addProducts':

            if (current_Column == '') {
                sortColumn('ThemeDisplay', appstate, 'ASC', 'col4');
            }
            else {
                sortColumn(current_Column, appstate, current_Order, current_ColumnTarget);
            }

            var loadSection = "#" + appstate;
            $(loadSection).css({ 'opacity': 1, 'display': 'block' });
            loadControlPanel(appstate);

            break;

        case 'emailCPL':

            var loadSection = "#" + appstate;
            $(loadSection).css({ 'opacity': 1, 'display': 'block' });
            //loadControlPanel(appstate);
            break;

        default:
            sortColumn('sales', appstate, 'DESC', 'col5');
            var loadSection = "#" + appstate;
            $(loadSection).css({ 'opacity': 1, 'display': 'block' });
            loadControlPanel(appstate);
    }
    logEvent(welcomeUserName, "sectionLoader", "End");
}

var loadControlPanel = function (appstate) {

    switch (appstate) {
        case 'accounts':
            statusData = '';
            statusData += '<h3><span id="m_total">(' + statusTotal + ')</span> Total</h3>\n';
            statusData += '<div class="staus_widget">Approved <span id="approved_count">(' + statusApproved + ')</span></div>\n';
            statusData += '<div class="staus_widget"><span class="status_icon revising"></span>Revising <span id="revising_count">(' + statusRevising + ')</span></div>\n';
            statusData += '<div class="staus_widget"><span class="status_icon submitted"></span>Submitted <span id="submitted_count">(' + statusSubmitted + ')</span></div>\n';
            statusData += '<div class="staus_widget"><span class="status_icon denied"></span>Denied <span id="denied_count">' + statusDenied + '</span></div>\n';
            controlData = '';
            break;
        case 'accountCPL':
            statusData = '';
            statusData += '<h3><span id="m_total">321</span> Total</h3>\n';
            statusData += '<div class="staus_widget"><span class="cpli_icon promo"></span>Limited Time <!--<span id="promo_count">(189)</span>--></div>\n';
            statusData += '<div class="staus_widget"><span class="cpli_icon autoTM"></span>Auto TM <!--<span id="promo_autoTM">(204)</span>--></div>\n';
            statusData += '<div class="staus_widget"><span class="cpli_icon cpromp"></span>Corp Promo <!--<span id="promo_autoTM">(204)</span>--></div>\n';
            statusData += '<div class="staus_widget"><span class="cpli_icon loaded"></span>Price Loads <!--<span id="promo_loaded">(83)</span>--></div>\n';

            controlData = '';
            controlData += '<a href="javascript:goModal(\'#accountCPL_addproducts\');" id="btn_add_products" class="btn">Add New Products</a>\n';
            controlData += '<a href="javascript:emailCPL();" id="email_cpl" class="btn">Email Dealer CPL</a>\n';
            controlData += '<a href="javascript:goModal(\'#accountCPL_groupedit\');" id="group_edit" class="btn">Group Edit Price</a>\n';
            controlData += '<a href="#" id="btn_submit_pricing" class="btn">Submit Pricing</a>\n';

            break;
        case 'addProducts':
            statusData = '';
            controlData = '';
            statusData += '<h3><span id="add_total">' + totalAddProducts + '</span> Total  |  <span id="addselect_total">' + totalSelectedProducts + '</span> Selected to Add</h3>\n';
            controlData =   '<a href="javascript:addThese(\'addProducts\');" id="addthese" class="btn ';
            if (totalSelectedProducts <= 0) {
                controlData += ' disabled';
            }
            else {
                controlData += ' li_add '
            }
            controlData += '" >Add Products To Price List</a>\n';
         
            break;
        default:
            statusData = '';
            statusData += '<h3><span id="m_total">83</span> Total</h3>\n';
            statusData += '<div class="staus_widget">Approved <span id="approved_count">(76)</span></div>\n';
            statusData += '<div class="staus_widget"><span class="status_icon revising"></span>Revising <span id="revising_count">(2)</span></div>\n';
            statusData += '<div class="staus_widget"><span class="status_icon submitted"></span>Submitted <span id="submitted_count">(5)</span></div>\n';
            statusData += '<div class="staus_widget"><span class="status_icon denied"></span>Denied <span id="denied_count"></span></div>\n';

            controlData = '';

    }

    $('.status_bar').html(statusData);
    $('.controls2').html(controlData);

}


var applyFilters = function (target) {
    
    // Fade out Modal Window
    $('#mask, #mask2').fadeOut(600);
    $('.window').fadeOut(100);
    accountsFilter();
}




var addProducts = function (target) {

        current_Column = '';
        // Reset sort active on all sort classes
        $('.sort').removeClass('active');
        var msg = target;
        appstate = target;
        getAvailProducts(welcomeUserName.toUpperCase(), welcomePassword, G_customerNumber, G_customerGroupNumber,welcomeUserNameAs.toUpperCase());
        closeModal();

}

var clearProducts = function () {

    clearFilters('addProducts');
    productsFilter();

}

var addProductstoCPL = function (confirm) {

    var proceedAdding = function () {

     
        // Save selected products into current accountCPL_Array
        // Get indexes of each selected product
        var addlistArray = [];
        var addlist = '';
        var total2Add = $(".addselect_icon.active").length;

        arraySelector2( 'none', 'deselect');

        // Traverse DOM and save the style number of each Product CPL into array
        $(".addselect_icon.active").each(function (index) {
           
            var id = $(this).parent().parent().parent().attr('id');
           
            var id_o = id.substring(id.lastIndexOf("_") ); // Everything after "_"
           
            var idString = $('#addpr_line_' + id_o).children().children('.col2').children('p').html();

            addlist += idString;

            if (index == ($(".addselect_icon.active").length - 1)) {
                addlist += '.';
            }
            else {
                addlist += ',  ';
            }


            // Save the items into array
            var tempArray = addProducts_Array.slice(0);
           
            var targetIndex = (parseInt(id_o) - 1);
           
            // Remove all elements from array except the target element
            tempArray.splice(0, targetIndex); // Elements before
            tempArray.splice(1, tempArray.length - 1); // Elements after

            tempArray = JSON.parse(JSON.stringify(tempArray));
            tempArray[0].status = "add";
    
            addlistArray.push(tempArray[0]);

        });


        alert('The following products will be added to the CPL: ' + addlist);

        // Merge addlistArray with accountCPL_Array
        var tempArray2 = addlistArray.concat(accountCPL_Array);
        accountCPL_Array = tempArray2;


        // Clear existing addProducts_Array
        $('#addthese').addClass('disabled');
        totalSelectedProducts = 0;
        // Deselect all in array
        arraySelector2( 'none', 'deselect');

        // Increase total by number of Products added
        totalAccountCPL = accountCPL_Array.length;
       
        // Return to CPL with new products at top
        appstate = 'accountCPL';
        current_Column = '';
        current_Order = 'NOSORT';
       
        sectionLoader(appstate, 'newadded', 0);

    }
   
        proceedAdding();

}



var getAvailProducts = function (UserName,Password, CustomerNumber, CustomerGroup, OwnerName) {
    if (checkLastActivity() == false) {
        return;
    }
    lockoutInput();
    $('#search_addproducts').val( searchCPLPhrase);
    showProcessing('#data_loading');
    appstate = 'accountCPL';
    logEvent(welcomeUserName, "begin post", "getAvailProducts");
    $.post(
           G_AbsoluteUri + 'Home/getAvailProducts',
          
           { UserName: UserName, Password: Password,CustomerNumber: CustomerNumber, CustomerGroup: CustomerGroup, OwnerName: OwnerName },
           handleGetAvailProducts
                   );
}

var findLineByVID = function (vid) {
    var total = accountCPL_Array.length;
    for (var i = 0; i < total; i++) {
        if (accountCPL_Array[i].VID == vid) {
            return i;
        }
    }

    return -1;
}




/// sync up the line status of each line.
var handleUpdateCPLLineStatus = function(content) {

    if (content != undefined && content != null && content != "") {
        var responseObject;
        var indexNumber = 0;
        responseObject = JSON.parse(content);
       
        if (responseObject.responseCode == "SUCCESS") {
            var total = responseObject.CPLLines.length;
            for (var i = 0; i < total; i++) {
                indexNumber = findLineByVID(responseObject.CPLLines[i].VID)
                if(indexNumber >= 0) {
                    accountCPL_Array[indexNumber].VState = responseObject.CPLLines[i].VState;
                }
            }   
        }
    }
}

var updateCPLLineStatus = function (VID) {
   
    $.post(
          G_AbsoluteUri + 'Home/getCPLLineStatus',
          { Domain: "NA",  vID: VID, userID: welcomeUserName, password: welcomePassword },
          handleUpdateCPLLineStatus
                  );
}

var reOpenAccount = function (index, number) {

    appstate = 'accountCPL';
    G_pricePointItemsComplete = "false";
    $("#pricelevelSpinner").css('display', 'inline');
    $("#pricelevel").addClass("disabled");
    $("#cpromoSpinner").css('display', 'inline');
    $("#cpromo").addClass("disabled");
    $('#search_accountCPL').val(searchCPLPhrase);
   // $('#search_accountCPL').siblings('.wdgt_icon').removeClass('toreset');
    $('.select_icon').removeClass('active');
   



    logEvent(welcomeUserName, "reopen account", "getItems");
    setLastActivity();
    $.post(
           G_AbsoluteUri + 'Home/getItems',
           { Domain: "NA",  vID: number, username: welcomeUserName, password: welcomePassword },
           handleItemResult
                   );
}



var openAccount = function (index, number) {
   
    appstate = 'accountCPL';
    G_pricePointItemsComplete = "false";
    $("#pricelevelSpinner").css('display', 'inline');
    $("#pricelevel").addClass("disabled");
    $("#cpromoSpinner").css('display', 'inline');
    $("#cpromo").addClass("disabled");
    clearFilters('accounts');
    clearFilters('accountCPL');
    clearFilters('addProducts');
    $('#search_accountCPL').val(searchCPLPhrase);
    $('#search_accountCPL').siblings('.wdgt_icon').removeClass('toreset');
    $('.select_icon').removeClass('active');
    
    
    logEvent(welcomeUserName, "begin post", "getItems");
    setLastActivity();
    $.post(
           G_AbsoluteUri + 'Home/getItems',
           {  Domain: "NA",  vID: number, username: welcomeUserName, password: welcomePassword , usernameAs: welcomeUserNameAs},
           handleItemResult
                   );
}

var gobackAddProducts = function () {
    appstate = 'accountCPL';
    closeModal();
    sectionLoader(appstate, 'modal_addproducts', 0);
}

function processPricePointItemUI(item, IndexNumber, currentLineStatus) {
    if (accountCPL_Array[IndexNumber].SellingStyle == "FV173") {
        var test = "";
    }

    if (accountCPL_Array[IndexNumber].pricePointUpdateComplete == true && $('#TM1Cut_' + IndexNumber).length > 0) {

        if (currentLineStatus == undefined || currentLineStatus == "") {
            //currentLineStatus = getLineStatus(accountCPL_Array[IndexNumber].MODOBJNUM, accountCPL_Array[IndexNumber].REVOBJNUM, accountCPL_Array[IndexNumber].COPOBJNUM, accountCPL_Array[IndexNumber].EndDate, G_SystemDate, accountCPL_Array[IndexNumber].VState, accountCPL_Array[IndexNumber].ProposedRollPriceVAmountAmount);
            currentLineStatus = accountCPL_Array[IndexNumber].LineStatus;
        }

        var thisItemStatus = accountCPL_Array[IndexNumber].VState;


        if ((accountCPL_Array[IndexNumber].CutLoad > 0 & thisItemStatus != "approved")
             || (currentLineStatus == "add")
            ) {
            $('#PriceLevel_' + IndexNumber).text("");
        }
        else
        {
            $('#PriceLevel_' + IndexNumber).text(item.PriceLevel);
        }

        $('#TM1Cut_' + IndexNumber).text(CurrencyFormatted(item.TM1Cut));
        $('#TM2Cut_' + IndexNumber).text(CurrencyFormatted(item.TM2Cut));
        $('#TM3Cut_' + IndexNumber).text(CurrencyFormatted(item.TM3Cut));
        $('#TM1Roll_' + IndexNumber).text(CurrencyFormatted(item.TM1Roll));
        $('#TM2Roll_' + IndexNumber).text(CurrencyFormatted(item.TM2Roll));
        $('#TM3Roll_' + IndexNumber).text(CurrencyFormatted(item.TM3Roll));
        $('#cutsroll_' + IndexNumber).text(item.CutAtRoll);
        $('#rollsize_' + IndexNumber).text(item.StandardRollSize);

        if (item.pRoll > 0 || item.pCut > 0) {

            $('#pRoll_' + IndexNumber).text(item.pRoll);
            $('#pCut_' + IndexNumber).text(item.pCut);
            $('#pStartDate_' + IndexNumber).text(item.pStartDate);
            $('#pEndDate_' + IndexNumber).text(item.pEndDate);
            $('#cPromoDiv_' + IndexNumber).addClass('li_cpromo');
            $('#cPromoDiv_' + IndexNumber).css('display', 'block');
            $('#cpl_indicator_' + IndexNumber).addClass('indicator_top');
            $('#cpromo_indicator_' + IndexNumber).css('display', 'block');
            $("#calpanel_" + IndexNumber).css('height', '210px');
            $('#pPriceLevel_' + IndexNumber).text(item.pPriceLevel);
           
        }

        if (currentLineStatus == "newadd") {
            $('#proposedRollAmountAmount_' + IndexNumber).text(CurrencyFormatted(item.TM1Roll));
            $('#proposedCutAmountAmount_' + IndexNumber).text(CurrencyFormatted(item.TM1Cut));
        }
        else {
            $('#proposedRollAmountAmount_' + IndexNumber).text(CurrencyFormatted(accountCPL_Array[IndexNumber].ProposedRollPriceVAmountAmount));
            $('#proposedCutAmountAmount_' + IndexNumber).text(CurrencyFormatted(accountCPL_Array[IndexNumber].ProposedCutPriceVAmountAmount));
        }

        accountCPL_Array[IndexNumber].pricePointUiUpdateComplete = true;
    }
}

function processPricePointItem(item, IndexNumber)
{
    if(accountCPL_Array[IndexNumber] == undefined || accountCPL_Array[IndexNumber] == null ){
        return;
    }
    var currentLineStatus = "";

    var thisItemStatus = accountCPL_Array[IndexNumber].VState;

    if (accountCPL_Array[IndexNumber].SellingStyle.indexOf("75") >= 0) {
        var test = "";
    }

    //check to see if a new value is present
    if (item.PriceLevel !== null && item.PriceLevel != "") {
        if (accountCPL_Array[IndexNumber].pricePointUpdateComplete != true) {
            currentLineStatus = getLineStatus(accountCPL_Array[IndexNumber].MODOBJNUM, accountCPL_Array[IndexNumber].REVOBJNUM, accountCPL_Array[IndexNumber].COPOBJNUM, accountCPL_Array[IndexNumber].EndDate, G_SystemDate, accountCPL_Array[IndexNumber].VState, accountCPL_Array[IndexNumber].ProposedRollPriceVAmountAmount);
            accountCPL_Array[IndexNumber].TM1Cut = item.TM1Cut;
            accountCPL_Array[IndexNumber].TM2Cut = item.TM2Cut;
            accountCPL_Array[IndexNumber].TM3Cut = item.TM3Cut;
            accountCPL_Array[IndexNumber].TM1Roll = item.TM1Roll;
            accountCPL_Array[IndexNumber].TM2Roll = item.TM2Roll;
            accountCPL_Array[IndexNumber].TM3Roll = item.TM3Roll;


            if ((accountCPL_Array[IndexNumber].CutLoad > 0 & thisItemStatus != "approved")
                  || (currentLineStatus == "add")
                ) {
                accountCPL_Array[IndexNumber].PriceLevel = "";
            }
            else {
                accountCPL_Array[IndexNumber].PriceLevel = item.PriceLevel;
            }

            accountCPL_Array[IndexNumber].CutAtRoll = item.CutAtRoll;
            accountCPL_Array[IndexNumber].Iscore = item.Iscore;
            accountCPL_Array[IndexNumber].StandardRollSize = item.StandardRollSize;
            accountCPL_Array[IndexNumber].pricePointUpdateComplete = true;

            if (item.pRoll > 0 || item.pCut > 0) {
                var isVisible = accountCPL_Array[IndexNumber].ItemVisible;
                var isVisiblePotential = accountCPL_Array[IndexNumber].ItemVisiblePotential;
                //dont count it twice :-)
                if ((accountCPL_Array[IndexNumber].pRoll <= 0 && item.pRoll > 0) || (accountCPL_Array[IndexNumber].pCut <= 0 && item.pCut > 0)) {
                    addCPLCategoryFilter("cpromo", "Yes", isVisible, isVisiblePotential);
                }
                else {
                    addCPLCategoryFilter("cpromo", "No", isVisible, isVisiblePotential);
                }

                accountCPL_Array[IndexNumber].pRoll = item.pRoll;
                accountCPL_Array[IndexNumber].pCut = item.pCut;
                accountCPL_Array[IndexNumber].pStartDate = item.pStartDate;
                accountCPL_Array[IndexNumber].pEndDate = item.pEndDate;
                accountCPL_Array[IndexNumber].pPriceLevel = item.pPriceLevel;
              
            }

        }
        //update HTML also
        processPricePointItemUI(item, IndexNumber,currentLineStatus);
    }
    else {
        if ((accountCPL_Array[IndexNumber].CutLoad > 0) & (thisItemStatus != "approved")) {
            $('#PriceLevel_' + IndexNumber).text("");
        } else {
            $('#PriceLevel_' + IndexNumber).text(accountCPL_Array[IndexNumber].PriceLevel);
        }
        accountCPL_Array[IndexNumber].pricePointUpdateComplete = true;

    }
}



function handleGetPricePointItemSingle(content) {
    var IndexNumber;
    var thisItemStatus;
    var currentLineStatus;
    var ContextString = "";
    
    if (G_cancelGetPricePointItems == "false")
    {
        if (content != undefined && content != null && content != "")
        {
            var items_Array = [];
            items_Array = JSON.parse(content);
            //update price here
            if (items_Array.length > 0)
            {
                
                ThreadNumber = items_Array[0].ThreadNumber;

                IndexNumber = items_Array[0].ThreadNumber;
                ContextString = items_Array[0].ContextString;
                if (ContextString == "" || ContextString != G_pricePointItemsContext.toString()) {
                    return;
                }

                processPricePointItem(items_Array[0], IndexNumber);
                return;
 
            }

        }

    }
}





function handleGetPricePointItems(content) {

    var ThreadNumber;
    var thisItemStatus;
    var currentLineStatus;
    try{
        
        if (G_cancelGetPricePointItems == "false")
        {
            if (content != undefined && content != null && content != "")
            {
               
                var items_Array = [];
                var IndexNumber = 0;
                var ContextString = "";
                items_Array = JSON.parse(content);
                //update price here
                if (items_Array.length > 0)
                {
                    ThreadNumber = items_Array[0].ThreadNumber;
                    ContextString = items_Array[0].ContextString;
                    if (ContextString == "" || ContextString != G_pricePointItemsContext.toString()) {
                        return;
                    }
                    IndexNumber = accountCPL_ArrayIndex[ThreadNumber].indexCount;
                    processPricePointItem(items_Array[0], IndexNumber);
                    accountCPL_ArrayIndex[ThreadNumber].indexCount++;
                    accountCPLDataUpdate(ThreadNumber);
                    return;

                }
            
            }

        }
     
    }
    catch (err)
    {
        logError(welcomeUserName, "handleGetPricePointItems", err.message, err.stack, '');
    }
}

var getPricePointItem = function (pthreadnumber,pitemIndex,pstyle, psize,pback,pregion,powningGroup,pcustomerGroupNumber,pstartdate,pproposedRollPrice) {

    $.post(
                   G_AbsoluteUri + 'Home/getPricePointItem',
                       { threadNumber: pthreadnumber, itemIndex: pitemIndex, style: pstyle, size: psize, back: pback, region: pregion, owningGroup: powningGroup, customerGroupNumber: pcustomerGroupNumber, startdate: pstartdate, proposedRollPrice: pproposedRollPrice, userID: welcomeUserName, password: welcomePassword },
                       handleGetPricePointItems
                   );
}

var getPricePointItemPhaseII = function (pthreadnumber,pcontextString, pitemIndex, pstyle, psize, pback, pbrand, pproductType, pregion, powningGroup,pcustomerNumber, pcustomerGroupNumber, pstartDate, pproposedRollPrice, pendDate) {
   
    $.post(
                   G_AbsoluteUri + 'Home/getPricePointItemPhaseII',
                       { threadNumber: pthreadnumber, contextString: pcontextString, itemIndex: pitemIndex, style: pstyle, size: psize, back: pback, brand: pbrand, productType: pproductType, region: pregion, owningGroup: powningGroup, customerNumber: pcustomerNumber, customerGroupNumber: pcustomerGroupNumber, startdate: pstartDate, enddate: pendDate, proposedRollPrice: pproposedRollPrice, userID: welcomeUserName, password: welcomePassword },
                       handleGetPricePointItems
                   );
}

var getPricePointItemSingle = function (pindexnumber, pstyle, psize, pback, pregion, powningGroup, pcustomerGroupNumber, pstartdate, pproposedRollPrice) {

    $.post(
                   G_AbsoluteUri + 'Home/getPricePointItem',
                       { threadnumber: pindexnumber, style: pstyle, size: psize, back: pback, region: pregion, owningGroup: powningGroup, customerGroupNumber: pcustomerGroupNumber, startdate: pstartdate, proposedRollPrice: pproposedRollPrice, userID: welcomeUserName, password: welcomePassword },
                       handleGetPricePointItemSingle
                   );
}

var getPricePointItemSinglePhaseII = function (pindexnumber,pcontextString, pstyle, psize, pback, pbrand, pproductType, pregion, powningGroup, pcustomerNumber, pcustomerGroupNumber, pstartDate, pproposedRollPrice, pendDate ) {
 
    $.post(
                   G_AbsoluteUri + 'Home/getPricePointItemPhaseII',
                       { threadnumber: pindexnumber, contextString: pcontextString, style: pstyle, size: psize, back: pback, brand: pbrand,  productType: pproductType, region: pregion, owningGroup: powningGroup, customerNumber: pcustomerNumber, customerGroupNumber: pcustomerGroupNumber, startdate: pstartDate, enddate:pendDate, proposedRollPrice: pproposedRollPrice, userID: welcomeUserName, password: welcomePassword },
                       handleGetPricePointItemSingle
                   );
}



if (!Array.prototype.filter) {
    Array.prototype.filter = function (fun /*, thisp*/) {
        var len = this.length;
        if (typeof fun != "function")
            throw new TypeError();

        var res = new Array();
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this) {
                var val = this[i]; // in case fun mutates this
                if (fun.call(thisp, val, i, this))
                    res.push(val);
            }
        }

        return res;
    };
}




function isAccountMatched(element, index, arraypointer) {
    if (element.name.toUpperCase().indexOf($('#search_accounts').val().toUpperCase()) >= 0) {
        return true;
    }
    if (element.number.toUpperCase().indexOf($('#search_accounts').val().toUpperCase()) >= 0) {
        return true;
    }
    return false;
}

var accountsFilter = function (theFilterCategory) {
    debugger;
    try
    {
        var theval = $('#search_accounts').val()
        var total = JSONobjectAccounts.length;
        var patternSearch = false;
        var groupFilterResult = true;
        var groupFilterPotentialResult = true;
        var statusFilterResult = true;
        var statusFilterPotentialResult = true;

       
        
        
            for (var i = 0; i < total; i++) {
                groupFilterResult = true;
                groupFilterPotentialResult = true;
                statusFilterResult = true;
                statusFilterPotentialResult = true;
                patternFilterResult = false;

                JSONobjectAccounts[i].itemVisible = "false";
                JSONobjectAccounts[i].itemVisiblePotential = "false";

                if (theval == "" || theval == dealerPhrase || theval == searchCPLPhrase) {
                    patternFilterResult = true;
                }
                else {
                    if (JSONobjectAccounts[i].name.toUpperCase().indexOf($('#search_accounts').val().toUpperCase()) >= 0) {
                        patternFilterResult = true;
                    }

                    if (JSONobjectAccounts[i].number.toUpperCase().indexOf($('#search_accounts').val().toUpperCase()) >= 0) {
                        patternFilterResult = true;
                    }
                }

              
                    if (G_filter_CustomerGroupArrayFilteredCount > 0) {

                        if (G_filter_CustomerGroupArray.length > 0) {
                            groupFilterResult = false;
                            groupFilterPotentialResult = false;
                            for (j = 0; j < G_filter_CustomerGroupArray.length; j++) {
                                if (G_filter_CustomerGroupArray[j].category == JSONobjectAccounts[i].custGroup) {
                                    if (G_filter_CustomerGroupArray[j].checked == 1) {
                                        groupFilterResult = true;
                                        groupFilterPotentialResult = true;
                                    }
                                    if (theFilterCategory == "group") {
                                        groupFilterPotentialResult = true;
                                    }
                                    break;
                                }
                            }
                        }
                    }

                   
                    if (G_filter_CustomerStatusArrayFilteredCount > 0) {
                     
                        if (G_filter_CustomerStatusArray.length > 0) {
                            statusFilterResult = false;
                            statusFilterPotentialResult = false;
                            var status = JSONobjectAccounts[i].status;
                            if (status == "draft") {
                                status = "revising";
                            }
                            for (j = 0; j < G_filter_CustomerStatusArray.length; j++) {
                               
                                if (G_filter_CustomerStatusArray[j].category == status) {
                                    if (G_filter_CustomerStatusArray[j].checked == 1) {
                                        statusFilterResult = true;
                                        statusFilterPotentialResult = true;
                                    }
                                    if (theFilterCategory == "status") {
                                        statusFilterPotentialResult = true;
                                    }
                                    break;
                                }

                            }
                        }
                    }

                    if (patternFilterResult == true & statusFilterResult == true & groupFilterResult == true) {
                        JSONobjectAccounts[i].itemVisible = "true";
                    }
                    else {
                        JSONobjectAccounts[i].itemVisible = "false";
                    }

                    if (patternFilterResult == true & statusFilterPotentialResult == true & groupFilterPotentialResult == true) {
                        JSONobjectAccounts[i].itemVisiblePotential = "true";
                    }
                    else {
                        JSONobjectAccounts[i].itemVisiblePotential = "false";
                    }

            }
            appstate = 'accounts';
            sectionLoader(appstate);
            updateFilterDisplay("group");
            updateFilterDisplay("status");


    }
   
    catch (err) {
        logError(welcomeUserName, "accountsFilter", err.message, err.stack, '');
        
    }
  
}

var productsFilter = function () {
    var theval = $('#search_addproducts').val().toUpperCase();
    var total = addProducts_Array.length;
    var patternSearch = false;
    var productthemeFilterResult = true;
    var productthemeFilterPotentialResult = true;
    var itemFilterCategory = "producttheme";

   

    try {

        for (var i = 0; i < total; i++)
        {
            patternSearch = false;
            productthemeFilterResult = true;
            productthemeFilterPotentialResult = true;

            addProducts_Array[i].ItemVisible = "false";
            if (theval == "" || theval == dealerPhrase.toUpperCase() || theval == searchCPLPhrase.toUpperCase()) {

                patternSearch = true;
            }
            else
            {

                if (addProducts_Array[i].SellingStyle.toUpperCase().indexOf($('#search_addproducts').val().toUpperCase()) >= 0) {
                    patternSearch = true;
                }

                if (addProducts_Array[i].StyleName.toUpperCase().indexOf($('#search_addproducts').val().toUpperCase()) >= 0) {
                    patternSearch = true;

                }

               
            }

            if (G_filter_ProductThemeDisplayArrayFilteredCount > 0) {
                if (G_filter_ProductThemeDisplayArray.length > 0) {
                    productthemeFilterResult = false;
                    productthemeFilterPotentialResult = true;
                    for (j = 0; j < G_filter_ProductThemeDisplayArray.length; j++) {
                       
                        if (G_filter_ProductThemeDisplayArray[j].category == addProducts_Array[i].ThemeDisplay) {
                            if (G_filter_ProductThemeDisplayArray[j].checked == 1) {
                                productthemeFilterResult = true;
                                productthemeFilterPotentialResult = true;
                            }

                            if (itemFilterCategory == "producttheme") {
                                productthemeFilterPotentialResult = true;
                            }
                            break;
                        }

                    }
                }
            }

            if (addProducts_Array[i].ItemSelected == "true") {
                addProducts_Array[i].ItemVisible = "true"
            }

            if (patternSearch == true & productthemeFilterResult == true) {
                addProducts_Array[i].ItemVisible = "true";
              
            }
            if (patternSearch == true & productthemeFilterPotentialResult == true) {
                addProducts_Array[i].ItemVisiblePotential = "true";
              
            }

        }
        appstate = "addProducts";
        sectionLoader(appstate);
        $('#addProducts_datapanel').scrollTop();

       
    } catch (err) {
        logError(welcomeUserName, "productsFilter", err.message, err.stack, '');
      
    }
}
    

//NOTE: you must call updateCPLFilterDisplay() before itemsFilter()

var itemsFilter = function (itemFilterCategory) {
    try {


        G_itemFilterCategory = itemFilterCategory;
        appstate = 'accountCPL';
        filterAllCPLItems(itemFilterCategory, 0);  
        sectionLoader(appstate);
        updateCPLFilterDisplay("theme");
        updateCPLFilterDisplay("brand");
        updateCPLFilterDisplay("promo");
        updateCPLFilterDisplay("cpromo");
        updateCPLFilterDisplay("autotm3");
        updateCPLFilterDisplay("pricelevel");
      


    }
    catch (err) {
        logError(welcomeUserName, "itemsFilter", err.message, err.stack, '');
       
    }
}

var filterAllCPLItems = function (itemFilterCategory, indexNumber) {
 
    try {
        
        var theval = $('#search_accountCPL').val().toUpperCase();
        var total = accountCPL_Array.length;
        var patternSearch = false;
        var themeFilterResult = true;
        var themeFilterPotentialResult = true;
        var brandFilterResult = true;
        var brandFilterPotentialResult = true;
        var promoFilterResult = true;
        var promoFilterPotentialResult = true;
        var cpromoFilterResult = true;
        var cpromoFilterPotentialResult = true;
        var autotm3FilterResult = true;
        var autotm3FilterPotentialResult = true;
        var pricelevelFilterResult = true;
        var pricelevelFilterPotentialResult = true;
        var editGroupFilterResult = true;
        var editGroupFilterPotentialResult = true;
        var status = "";
        

        if (itemFilterCategory == null) {
            itemFilterCategory = "";
        }

            for (var i = 0; i < total; i++) {

                 accountCPL_Array[i].ItemVisible = "false";
                 accountCPL_Array[i].ItemVisiblePotential = "false";
                 themeFilterResult = true;
                 themeFilterPotentialResult = true;
                 brandFilterResult = true;
                 brandFilterPotentialResult = true;
                 promoFilterResult = true;
                 promoFilterPotentialResult = true;
                 cpromoFilterResult = true;
                 cpromoFilterPotentialResult = true;
                 autotm3FilterResult = true;
                 autotm3FilterPotentialResult = true;
                 pricelevelFilterResult = true;
                 pricelevelFilterPotentialResult = true;
                 patternSearch = false;
                 editGroupFilterResult = true;
                 editGroupFilterPotentialResult = true;


                 accountCPL_Array[i].LineStatus = getLineStatus(accountCPL_Array[i].MODOBJNUM, accountCPL_Array[i].REVOBJNUM, accountCPL_Array[i].COPOBJNUM, accountCPL_Array[i].EndDate, G_SystemDate, accountCPL_Array[i].VState, accountCPL_Array[i].ProposedRollPriceVAmountAmount);
              
                 //look to see if group edit it applied
                 if (G_groupEditType != "") {
                     //look at current current line level status
                     if ( G_groupEditType == "edit") {
                         if (accountCPL_Array[i].LineStatus == "expire"  ) {
                             editGroupFilterResult = false;
                             editGroupFilterPotentialResult = false;
                         }

                     }

                     if (G_groupEditType == "expire" || G_groupEditType == "newpromo" ) {
                         if (accountCPL_Array[i].LineStatus == "edit" || accountCPL_Array[i].LineStatus == "expire" || accountCPL_Array[i].LineStatus == "newpromo" || accountCPL_Array[i].LineStatus == "add" || accountCPL_Array[i].LineStatus == "newadd") {
                             editGroupFilterResult = false;
                             editGroupFilterPotentialResult = false;
                         }

                     }
                   
                 }


                 if (theval == "" || theval == dealerPhrase.toUpperCase() || theval == searchCPLPhrase.toUpperCase()) {

                     patternSearch = true;
                 } else {

                     if (accountCPL_Array[i].SellingStyle.toUpperCase().indexOf($('#search_accountCPL').val().toUpperCase()) >= 0) {
                        
                         patternSearch = true;
                     }

                     if (accountCPL_Array[i].StyleName.toUpperCase().indexOf($('#search_accountCPL').val().toUpperCase()) >= 0) {
                        
                         patternSearch = true;

                     }
                 }

                 if (G_filter_CPLThemeDisplayArrayFilteredCount > 0) {

                     if (G_filter_CPLThemeDisplayArray.length > 0) {
                         themeFilterResult = false;
                         themeFilterPotentialResult = false;
                         for (j = 0; j < G_filter_CPLThemeDisplayArray.length; j++) {
                            
                             if (G_filter_CPLThemeDisplayArray[j].category == accountCPL_Array[i].ThemeDisplay)
                             {
                                 if (G_filter_CPLThemeDisplayArray[j].checked == 1)
                                 {
                                     themeFilterResult = true;
                                     themeFilterPotentialResult = true;
                                 }

                                 if (itemFilterCategory == "theme") {
                                    themeFilterPotentialResult = true;
                                 }
                                 break;
                             }

                         }
                     }
                 }

                 if (G_filter_CPLBrandArrayFilteredCount > 0) {

                     if (G_filter_CPLBrandArray.length > 0) {
                         brandFilterResult = false;
                         brandFilterPotentialResult = false;
                         for (j = 0; j < G_filter_CPLBrandArray.length; j++) {
                            
                             if ( G_filter_CPLBrandArray[j].category == accountCPL_Array[i].Brand) {
                               
                                 if (G_filter_CPLBrandArray[j].checked == 1) {
                                     brandFilterResult = true;
                                     brandFilterPotentialResult = true;

                                 }
                                 if (itemFilterCategory == "brand") {
                                     brandFilterPotentialResult = true;
                                 }
                                 break;
                                 
                             }
                         }
                     }
                 }

                 if ( G_filter_CPLPromoPriceArrayFilteredCount > 0) {

                     if (G_filter_CPLPromoPriceArray.length > 0) {
                       //status = getLineStatus(accountCPL_Array[i].MODOBJNUM, accountCPL_Array[i].REVOBJNUM, accountCPL_Array[i].COPOBJNUM, accountCPL_Array[i].EndDate, G_SystemDate, accountCPL_Array[i].VState,accountCPL_Array[i].ProposedRollPriceVAmountAmount);
                       status = accountCPL_Array[i].LineStatus; 
                       promoFilterResult = false;
                       promoFilterPotentialResult = false;
                        for (j = 0; j < G_filter_CPLPromoPriceArray.length; j++) {
                            var translatedValue = "No";
                            if (status == "newpromo") {
                                translatedValue = "Yes"
                            }
                            
                             if ( G_filter_CPLPromoPriceArray[j].category == translatedValue) {
                                
                                 if (G_filter_CPLPromoPriceArray[j].checked == 1) {
                                     promoFilterResult = true;
                                     promoFilterPotentialResult = true;
                                 }
                                 if (itemFilterCategory == "promo") {
                                     promoFilterPotentialResult = true;
                                 }
                                 break;
                             }
                         }
                     }
                 }

                 if (G_filter_CPLCorpPromoArrayFilteredCount > 0) {

                     if (G_filter_CPLCorpPromoArray.length > 0) {
                         //status = getLineStatus(accountCPL_Array[i].MODOBJNUM, accountCPL_Array[i].REVOBJNUM, accountCPL_Array[i].COPOBJNUM, accountCPL_Array[i].EndDate, G_SystemDate, accountCPL_Array[i].VState,accountCPL_Array[i].ProposedRollPriceVAmountAmount);
                         //status = accountCPL_Array[i].LineStatus;
                         if (accountCPL_Array[i].pRoll > 0 || accountCPL_Array[i].pCut > 0) {
                             status = "cpromo";
                         }
                         else {
                             status = "";
                         }

                         cpromoFilterResult = false;
                         cpromoFilterPotentialResult = false;
                         for (j = 0; j < G_filter_CPLCorpPromoArray.length; j++) {
                             var translatedValue = "No";
                             if (status == "cpromo") {
                                 translatedValue = "Yes"
                             }

                             if (G_filter_CPLCorpPromoArray[j].category == translatedValue) {

                                 if (G_filter_CPLCorpPromoArray[j].checked == 1) {
                                     cpromoFilterResult = true;
                                     cpromoFilterPotentialResult = true;
                                 }
                                 if (itemFilterCategory == "cpromo") {
                                     cpromoFilterPotentialResult = true;
                                 }
                                 break;
                             }
                         }
                     }
                 }

                 if ( G_filter_CPLAutoTM3ArrayFilteredCount > 0) {

                     if (G_filter_CPLAutoTM3Array.length > 0) {
                         autotm3FilterResult = false;
                         autotm3FilterPotentialResult = false;
                         for (j = 0; j < G_filter_CPLAutoTM3Array.length; j++) {
                             var translatedValue = "No";
                             if (accountCPL_Array[i].IsAutoTM3Promo == "T") {
                                 translatedValue = "Yes"
                             }
                            
                             if ( G_filter_CPLAutoTM3Array[j].category == translatedValue) {
                               
                                 if (G_filter_CPLAutoTM3Array[j].checked == 1) {
                                     autotm3FilterResult = true;
                                     autotm3FilterPotentialResult = true;
                                 }
                                 if (itemFilterCategory == "autotm3") {
                                     autotm3FilterPotentialResult = true;
                                 }
                               
                                 break;
                             }
                         }
                     }
                 }

                 if (G_filter_CPLPriceLevelArrayFilteredCount > 0) {

                     if (G_filter_CPLPriceLevelArray.length > 0) {
                         pricelevelFilterResult = false;
                         pricelevelFilterPotentialResult = false;
                         for (j = 0; j < G_filter_CPLPriceLevelArray.length; j++) {
                             
                             if ( G_filter_CPLPriceLevelArray[j].category == accountCPL_Array[i].PriceLevel) {
                                
                                 if (G_filter_CPLPriceLevelArray[j].checked == 1) {
                                     pricelevelFilterResult = true;
                                     pricelevelFilterPotentialResult = true;
                                 }
                                 if (itemFilterCategory == "pricelevel") {
                                     pricelevelFilterPotentialResult = true;
                                 }
                                 break;
                                
                             }
                         }
                     }
                 }

                //if an item is selected then it will override the filter
                 if (accountCPL_Array[i].ItemSelected == "true") {
                     accountCPL_Array[i].ItemVisible = "true"
                 }

                 if (patternSearch == true
                     & themeFilterResult == true
                     & brandFilterResult == true
                     & promoFilterResult == true
                     & cpromoFilterResult == true
                     & autotm3FilterResult == true
                     & pricelevelFilterResult == true
                     & editGroupFilterResult == true ) {
                     accountCPL_Array[i].ItemVisible = "true";
                 }
                 if (patternSearch == true
                     & themeFilterPotentialResult == true
                     & brandFilterPotentialResult == true
                     & promoFilterPotentialResult == true
                     & cpromoFilterPotentialResult == true
                     & autotm3FilterPotentialResult == true
                     & pricelevelFilterPotentialResult == true
                     & editGroupFilterPotentialResult == true
                     ) {
                     accountCPL_Array[i].ItemVisiblePotential = "true";
                 }

               
                
           }
        

    }
    catch (err) {
        logError(welcomeUserName, "filterAllCPLItems", err.message, err.stack, '');
      
    }

}

var getFilterOptions = function (target, category) {
    
    G_accountsFilterCalled = false;
    filterCategory = category;
    var idTarget = '#' + target + '_filter';

    $('.filter_outer').css('display', 'none');

    category = "#fopts_" + category;
    $(category).css('display', 'block');
    accountsFilter(filterCategory);

    updateFilterDisplay("group");
    updateFilterDisplay("status");

    $(idTarget + ' .m_display').animate({ 'left': '-450px' }, 300, function () {
        $('#' + target + '_filter_back').fadeIn(300);
    });

}

var getCPLFilterOptions = function (target, category) {
    G_itemsFilterCalled = false;
    filterCategory = category;
    var idTarget = '#' + target + '_filter';

    $('.filter_outer').css('display', 'none');

    category = "#fopts_" + category;
    $(category).css('display', 'block');

    updateCPLFilterDisplay("theme");
    updateCPLFilterDisplay("brand");
    updateCPLFilterDisplay("promo");
    updateCPLFilterDisplay("cpromo");
    updateCPLFilterDisplay("autotm3");
    updateCPLFilterDisplay("pricelevel");

    $(idTarget + ' .m_display').animate({ 'left': '-450px' }, 300, function () {
       
        $('#' + target + '_filter_back').fadeIn(300);
    });
    

    itemsFilter(filterCategory);
}


var returnFilterOptions = function (target, eval) {
    
    var idTarget = '#' + target + '_filter';

    $('#cntrl_' + target + '_categories').css('display', 'block');
    $('#' + target + '_filter_back').fadeOut(300);
    $(idTarget + ' .m_display').animate({ 'left': '0px' }, 300);
    return;

    if (eval == true) {
        
        if (isFilterChecked(filterCategory) == true) {
            $('#' + filterCategory).addClass('selected');
           
        }
        else {
            $('#' + filterCategory).removeClass('selected');
        }

        $('#cntrl_' + target + '_categories').css('display', 'block');
        $('#' + target + '_filter_back').fadeOut(300);
        $(idTarget + ' .m_display').animate({ 'left': '0px' }, 300);
        return;

        var checkClass = $('#' + filterCategory + '_all').attr('checked');

        if (checkClass == 'checked') {
            $('#' + filterCategory).removeClass('selected');
        }
        else {
            $('#' + filterCategory).addClass('selected');
        }

    }
    else {
       
        var tcat = '#fopts_' + filterCategory;
        var tcatbtn = '#' + filterCategory;

        $(tcat + ' .filter_inner ul.filterlist li a').removeClass('selected');
        $(tcatbtn).removeClass('selected');

        document.getElementById(filterCategory + '_all').checked = true;

    }

    $('#cntrl_' + target + '_categories').css('display', 'block');
    $('#' + target + '_filter_back').fadeOut(300);
    $(idTarget + ' .m_display').animate({ 'left': '0px' }, 300);

}


var setFilters = function (target) {
    
    var goTarget = '#' + target + '_filter';
    goModal(goTarget);
    
    $("#productsfopts_theme").css('display', 'block');
    
    if (target == "addproducts") {
        $('#addproducts_filter').css('display', 'block');
       
        setThemeOptionsHTML("producttheme");
        updateCPLFilterDisplay("producttheme");
        return;
    }
    returnFilterOptions(target, false);
}
 

var unsetFilters = function (target) {
   
    var idTarget = '#' + target;


    filterCategory = '';
    filterOptions = [];

    // Reset all filter options - maybe not the most efficient way but getElementById is required for value changes in older versions of IE
    switch (target) {
        case 'accounts':
            clearFilter("group");
            clearFilter("status");
            $("filter_opts_account_widget").removeClass('active');
            $("filter_opts_account_widget span").html('Filter Options');

            break;
        case 'accountCPL':
            clearFilter("theme");
            clearFilter("brand");
            clearFilter("promo");
            clearFilter("cpromo");
            clearFilter("autotm3");
            clearFilter("pricelevel");
            $("filter_opts_accountCPL_widget").removeClass('active');
            $("filter_opts_accountCPL_widget span").html('Filter Options');
            break;

        case 'addProducts':
            clearFilter("producttheme");
           
            $("filter_opts_addproducts_widget").removeClass('active');
            $("filter_opts_addproducts_widget span").html('Filter Options');
            break;
        default:
            clearFilter("group");
            clearFilter("status");
            $("filter_opts_account_widget").removeClass('active');
            $("filter_opts_account_widget span").html('Filter Options');
    }

    // Reset all filter options
    if (target == "accounts")  {
      
        accountsFilter();
    } else {
      
        itemsFilter();
    }

    returnFilterOptions(target,true);

}

var clearFilters = function (target) {

    filterCategory = '';
    filterOptions = [];

    // Reset all filter options - maybe not the most efficient way but getElementById is required for value changes in older versions of IE
    switch (target) {
        case 'accounts':
            clearFilter("group");
            clearFilter("status");
            $("filter_opts_account_widget").removeClass('active');
            $("filter_opts_account_widget span").html('Filter Options');

            break;
        case 'accountCPL':
            clearFilter("theme");
            clearFilter("brand");
            clearFilter("promo");
            clearFilter("cpromo");
            clearFilter("autotm3");
            clearFilter("pricelevel");
            $("filter_opts_accountCPL_widget").removeClass('active');
            $("filter_opts_accountCPL_widget span").html('Filter Options');
            break;

        case 'addProducts':
            clearFilter("producttheme");
           
            $("filter_opts_addproducts_widget").removeClass('active');
            $("filter_opts_addproducts_widget span").html('Filter Options');
            break;
        default:
            clearFilter("group");
            clearFilter("status");
            $("filter_opts_account_widget").removeClass('active');
            $("filter_opts_account_widget span").html('Filter Options');
    }
}


//Modal Window Function


var goModal = function (id) {
    //Get the screen height and width
   // debugger
    try{
        var maskHeight = $(document).height();
        var maskWidth = $(window).width();

        //Get the window height and width
        var winH = $(window).height();
        var winW = $(window).width();

        //Set the popup window to center
        if (winH >= 700) {
            $(id).css('top', 100);
            $(id).css('left', winW / 2 - $(id).width() / 2);

            $('.Zebra_DatePicker').css('margin-top', '-' + (winH / 2 - $(id).height() / 2 + 30) + 'px');

        }
        else {
            $(id).css('top', winH / 2 - $(id).height() / 2);
            $(id).css('left', winW / 2 - $(id).width() / 2);

            // Set Zebra Picker accordingly
            $('.Zebra_DatePicker').css('margin-top', '-130px'); // From default setting in stylesheet

        }

        $('#mask2').fadeIn(500);

        //transition effect
        $(id).delay(100).fadeIn(100);

    } catch (err) {
        logError(welcomeUserName, "goModal", err.message, err.stack, '');
    }

}


var innerModal = function (id) {
    //Get the window height and width
    try{
        var winH = $(window).height();
        var winW = $(window).width();

        //Close other modals
        $('.window').fadeOut(100);

        //Set the popup window to center
        if (winH >= 700) {
            $(id).css('top', 100);
            $(id).css('left', winW / 2 - $(id).width() / 2);

            $('.Zebra_DatePicker').css('margin-top', '-' + (winH / 2 - $(id).height() / 2 + 30) + 'px');

        }
        else {
            $(id).css('top', winH / 2 - $(id).height() / 2);
            $(id).css('left', winW / 2 - $(id).width() / 2);

            // Set Zebra Picker accordingly
            $('.Zebra_DatePicker').css('margin-top', '-130px'); // From default setting in stylesheet

        }

        //transition effect
        $(id).delay(100).fadeIn(100);

    }
    catch (err)
    {
        logError(welcomeUserName, "innerModal", err.message, err.stack, '');
    }


}

//this function prevents Cordova browser from crashing.
var queueCalculatorValues = function (roll_price, cut_price, load_price, setcalendar, indexNumber, preload_roll, preload_cut) {
    setTimeout(function () { passCalculatorValues(roll_price, cut_price, load_price, setcalendar, indexNumber, preload_roll, preload_cut); }, 500);
}
var passCalculatorValues = function (roll_price, cut_price, load_price, setcalendar, indexNumber,preload_roll,preload_cut) {
    try {
        $('.priceset').removeClass('active');
        //setPriceStepIncrement(0.09 + 0);
        disablePriceStepIncrement();
        $('#datepicker_end').val('');
        setEndDate("");
        $('#datepicker_start').val(getPrettyDate());

        $('#accountCPL_setdate').addClass('disabled');
        $('#loadMessage').css('display', 'none');

        if (accountCPL_Array[indexNumber].CUTPRICEALLOWED != 'N') {

            $('#constrainer').addClass('active');
            $('.m_cal_indicator').animate({ 'opacity': 0 }, 300, function () {
                $('#m_cal_value_l').addClass('active');
                $('#m_cal_value_r').addClass('active');
                $('#m_cal_value_r').removeClass('disabled');
                $('#m_cal_value_r').prop('disabled', false);
            });

            constrainedPrice = true;
        } else {
            $('#constrainer').removeClass('active');
            $('.m_cal_indicator').animate({ 'opacity': 0 }, 300, function () {
                $('#m_cal_value_l').addClass('active');
                $('#m_cal_value_r').removeClass('active');
                $('#m_cal_value_r').addClass('disabled');
                $('#m_cal_value_r').prop('disabled', true);
            });
            constrainedPrice = true;


        }

        

        G_current_Index = indexNumber;

        //check for 9cent or 1cent available
        $.post(
                             G_AbsoluteUri + 'Home/isOneCentAllowed',
                             { company: 'R', customer: JSONobjectAccounts[G_accounts_currentIndex].number, customergroup: JSONobjectAccounts[G_accounts_currentIndex].custGroupNumber, brand: accountCPL_Array[indexNumber].Brand, userID: welcomeUserName, password: welcomePassword },
                                 function (content) {
                                     responseObject = JSON.parse(content);
                                     if (responseObject.responseCode == "SUCCESS") {
                                         if (responseObject.responseMessage.toUpperCase() == "TRUE") {
                                             //$('#tabbar1').css('display', 'block');
                                             setPriceStepIncrement(0.09 + 0);
                                             //$('#tabbar2').css('display', 'block');
                                             return;
                                         }
                                     }
                                     $('#tabbar1').css('display', 'none');
                                     //$('#tabbar2').css('display', 'none');

                                 }
                   );
        


       // var status = getLineStatus(accountCPL_Array[indexNumber].MODOBJNUM, accountCPL_Array[indexNumber].REVOBJNUM, accountCPL_Array[indexNumber].COPOBJNUM, accountCPL_Array[indexNumber].EndDate, G_SystemDate, accountCPL_Array[indexNumber].VState, accountCPL_Array[indexNumber].ProposedRollPriceVAmountAmount);
        status = accountCPL_Array[indexNumber].LineStatus;
        if (setcalendar == false) {
            $('#setcalendar').css('display', 'none');
            if(status == "add" || status == "newadd")
            {
                if (roll_price + 0 == 0) {
                    roll_price = accountCPL_Array[indexNumber].TM1Roll;
                    $('#set_TM1').addClass('active');
                }
                if (cut_price + 0 == 0) {
                    cut_price = accountCPL_Array[indexNumber].TM1Cut;
                }

                G_submitAs = "add"
            }
            else
            {

                G_submitAs = "edit";
            }
        }
        else {
            $('#setcalendar').css('display', 'block');
            G_submitAs = "newpromo";
        }



        if (price_target == 0) {
            price_target = roll_price;
        }
        else {
            if (input_target == '#m_cal_value_l') {
                price_target = roll_price;
            }
            else {
                price_target = cut_price;
            }


        }

        current_Load = load_price;
        current_Roll = roll_price;
        current_Cut = cut_price;

        $('#current_roll').html('$' + (roll_price + 0).toFixed(2));
        $('#m_cal_value_l').html('$ ' + (roll_price + 0).toFixed(2));
        $('#rollprice').html('$ ' + (roll_price + 0).toFixed(2));

        if (load_price > 0)
        {
            if (accountCPL_Array[indexNumber].VState == "approved")
            {
                $('#rollprice').css('display', 'inline');
                $('#rollload').html('(+' + numberForDisplay(load_price) + ')');
                $('#rollprice').html('$ ' + (preload_roll + 0).toFixed(2));
            }
            $('#loadMessage').css('display', 'block');
        }
        else
        {
            $('#rollprice').css('display', 'none');
            $('#rollprice').html('');
            $('#rollload').html('');
        }


            $('#current_cut').html('$' + (cut_price + 0).toFixed(2));
            $('#m_cal_value_r').html('$ ' + (cut_price + 0).toFixed(2));
            $('#cutprice').html('$ ' + (cut_price + 0).toFixed(2));

            if (load_price > 0)
            {
                if (accountCPL_Array[indexNumber].VState == "approved")
                {
                    $('#cutprice').css('display', 'inline');
                    $('#cutload').html('(+' + numberForDisplay(load_price) + ')');
                    $('#cutprice').html('$ ' + (preload_cut + 0).toFixed(2));
                }
                $('#loadMessage').css('display', 'block');
            }
            else
            {
                $('#cutprice').css('display', 'none');
                $('#cutprice').html('');
                $('#cutload').html('');
            }

            if (status == "add" || status == "newadd") {
                $('#loadMessage').css('display', 'block');
            }

            if (accountCPL_Array[indexNumber].CUTPRICEALLOWED != 'N') {
                $('#current_price_divider').css('display', 'inline');
                $('#val_label_r').css('display', 'inline');
                $('#constrainer').css('display', 'block');
                $('#current_cut').css('display', 'inline');
                $('#cutprice').css('display', 'inline');
                $('.val_label h6').css('display', 'inline');
                $('#m_cal_value_r').css('display', 'inline');

            }else{
              
                $('#current_cut').css('display', 'none'); 
                $('#m_cal_value_r').css('display', 'none');
                $('#cutprice').css('display', 'none');
                $('.val_label h6').css('display', 'none');
                $('#cutload').html('');
                $('#current_price_divider').css('display', 'none');
                $('#val_label_r').css('display', 'none');
                $('#constrainer').css('display', 'none');
        }
        
        if (accountCPL_Array[indexNumber].Iscore != undefined && accountCPL_Array[indexNumber].Iscore == "0")
        {
            $('#set_TM2').removeClass('disabled');
            $('#set_TM2').prop('disabled', false);
            $('#set_TM3').removeClass('disabled');
            $('#set_TM3').prop('disabled', false);
        }else
        {
            $('#set_TM2').addClass('disabled');
            $('#set_TM2').prop('disabled', true);
            $('#set_TM3').addClass('disabled');
            $('#set_TM3').prop('disabled', true);

        }

        buildSlider(price_target, current_Load);
    }
    catch (err)
    {
        logError(welcomeUserName, "passCalculatorValues", err.message, err.stack, '');

    }

}




var closeModal = function () {
    $('#mask, #mask2').fadeOut(600);
    $('.window').fadeOut(100);
}

function replaceAll(find, replace, str) {
    //return str.replace(new RegExp(find, 'g'), replace);
    return str.split(find).join(replace);
}


var handleGetCPL = function (content) {
    var fileName;
    var responseObject;
	logEvent(welcomeUserName, "JavaScript:handleGetCPL()", "set releaseLockout() ");
    releaseLockout(true);
    try {
    fileName = replaceAll(' ', '_', replaceAll('\'','_', JSONobjectAccounts[G_accounts_currentIndex].name));
    fileName = replaceAll('/', '_', fileName);
    fileName = replaceAll('\\', '_', fileName);
    logEvent(welcomeUserName, "JavaScript:handleGetCPL()", "JSON.parse:  " + content);
              responseObject = JSON.parse(content);

              if (responseObject.responseCode == "SUCCESS") {
                  logEvent(welcomeUserName, "JavaScript:handleGetCPL()", "JSON.parse: SUCCESS and open email with attachemnt");
                       window.plugin.email.open({
                      // to: ['johndoe@mohawkind.com'],
                      // cc: ['johndoe@gmail.com'],
                      // bcc: ['john.doe@appplant.com', 'jane.doe@appplant.com'],
                  subject: fileName + ' - Price List',
                  body: 'Please see attached Price List. ',

                  attachments: ['base64:' + fileName + '_Price_List.pdf//' + responseObject.Base64PDFString ],

                  });
				  logEvent(welcomeUserName, "JavaScript:handleGetCPL()", "JSON.parse: AFTER open email with attachemnt");
              }
              else
              {
				  logEvent(welcomeUserName, "JavaScript:handleGetCPL()", "JSON.parse: FAIL ");
                  if (responseObject.RememberMeCookie == 'INVALID') {
                      logOut();
                      return;
                  }
                  $("#alertMessageContent").html("Oops... There is a problem with retrieving the PDF.");
                  goModal('#alertMessageBox');
              }
             
    }
    catch (err)
    {
        $("#alertMessageContent").html("Oops... There is a problem with retrieving the PDF.");
        goModal('#alertMessageBox');
        logError(welcomeUserName, "handleGetCPL", err.message, err.stack, '');
    }
}

var emailCPL = function (headerID) {
    try {
		logEvent(welcomeUserName, "JavaScript:emailCPL()", "headerID: " + headerID);
        if (getMobileOperatingSystem() == "unknown") {
			logEvent(welcomeUserName, "JavaScript:emailCPL()", "getMobileOperatingSystem() == unknown");
            logEvent(welcomeUserName, "JavaScript:emailCPL()", "before post(): " + G_AbsoluteUri + "Home/EncryptValue");
            $.post(
                             G_AbsoluteUri + 'Home/EncryptValue',
                             { theValue: headerID },
                                 function (content) {
                                     logEvent(welcomeUserName, "JavaScript:emailCPL()", "after post(): " + G_AbsoluteUri + "Home/EncryptValue");
                                     var encodedString =   encodeURIComponent(content);
                                     window.open(G_AbsoluteUri + 'Home/PDFStream?code=' + encodedString, '_blank', 'toolbar=yes,location=no,closebuttoncaption=Close,enableViewportScale=yes');
                                 }
                   );
            }
            else
        {
           
            if (window.plugin != undefined && window.plugin.email != undefined) {
              logEvent(welcomeUserName, "JavaScript:emailCPL()", "found email plugin here");
                //found plugin here
                window.plugin.email.isServiceAvailable(
                //callback function defined here
                function (isAvailable) {
					logEvent(welcomeUserName, "JavaScript:emailCPL()", "window.plugin.email.isServiceAvailable");
                    if (isAvailable) {
						logEvent(welcomeUserName, "JavaScript:emailCPL()", "window.plugin.email.isServiceAvailable == yes");
                        logEvent(welcomeUserName, "JavaScript:emailCPL()", "window.plugin.email.isServiceAvailable: isLockout() " + isLockout());
                        if (isLockout() == false) {
                            lockoutInput();
                            showProcessing('#data_loading');
							logEvent(welcomeUserName, "JavaScript:emailCPL()", "before post: calling handleGetCPL() " + G_AbsoluteUri + "Home/PDFBase64String");
                            $.post(
                                  G_AbsoluteUri + 'Home/PDFBase64String',
                                  { headerID: headerID },
                                  handleGetCPL
                                          );
                        logEvent(welcomeUserName, "JavaScript:emailCPL()", "after post: calling handleGetCPL() " + G_AbsoluteUri + "Home/PDFBase64String");
						}
                    }
                    else {

						logEvent(welcomeUserName, "JavaScript:emailCPL()", "window.plugin.email.isServiceAvailable == No");
                        $("#alertMessageContent").html("Could not find default email client");
                        goModal('#alertMessageBox');
                    }
                });
            }
            else
            {
              logEvent(welcomeUserName, "JavaScript:emailCPL()", "not found email plugin here");
                //plugin not found 
                $.post(
                            G_AbsoluteUri + 'Home/EncryptValue',
                            { theValue: headerID },
                                function (content) {
                                    var encodedString = encodeURIComponent(content);
                                    window.open(G_AbsoluteUri + 'Home/PDFStream?code=' + encodedString, '_blank', 'toolbar=yes,location=no,closebuttoncaption=Close,enableViewportScale=yes');
                                }
                  );
				  logEvent(welcomeUserName, "JavaScript:emailCPL()", "not found email plugin here - 2");
            }
            }
            return;
    }
    catch (err)
    {
        $("#alertMessageContent").html("Ooops... There is a problem with retrieving the PDF.");
        goModal('#alertMessageBox');
        logError(welcomeUserName, "emailCPL", err.message, err.stack, '');
 
    }
}



// Import XML Document
var importXML = function (xmlData) {

    var xmlhttp,
        xmlDoc;

    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("GET", xmlData, false);
    xmlhttp.send();
    xmlDoc = xmlhttp.responseXML;

    return xmlDoc;
}

// Changes XML to JSON
var xmlToJson = function (xml) {
    // Create the return object
    var obj = {};

    if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof (obj[nodeName]) == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof (obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;

};


var accountXMLRender = function (xmlDoc) {

    var x = xmlDoc.getElementsByTagName("ACCOUNT");
    for (i = 0; i < x.length; i++) {
        var v = i;
        if ((v + 1) % 2 == 0) {
            lineval = " even";
        }
        else {
            lineval = "";
        }
        var status = (x[i].getElementsByTagName("STATUS")[0].childNodes[0].nodeValue);
        accountsData += '<div class="m_li container fluid' + lineval + '" id="accnt_line_' + i + '">\n';
        accountsData += '<div class="container custom">\n';
        accountsData += '<div class="starter line col1">\n';
        accountsData += '<span class="status_icon ' + status + '"></span>\n';
        accountsData += '</div>\n';
        accountsData += '<div class="line col2">\n';
        accountsData += '<p>' + (x[i].getElementsByTagName("NUMBER")[0].childNodes[0].nodeValue) + '</p>\n';
        accountsData += '</div>\n';
        accountsData += '<div class="line col3">\n';
        accountsData += '<p>' + (x[i].getElementsByTagName("NAME")[0].childNodes[0].nodeValue) + '</p>\n';
        accountsData += '</div>\n';
        accountsData += '<div class="lifne col4">\n';
        accountsData += '<p>' + (x[i].getElementsByTagName("GROUP")[0].childNodes[0].nodeValue) + '</p>\n';
        accountsData += '</div>\n';
        accountsData += '<div class="line col5 ender active">\n';
        accountsData += '<span class="currency">$</span>\n';
        accountsData += '<p>' + (x[i].getElementsByTagName("SALES")[0].childNodes[0].nodeValue) + '</p>\n';
        accountsData += '</div>\n';
        accountsData += '</div>\n';
        accountsData += '</div>\n';
    }

    return accountsData;

}


$(document).on("click", "[id^='group_'], [id^='status_'], [id^='producttheme_'],[id^='theme_'], [id^='pricelevel_'], [id^='brand_'],[id^='cpromo_'], [id^='promo_'], [id^='autotm3_']", function (e) {
    //categoryClick

    G_itemsFilterCalled = false;
    G_accountsFilterCalled = false;

    var id = $(this).attr('id');

    var id_o = id.substring(id.lastIndexOf("_") + 1); // Everything after "_"
    var id_a = id.substring(0, id.indexOf("_")); // Everything before "_"

    id = id_a + "_all";

   
   

});


