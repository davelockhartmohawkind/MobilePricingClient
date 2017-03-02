var OPEs = [];

var inbox = 0;
var inprocess = 0;
var completed = 0;

var appstate = 'opes'; // Ovverrides state in functions.js
var targetOPE = {};

var G_opeAccounts_column_id = "dateCreated";
var G_opeAccounts_section;
var G_opeAccounts_order = "DESC";
var G_opeAccounts_targetColumn = "col6";
var G_opeAccountsFilterCalled = false;
var G_opeAccount_index = 0;



// OPE BINDINGS


// OPE FUNCTIONS

var handleBranchSelect = function (content) {
    //do something
    var testme = content;

     debugger
    if (content) {

        $("#theBody").removeClass('mpa_login');
        if ($("#theBody").hasClass('mpa_app') == false) {
            $("#theBody").addClass('mpa_app');
        }

        $("#theBody").html(content);


        if (doOnSelectBranchReady) {
            doOnSelectBranchReady();
        }

    }
}

var calculateOPEClick = function (increment) {
    //console.log('Increment: '+increment);
    var value = $('#ope_value').html();
    //console.log('Value: '+value);
    var newValue = parseFloat(value.split(' ')[1]);


    // Add increment to current slide value
    // Set display value 
    $('#ope_value').html('$ ' + (newValue + increment).toFixed(2));
    // Set slider
    $("#ope_slider").slider('option', 'value', (newValue + increment).toFixed(2));



};

var getOPECount = function () {
    debugger;
    //Data loading function with set delay
    lockoutInput();
    showProcessing('#app_loading');

    $.post(
        G_AbsoluteUri + 'Home/getOPECount',
        { UserName: welcomeUserName, Domain: "NA", Password: welcomePassword, UserNameAs: welcomeUserNameAs, UserRole: G_userRole },

        function (content) {

            releaseLockout(true);
            var responseObject = JSON.parse(content);
            if (responseObject.responseCode == "SUCCESS") {
                
                inbox = responseObject.inboxCount;
                if (inbox <= 0) {
                    $('#load_OPEs').find('.agocon').removeClass('notify');                                                            
                }
                else {                    
                    $('#load_OPEs').find('.agocon').addClass('notify');
                    $('#load_OPEs').find('.agocon').html(inbox);                    
                }
            }
            else {
                if (responseObject.RememberMeCookie == 'INVALID') {
                    logOut();
                    return;
                }
                $("#alertMessageContent").html(responseObject.responseMessage);
                goModal('#alertMessageBox');
                releaseLockout(true);
            }

        }
        );



};

var getOPEbyID = function (id) {
    return $.grep(OPEs, function (e) { return e.itemIndex == id; });
};

var getOPEs = function (sqlCall) {    
    debugger;    

    // Check if OPE array already has data, if not make the server call
    if (sqlCall)
    {        
        //Data loading function with set delay
        lockoutInput();
        showProcessing('#app_loading');

        $.post(
                G_AbsoluteUri + 'Home/getOPEAccounts',
                { UserName: welcomeUserName, Domain: "NA", Password: welcomePassword, UserNameAs: welcomeUserNameAs, UserRole: G_userRole },
                handleOPEAccountsResult
            );        
    }
    else {
        renderOPEList('opecreated');
    }
    

};

var refreshOPEs = function (headerid) {

    lockoutInput();
    showProcessing('#data_loading');

    $.post(
        G_AbsoluteUri + 'Home/getOPEAccounts',
        { UserName: welcomeUserName, Domain: "NA", Password: welcomePassword, UserNameAs: welcomeUserNameAs, UserRole: G_userRole, Vid: headerid },
        handleOPEAccountsResult
        );  

};

var getTargetOPEUpdates = function (headerid) {
    
    $.post(
        G_AbsoluteUri + 'Home/getOPEAccounts',
        { UserName: welcomeUserName, Domain: "NA", Password: welcomePassword, UserNameAs: welcomeUserNameAs, UserRole: G_userRole, Vid: headerid },
        handleTargetOPEResult
        );  

};

var handleOPEAccountsResult = function(content) {    
    //debugger;
    releaseLockout(true);

    try {
        
        if (content != undefined && content != null && content != "") {

            var responseObject = JSON.parse(content);
            if (responseObject.AppVersion != G_appVersion) {                
                window.location.href = G_Home;
                return;
            }

            if (responseObject.responseCode == "SUCCESS") {
                OPEs = responseObject.OPEList;
                //console.log(JSON.stringify(OPEs));
                //console.log('Number of OPEs: ' + OPEs.length);
                renderOPEList();
            }
            else {

                $("#alertMessageContent").html(responseObject.responseMessage);
                goModal('#alertMessageBox');
                return;
            }

        }

    } catch (err) {
        // debugger
        logError(welcomeUserName, "handleOPEAccountsResult", err.message + ' : ' + err.stack);
        $("#alertMessageContent").html("Oops... System Error.. Please try again later.");
        goModal('#alertMessageBox');
    }
}

var handleTargetOPEResult = function (content) {
    debugger;
    releaseLockout(true);

    try {

        if (content != undefined && content != null && content != "") {

            var responseObject = JSON.parse(content);
            if (responseObject.AppVersion != G_appVersion) {
                window.location.href = G_Home;
                return;
            }
            if (responseObject.responseCode == "SUCCESS") {
                //Update targetOPEs array
                targetOPE = responseObject.OPEList[0];
                targetOPE.itemIndex = G_opeAccount_index;
                var id = OPEs.findIndex(x => x.itemIndex == G_opeAccount_index);
                OPEs[id] = targetOPE;

                //Call RenderOPEList
                renderOPEList();
                renderOPE(G_opeAccount_index, G_userRole);
            }
            else {

                $("#alertMessageContent").html(responseObject.responseMessage);
                goModal('#alertMessageBox');
                return;
            }

        }

    } catch (err) {
        // debugger
        logError(welcomeUserName, "handleTargetOPEResult", err.message + ' : ' + err.stack);
        $("#alertMessageContent").html("Oops... System Error.. Please try again later.");
        goModal('#alertMessageBox');
    }
}

var getConsoleMessage = function (target, string) {
    //console.log(target);
    //console.log('GetConsoleMessage - welcomeFullName:' + welcomeFullName + ',welcomeFullNameAs:' + welcomeFullNameAs);

    var msg = '';
    //debugger;

    if (welcomeFullNameAs != "") {
        msg = '<h4 class="single">Working with &nbsp;<b>' + welcomeFullNameAs + '</b> Select a customer to begin.</h4>';
    } else {
        msg = '<h4 class="single"><b>Welcome&nbsp;' + welcomeFullName + '</b> Select a customer to begin.</h4>';
    }



    switch (target) {
        case "welcome":
            msg = '<h4 class="single"><b>Welcome ' + welcomeFullNameAs + '.</b> Select a customer to begin.</h4>';
            current_MessageTimeout = 0;
            break;

        case "opes":
            msg = '<h4 class="single"><b>Welcome ' + welcomeFullNameAs + '.</b> Select an OPE to begin.</h4>';
            current_MessageTimeout = 0;
            break;

        case "ope":


            msg = '<div class="console_col1">';
            msg += '<h4><b>' + targetOPE.account.name + '</b></h4>';

            msg += '<h5>' + targetOPE.account.number + ' - Line ' + targetOPE.orderLine + '</h5>';
            msg += '</div>';

            msg += '<div class="console_col2">';

            msg += '<p><b>' + targetOPE.account.phone + '</b> <br />';
            msg += '<span class="cpl_address">' + targetOPE.account.streetAddress + ' ' + targetOPE.account.city + ', ' + targetOPE.account.state + ' ' + targetOPE.account.zip + '</span> <br />';
            msg += 'Customer Group: ' + targetOPE.account.customerGroup + '</p>';
            msg += '</div>';

            current_MessageTimeout = 0;


            break;



        case "accountCPL":

            msg = '<div class="console_col1">';
            //kkk
            debugger;
            msg += '<h4><b>' + accounts_Array[current_AccountI].name + '</b></h4>';

            msg += '<div class="staus_widget" style="float:right;">';
            msg += '<span class="status_icon revising"></span>Revising </span>';
            msg += '</div>';

            msg += '<h5>' + current_Account + '</h5>';
            msg += '</div>';

            msg += '<div class="console_col2">';

            msg += '<h6>Warehouse Pricing</h6>';

            msg += '<p><b>(567) 342-5098</b> <br />';
            msg += '<span class="cpl_address">DBA GREGORY\'S PAINT & FLOORING 10350 MEDLOCK BRG RD STE 201, JOHNS CREEK, GA 30097</span> <br />';
            msg += 'Customer Group: ' + accounts_Array[current_AccountI].group + '</p>';
            msg += '</div>';




            current_MessageTimeout = 0;

            break;
        case "price_revised":

            var ispromo = '';
            //console.log(accountCPL_Array[line_target+1].indicator);
            /*if (accountCPL_Array[line_target+1].indicator == 'promo') {
              ispromo = 'promotional ';
            }*/

            msg = '<h4 class="single"><b>The ' + ispromo + 'price for ' + accountCPL_Array[line_target].style_name + ' has been updated.</b></h4>';
            // Set timeout for this message to be displayed
            current_MessageTimeout = 2000; // Set timeout for 2 seconds
            break;

        case "groupedit":
            msg = '<h4 class="single"><b>Group edits have been applied.</b></h4>' + string;
            current_MessageTimeout = 4000; // Set timeout for 4 seconds

            break;

        case "groupexpire":
            msg = '<h4 class="single"><b>The selected products are set to expire:</b></h4>' + string;
            current_MessageTimeout = 4000; // Set timeout for 4 seconds

            break;

        case "addProducts":
            msg = '<div class="console_col1">\n';
            msg += '<h4><b>Available Products for South Side Carpet:</b></h4>'; // Replace South Side Carpet with variable of account name
            msg += '<h5>Select the products you wish to add to the CPL from the list below.</h5>';
            msg += '</div>';
            current_MessageTimeout = 0;

            break;

        case "newadded":
            msg = '<h4 class="single"><b>New Products have been added to your CPL.</b></h4>' + string;
            current_MessageTimeout = 4000; // Set timeout for 4 seconds
            // Set current message to return to default message for the CPL section
            current_Message = 'accountCPL';
            break;

        case "modal_addproducts":
            //msg = '<h4 class="single"><b>No new products were added.</b></h4>'+string;
            msg = '';
            current_MessageTimeout = 500;
            // Set current message to return to default message for the CPL section
            current_Message = 'accountCPL';

            //Relaunch modal for add products
            goModal('#accountCPL_addproducts');
            //setTimeout(function() { goModal('#accountCPL_addproducts'); }, 2000);

            break;


        default:
            msg = '<h4 class="single"><b>Welcome ' + user + '.</b> Select a customer to begin.</h4>';
            current_MessageTimeout = 0;
    }

    //console.log('Current Message: '+current_Message+'  == Current Target: '+target+' || Current Timeout: '+current_MessageTimeout);

    if (current_Message == target) {
        // We're good keep same message in place
        setTimeout(function () { getConsoleMessage(target, ''); }, current_MessageTimeout);
    }
    else {
        $('#main_console').delay(400).animate({ 'opacity': 0 }, 300, function () {
            $('.m_console_data').html(msg);
            $('#main_console').animate({ 'opacity': 1 }, 300);

            if (current_MessageTimeout == 0) {
                current_Message = target;

            }
            else {
                //setTimeout(function() { , ''getConsoleMessage(current_Message, ''); current_Message = target; current_MessageTimeout = 0; }, current_MessageTimeout);
                //console.log(current_Message
                var str = current_Message.toString();
                setTimeout(function () { getConsoleMessage(str, ''); }, current_MessageTimeout);

                current_Message = target;
                current_MessageTimeout = 0;

            }




        });
    }


}

var renderOPEList = function (sort) {    
    //console.log(typeof OPEs);

    debugger;
    var inbox_html = '';
    var inprocess_html = '';
    var completed_html = '';

    // Reset count values
    inbox = 0;
    inprocess = 0;
    completed = 0;


    //Use column value to sort OPEs
    switch (sort) {
        case 'opeorder':
            OPEs.sort(propComparator('orderNo'));
            break;

        case 'opeline':
            OPEs.sort(propComparator('orderLine'));
            break;

        case 'opename':
            OPEs.sort(prop2Comparator('account', 'name'));
            break;

        case 'openumber':
            OPEs.sort(prop2Comparator('account', 'number'));
            break;

        case 'opegroup':
            OPEs.sort(prop2Comparator('account', 'customerGroup'));
            break;

        case 'opecreated':
            OPEs.sort(propComparator('orderDate'));
            break;

        case 'reverse':
            OPEs.reverse();
            break;

        default:
            OPEs.sort(propComparator('orderDate'));
            OPEs.reverse();
            $('.opesort[data-sort="sort_opecreated"]').addClass('active');

    }




    // For each OPE evaluate status, set wrap target, datapanel and content
    $.each(OPEs, function (key, val) {
        //debugger;
        //console.log('OPE vid: '+val.vid);
        //console.log('OPE Status: '+val.status);
        var wrap;
        var target;
        var html = '';
        
        // Split OPEs into separate arrays (inbox, in process and completed) // Count based on status
        if (val.itemVisible == "true") {
            switch (val.status) {
                case 'inbox':
                    //OPEs_inbox.push(val);
                    inbox++;
                    break;
                case 'inprocess':
                    //OPEs_inprocess.push(val);
                    inprocess++;
                    break;
                case 'completed':
                    //OPEs_completed.push(val);
                    completed++;
                    break;
            }           
        }
        

        //console.log('ID: '+val.id+' Account Name: '+val.account.name);

        //html += '<div class="m_li container fluid" id="lineid_' + val.itemIndex + '">'; // Use unique id to modify OPE
        html += '<div class="m_li container fluid" id="lineid_' + val.itemIndex + '"'; // Use unique id to modify OPE
        if (val.itemVisible == "true") {
            html += ' style="display:block"  >\n';
        }
        else {
            html += ' style="display:none"  >\n';
        }
        html += '<div class="container custom">';
        html += '<div class="starter line col1">';
        html += '<p>' + val.orderNo + '</p>';
        html += '</div>';
        html += '<div class="line col2">';
        html += '<p>' + val.orderLine + '</p>';
        html += '</div>';
        html += '<div class="line col3">';
        html += '<p>' + val.account.name + '</p>';
        html += '</div>';
        html += '<div class="line col4">';
        html += '<p>' + val.account.number + '</p>';
        html += '</div>';
        html += '<div class="line col5">';
        html += '<p>' + val.account.customerGroup + '</p>';
        html += '</div>';
        html += ' <div class="line col6 ender active">';
        html += '<p>' + val.dateCreated + '</p>';
        html += '</div>';
        html += '</div>';

        html += '</div>';









        switch (val.status) {
            case 'inbox':
                wrap = $('#inbox');
                target = $('#inbox_datapanel');
                inbox_html += html;
                target.removeClass('eset');
                $('#inbox_n').html(' (' + inbox + ')');

                break;

            case 'inprocess':
                wrap = $('#inprocess');
                target = $('#inprocess_datapanel');

                // Add stats bar for OPEs in process
                //html += '<div class="statbar">';
                html += '<div class="statbar"';
                if (val.itemVisible == "true") {
                    html += ' style="display:block"  >\n';
                }
                else {
                    html += ' style="display:none"  >\n';
                }
                html += '<div class="container">';

                html += '<div class="statbox">';
                // Use val.approvers and stage to determine steps in process
                var steps = 0;
                var current_step = 0;
                var current_approver;

                
                for (var key in val.approvers) {

                    if (val.approvers.hasOwnProperty(key)) {
                        //console.log('Key: '+key+' Stage: '+val.stage);                        
                        if (val.stage == key) {
                            current_step = steps;
                            current_approver = val.approvers[key];
                            //console.log('Current approver: '+current_approver.name);
                            break;
                        }
                        ++steps;
                    }
                }

                //console.log('Steps: '+steps+' Current Step: '+current_step);

                for (i = 0; i < val.steps; i++) {
                    var opecomplete = '';
                    if (i < current_step) {
                        opecomplete = " complete";
                    }
                    html += '<div class="staticator' + opecomplete + '"></div>';
                }

                html += '</div>';

                html += '<p><span class="stat_label">NEXT APPROVER:</span> <a href="mailto:' + current_approver.email + '?subject=Regarding an Order Price Exception in process" target="_blank">' + current_approver.label + ', ' + current_approver.name + '</a></p>';


                html += '</div>';
                html += '</div>';



                inprocess_html += html;
                target.removeClass('eset');
                $('#inprocess_n').html(' (' + inprocess + ')');

                break;

            case 'completed':
                wrap = $('#completed');
                target = $('#completed_datapanel');
                completed_html += html;
                target.removeClass('eset');

                break;
        }






    });

    //console.log('Number of OPEs in inbox: '+OPEs_inbox.length);


    if (inbox <= 0) {
        $('#load_OPEs').find('.agocon').removeClass('notify');

        $('#inbox_datapanel').removeClass('eset');
        $('#inbox_n').html();
        $('#inbox').find('.sort').removeClass('active');
        inbox_html = '<div class="container"><h4 class="linemsg">Currently, there are no OPEs that require your attention.</h4></div>';
    }
    else {
        //console.log('Yes. There are OPEs in your inbox.');
        $('#load_OPEs').find('.agocon').addClass('notify');
        $('#load_OPEs').find('.agocon').html(inbox);

        $('#inbox_datapanel').removeClass('eset');
    }
    $('#inbox_datapanel').html(inbox_html);


    if (inprocess <= 0) {
        $('#inprocess_datapanel').addClass('eset');
        $('#inprocess_n').html();
        $('#inprocess').find('.sort').removeClass('active');
        inprocess_html = '<div class="container"><h4 class="linemsg">Currently, there are no OPEs that are being processed.</h4></div>';
    }
    else {
        $('#inprocess_datapanel').removeClass('eset');
    }
    $('#inprocess_datapanel').html(inprocess_html);


    if (completed <= 0) {
        $('#completed_datapanel').addClass('eset');
        $('#completed').find('.sort').removeClass('active');
        completed_html = '<div class="container"><h4 class="linemsg">Currently, there are no OPEs that are considered completed.</h4></div>';
    }
    else {
        $('#completed_datapanel').removeClass('eset');
    }
    $('#completed_datapanel').html(completed_html);


    
    debugger;
    // Determine which view to display if not already set    
    if (!sort) {
        $('ul.tabs li').removeClass('active');

        if (inbox > 0) {
            // Set tab to active
            $('ul.tabs li[data-tab="inbox"]').addClass('active');
            $('.tabwrap:visible').fadeOut(300);
            $('#inbox').fadeIn(300);
        }
        else {
            if (inprocess > 0) {
                $('ul.tabs li[data-tab="inprocess"]').addClass('active');
                $('.tabwrap:visible').fadeOut(300);
                $('#inprocess').fadeIn(300);
            }
            else {
                $('ul.tabs li[data-tab="completed"]').addClass('active');
                $('.tabwrap:visible').fadeOut(300);
                $('#completed').fadeIn(300);
            }
        }

    }





};

var renderOPE = function (id, role) {
    debugger;
    //var OPEdata = getOPEbyID(id);
    //targetOPE = OPEdata[0];


    //Render varies depending on role, OPE status and product type
    //console.log('Name: '+targetOPE.account.name);
    //console.log('Role: '+role); // Role assigned at login - hard coded global variable for this demo
    //console.log('Status: '+targetOPE.status); // Status pulled from OPE JSON
    //console.log('product Type: '+targetOPE.product.type); // Status pulled from OPE JSON - #ope_columns and #ope_datapanel are built from this


    var setTable = function (view, type) {
        var th = '';
        var details = '';
        //console.log(view);

        switch (view) {
            case 'Soft':
                if (type != 'Pad') {

                    // Set table column widths with soft_view class
                    $('#ope').removeClass('all_view');
                    $('#ope').addClass('soft_view');
                    // Set table header
                    th += '<div class="container fluid fullh">';
                    th += '<div class="container custom fullh">';
                    th += '<div class="sort starter col1">';
                    th += '<h5>Style #<h5>';
                    th += '</div>';
                    th += '<div class="sort col2">';
                    th += '<h5>Style Name<h5>';
                    th += '</div>';
                    th += '<div class="sort col3">';
                    th += '<h5>Size<h5>';
                    th += '</div>';
                    th += '<div class="sort col4">';
                    th += '<h5>Brand<h5>';
                    th += '</div>';
                    th += '<div class="sort col5">';
                    th += '<h5>Price on File Roll<h5>';
                    th += '</div>';
                    th += '<div class="sort col6">';
                    th += '<h5>Price on File Cut<h5>';
                    th += '</div>';
                    th += '<div class="sort col7">';
                    th += '<h5>Requested Price<h5>';
                    th += '</div>';
                    th += '<div class="sort col8 ender">';
                    th += '<h5>Order Qty<h5>';
                    th += '</div>';
                    th += '</div>';
                    th += '</div>';

                    // Set details //targetOPE.product.type
                    details += '<div class="m_li container fluid even active">';
                    details += '<div class="container custom">';
                    details += '<div class="starter line col1">';
                    details += '<p>' + targetOPE.product.styleNo + '</p>';
                    details += '</div>';
                    details += '<div class="line col2">';
                    details += '<p>' + targetOPE.product.styleName + '</p>';
                    details += '</div>';
                    details += '<div class="line col3">';
                    details += '<p>' + targetOPE.product.size + '</p>';
                    details += '</div>';
                    details += '<div class="line col4">';
                    details += '<p>' + targetOPE.product.brand + '</p>';
                    details += '</div>';
                    details += '<div class="line col5">';
                    details += '<span class="currency">$</span>';
                    details += '<p>' + targetOPE.price.POFRoll.toFixed(2) + '</p>';
                    details += '</div>';
                    details += '<div class="line col6">';
                    details += '<span class="currency">$</span>';
                    details += '<p>' + targetOPE.price.POFCut.toFixed(2) + '</p>';
                    details += '</div>';
                    details += '<div class="line col7">';
                    details += '<span class="currency">$</span>';
                    details += '<p id="ope_requested">' + targetOPE.price.requested.toFixed(2) + '</p>';
                    details += '</div>';
                    details += '<div class="line col8 ender">';
                    details += '<p>' + targetOPE.qty + '</p>';
                    details += '</div>';
                    details += '</div>';
                    details += '</div>';

                    details += '<div class="calpanel container fluid">';
                    details += '<div class="container custom">';
                    details += '<div class="p_data">';
                    details += '<div class="line colx">';
                    details += '<div class="ope_info">';

                    //// Set product details - NOTE: key must match what label should be!
                    //for (var key in targetOPE.product.details) {
                    //    //console.log(key);
                    //    //console.log(targetOPE.product.details[key]);
                    //    details += '<p><span class="info_label">' + key + ':</span> <span class="info_data">' + targetOPE.product.details[key] + '</span></p>';
                    //}
                    details += '<p><span class="info_label">Color Name:</span> <span class="info_data">' + targetOPE.product.colorName + '</span></p>';
                    details += '<p><span class="info_label">Backing:</span> <span class="info_data">' + targetOPE.product.backing + '</span></p>';
                    details += '<p><span class="info_label">Standard Roll Size:</span> <span class="info_data">' + targetOPE.product.standardRollSize + '</span></p>';
                    details += '<p><span class="info_label">Rebate:</span> <span class="info_data">' + targetOPE.product.rebate + '%</span></p>';
                    details += '<p><span class="info_label">Terms:</span> <span class="info_data">' + targetOPE.product.terms + '</span></p>';
                    details += '<p><span class="info_label">FOB Warehouse:</span> <span class="info_data">' + targetOPE.product.fobWarehouse + '</span></p>';
                    details += '<p><span class="info_label">Price:</span> <span class="info_data">' + targetOPE.product.priceType + '</span></p>';
                    details += '</div>';
                    details += '</div>';


                    // Set price points based on userrole
                    var endclass = 'cpl_TM3';

                    details += '<div class="line col5">';

                    details += '<div class="cpl_TM1">';
                    details += '<span class="currency">$</span>';
                    details += '<p>' + targetOPE.price.TM1Roll.toFixed(2) + '</p>';
                    details += '</div>';
                    details += '<div class="cpl_TM2">';
                    details += '<span class="currency">$</span>';
                    details += '<p>' + targetOPE.price.TM2Roll.toFixed(2) + '</p>';
                    details += '</div>';

                    if (G_userRole == 'DM' || G_userRole == 'RVP' || G_userRole == 'BG') {
                        endclass = 'cpl_TM2';
                    }

                    details += '<div class="' + endclass + '">';
                    details += '<span class="currency">$</span>';
                    details += '<p>' + targetOPE.price.TM3Roll.toFixed(2) + '</p>';
                    details += '</div>';
                                        
                    // Condition for DM
                    if ((G_userRole == 'DM' || G_userRole == 'RVP' || G_userRole == 'BG') && targetOPE.price.DMRoll) {
                        if (G_userRole == 'RVP' || G_userRole == 'BG') {
                            endclass = 'cpl_TM2';
                        }
                        else {
                            endclass = 'cpl_TM3';
                        }
                        details += '<div class="' + endclass + '">';
                        details += '<span class="currency">$</span>';
                        details += '<p>' + targetOPE.price.DMRoll.toFixed(2) + '</p>';
                        details += '</div>';
                    }

                    // Condition for RVP
                    if ((G_userRole == 'RVP' || G_userRole == 'BG') && targetOPE.price.RVPRoll) {
                        endclass = 'cpl_TM3';
                        details += '<div class="' + endclass + '">';
                        details += '<span class="currency">$</span>';
                        details += '<p>' + targetOPE.price.RVPRoll.toFixed(2) + '</p>';
                        details += '</div>';
                    }

                    details += '</div>';



                    details += '<div class="line col6">';
                    details += '<div class="cpl_TM1">';
                    details += '<span class="currency">$</span>';
                    details += '<p>' + targetOPE.price.TM1Cut.toFixed(2) + '</p>';
                    details += '</div>';
                    details += '<div class="cpl_TM2">';
                    details += '<span class="currency">$</span>';
                    details += '<p>' + targetOPE.price.TM2Cut.toFixed(2) + '</p>';
                    details += '</div>';

                    if (G_userRole == 'DM' || G_userRole == 'RVP' || G_userRole == 'BG') {
                        endclass = 'cpl_TM2';
                    }

                    details += '<div class="' + endclass + '">';
                    details += '<span class="currency">$</span>';
                    details += '<p>' + targetOPE.price.TM3Cut.toFixed(2) + '</p>';
                    details += '</div>';

                    // Condition for DM
                    if ((G_userRole == 'DM' || G_userRole == 'RVP' || G_userRole == 'BG') && targetOPE.price.DMCut) {
                        if (G_userRole == 'RVP' || G_userRole == 'BG') {
                            endclass = 'cpl_TM2';
                        }
                        else {
                            endclass = 'cpl_TM3';
                        }
                        details += '<div class="' + endclass + '">';
                        details += '<span class="currency">$</span>';
                        details += '<p>' + targetOPE.price.DMCut.toFixed(2) + '</p>';
                        details += '</div>';
                    }

                    // Condition for RVP
                    if ((G_userRole == 'RVP' || G_userRole == 'BG') && targetOPE.price.RVPCut) {
                        endclass = 'cpl_TM3';
                        details += '<div class="' + endclass + '">';
                        details += '<span class="currency">$</span>';
                        details += '<p>' + targetOPE.price.RVPCut.toFixed(2) + '</p>';
                        details += '</div>';
                    }

                    details += '</div>';




                    details += '<div class="line col7">';
                    details += '<div class="cpl_TM1">';
                    details += '<p>TM1</p>';
                    details += '</div>';
                    details += '<div class="cpl_TM2">';
                    details += '<p>TM2</p>';
                    details += '</div>';

                    if (G_userRole == 'DM' || G_userRole == 'RVP' || G_userRole == 'BG') {
                        endclass = 'cpl_TM2';
                    }
                    details += '<div class="' + endclass + '">';
                    details += '<p>TM3</p>';
                    details += '</div>';

                    // Condition for DM
                    if ((G_userRole == 'DM' || G_userRole == 'RVP' || G_userRole == 'BG') && targetOPE.price.DMCut) {
                        if (G_userRole == 'RVP' || G_userRole == 'BG') {
                            endclass = 'cpl_TM2';
                        }
                        else {
                            endclass = 'cpl_TM3';
                        }
                        details += '<div class="' + endclass + '">';
                        details += '<p>DM</p>';
                        details += '</div>';
                    }

                    // Condition for RVP
                    if ((G_userRole == 'RVP' || G_userRole == 'BG') && targetOPE.price.RVPCut) {
                        endclass = 'cpl_TM3';
                        details += '<div class="' + endclass + '">';
                        details += '<p>RVP</p>';
                        details += '</div>';
                    }

                    details += '</div>';

                    // Set price points based on userrole : END


                    // Set user controls based on userrole
                    details += '<div class="line col8 ender">';
                    details += '<div class="cpl_editbtns">';
                    
                    // If targetOPE.status == 'completed', don't display controls
                    if (targetOPE.status !== 'completed') {

                        //disable controls
                        var disable = '';
                        //if (targetOPE.status == 'inprocess')                    
                        if (targetOPE.stage != G_userRole) {
                            disable = ' disabled';
                        }


                        if (G_userRole == 'DM' || G_userRole == 'RVP' || G_userRole == 'BG') {

                            details += '<a href="javascript:approveOPE(' + id + ');" id="ope_approve" class="btn approve' + disable + '">Approve <br><span class="min">Requested Price</span></a>';

                            details += '<a href="javascript:denyOPE(' + id + ');" id="ope_deny" class="btn deny' + disable + '">Deny <br><span class="min">Requested Price</span></a>';


                        }
                        else {


                            details += '<a href="javascript:requestApprovalOPE(' + id + ');" id="ope_approve" class="btn approve' + disable + '">Approve <br><span class="min">Requested Price</span></a>';

                            details += '<a href="javascript:requestChangePOF(' + id + ');" id="ope_pof" class="btn change' + disable + '">Change <br><span class="min">To Price On File</span></a>';

                            details += '<a href="javascript:requestEditOPE(' + id + ');" id="ope_edit" class="btn edit' + disable + '">Edit <br><span class="min">Requested Price</span></a>';


                        }


                    }



                    details += '</div>';
                    details += '</div>';

                    details += '<div class="sm_shim"></div>';


                    // Set user controls based on userrole : END



                    // Set status base on targetOPE.status
                    // Use targetOPE.approvers and targetOPE.stage to determine steps in process
                    var steps = 0;
                    var current_step = 0;
                    //var current_approver;

                    details += '<div class="line colx">';
                    details += '<div class="ope_info">';
                    details += '<h6>Status</h6>';

                    details += '<div class="status">';
                                        
                    // Cycle once to get current step and current approver
                    for (var key in targetOPE.approvers) {
                        if (targetOPE.approvers.hasOwnProperty(key)) {
                            if (targetOPE.stage == key) {
                                current_step = steps;
                                //current_approver = targetOPE.approvers[key];
                                //console.log('Current approver: '+current_approver.name);                                
                            }
                            ++steps;
                        }
                    }
                    
                    
                    for (i = 0; i < targetOPE.steps; i++) {
                        //console.log('Access by index: '+JSON.stringify(targetOPE.approvers[Object.keys(targetOPE.approvers)[i]]));
                        var iope = targetOPE.approvers[Object.keys(targetOPE.approvers)[i]];
                        var opecomplete = '';
                        var line = '';

                        if (i < current_step) {                            
                            opecomplete = ' status_complete';
                        }
                        else if (i == current_step) {
                            //Check approver action to determine if the OPE request was approved or denied                            
                            if (iope.action && iope.action.toLowerCase() === 'deny') {
                                opecomplete = ' status_denied';
                            }
                            else if (iope.action && iope.action.toLowerCase() === 'approve') {
                                opecomplete = ' status_complete';
                            }
                            else{
                                opecomplete = ' status_todo';
                                line = ' disabled';
                            }
                        }
                        else {
                            opecomplete = ' status_todo disabled';
                            line = ' disabled';
                        }


                        details += '<div class="status_block">';
                        details += '<div class="checker' + opecomplete + '">';
                        details += '<div class="icon_circle"></div>';
                        details += '<h6>' + iope.label + '</h6>';

                        // Include email address link if the link isn't disabled
                        if (opecomplete.indexOf('disabled') !== -1) {
                            details += '<p>' + iope.name + '</p>';
                        }
                        else {
                            details += '<p><a href="mailto:' + iope.email + '?subject=Regarding an Order Price Exception" target="_blank">' + iope.name + '</a></p>';

                        }

                        details += '</div>';
                        details += '</div>';

                        //console.log('Index: '+i);
                        if (i !== (targetOPE.steps - 1)) {
                            details += '<div class="status_gap">';
                            details += '<div class="tline' + line + '"></div>';
                            details += '</div>';
                        }


                    }

                    details += '</div>';

                    details += '</div>';
                    details += '</div>';

                    // Set status base on targetOPE.status END

                    // Set comments based on targetOPE.comments
                    details += '<div class="line colx2">';
                    details += '<div class="ope_info divider">';
                    details += '<h6>Comments</h6>';

                    details += '<div class="comments">';
                    
                    for (var key in targetOPE.comments) {

                        details += '<div class="comment_line">';
                        details += '<div class="ccol1">';
                        details += targetOPE.comments[key].date;
                        details += '</div>';
                        details += '<div class="ccol2">';
                        details += targetOPE.comments[key].time;
                        details += '</div>';
                        details += '<div class="ccol3">';
                        details += targetOPE.comments[key].action;
                        details += '</div>';
                        details += '<div class="ccol4">';
                        details += targetOPE.comments[key].person;
                        details += '</div>';
                        details += '<div class="ccol5">';
                        details += targetOPE.comments[key].comment;
                        details += '</div>';
                        details += '<div class="clear"></div>';
                        details += '</div>';

                    }

                    details += '</div>';
                    details += '</div>';
                    details += '</div>';
                    // Set comments based on targetOPE.comments : END

                    details += '<div class="clear"></div>';
                    details += '</div>';
                    details += '</div>';
                    details += '</div>';

                }
                else
                {
                    $('#ope').removeClass('soft_view');
                    $('#ope').addClass('all_view');
                    // Set table header
                    th += '<div class="container fluid fullh">';
                    th += '<div class="container custom fullh">';
                    th += '<div class="sort starter col1">';
                    th += '<h5>Style #<h5>';
                    th += '</div>';
                    th += '<div class="sort col2">';
                    th += '<h5>Style Name<h5>';
                    th += '</div>';
                    th += '<div class="sort col3">';
                    th += '<h5>Size<h5>';
                    th += '</div>';
                    th += '<div class="sort col4">';
                    th += '<h5>Brand<h5>';
                    th += '</div>';
                    th += '<div class="sort col5">';
                    th += '<h5>Price on File<h5>';
                    th += '</div>';
                    th += '<div class="sort col6">';
                    th += '<h5>Requested Price<h5>';
                    th += '</div>';
                    th += '<div class="sort col7 ender">';
                    th += '<h5>Order Qty<h5>';
                    th += '</div>';
                    th += '</div>';
                    th += '</div>';


                    // Set details //targetOPE.product.type
                    details += '<div class="m_li container fluid even active">';
                    details += '<div class="container custom">';
                    details += '<div class="starter line col1">';
                    details += '<p>' + targetOPE.product.styleNo + '</p>';
                    details += '</div>';
                    details += '<div class="line col2">';
                    details += '<p>' + targetOPE.product.styleName + '</p>';
                    details += '</div>';
                    details += '<div class="line col3">';
                    details += '<p>' + targetOPE.product.size + '</p>';
                    details += '</div>';
                    details += '<div class="line col4">';
                    details += '<p>' + targetOPE.product.brand + '</p>';
                    details += '</div>';
                    details += '<div class="line col5">';
                    details += '<span class="currency">$</span>';
                    details += '<p>' + targetOPE.price.POF.toFixed(2) + '</p>';
                    details += '</div>';
                    details += '<div class="line col6">';
                    details += '<span class="currency">$</span>';
                    details += '<p id="ope_requested">' + targetOPE.price.requested.toFixed(2) + '</p>';
                    details += '</div>';
                    details += '<div class="line col7 ender">';
                    details += '<p>' + targetOPE.qty + '</p>';
                    details += '</div>';
                    details += '</div>';
                    details += '</div>';

                    details += '<div class="calpanel container fluid">';
                    details += '<div class="container custom">';
                    details += '<div class="p_data">';
                    details += '<div class="line colx">';
                    details += '<div class="ope_info">';

                    //// Set product details - NOTE: key must match what label should be!
                    //for (var key in targetOPE.product.details) {
                    //    //console.log(key);
                    //    //console.log(targetOPE.product.details[key]);
                    //    details += '<p><span class="info_label">' + key + ':</span> <span class="info_data">' + targetOPE.product.details[key] + '</span></p>';
                    //}
                    details += '<p><span class="info_label">Color Name:</span> <span class="info_data">' + targetOPE.product.colorName + '</span></p>';
                    details += '<p><span class="info_label">Backing:</span> <span class="info_data">' + targetOPE.product.backing + '</span></p>';
                    details += '<p><span class="info_label">Standard Roll Size:</span> <span class="info_data">' + targetOPE.product.standardRollSize + '</span></p>';
                    details += '<p><span class="info_label">Rebate:</span> <span class="info_data">' + targetOPE.product.rebate + '%</span></p>';
                    details += '<p><span class="info_label">Terms:</span> <span class="info_data">' + targetOPE.product.terms + '</span></p>';
                    details += '<p><span class="info_label">FOB Warehouse:</span> <span class="info_data">' + targetOPE.product.fobWarehouse + '</span></p>';
                    details += '<p><span class="info_label">Price:</span> <span class="info_data">' + targetOPE.product.priceType + '</span></p>';
                    details += '</div>';
                    details += '</div>';



                    // Set price points based on userrole
                    var endclass = 'cpl_TM3';

                    details += '<div class="line col5">';

                    details += '<div class="cpl_TM1">';
                    details += '<span class="currency">$</span>';
                    details += '<p>' + targetOPE.price.TM1.toFixed(2) + '</p>';
                    details += '</div>';
                    details += '<div class="cpl_TM2">';
                    details += '<span class="currency">$</span>';
                    details += '<p>' + targetOPE.price.TM2.toFixed(2) + '</p>';
                    details += '</div>';

                    if (G_userRole == 'DM' || G_userRole == 'RVP' || G_userRole == 'BG') {
                        endclass = 'cpl_TM2';
                    }

                    details += '<div class="' + endclass + '">';
                    details += '<span class="currency">$</span>';
                    details += '<p>' + targetOPE.price.TM3.toFixed(2) + '</p>';
                    details += '</div>';

                    // Condition for DM
                    if ((G_userRole == 'DM' || G_userRole == 'RVP' || G_userRole == 'BG') && targetOPE.price.DM) {
                        if (G_userRole == 'RVP' || G_userRole == 'BG') {
                            endclass = 'cpl_TM2';
                        }
                        else {
                            endclass = 'cpl_TM3';
                        }
                        details += '<div class="' + endclass + '">';
                        details += '<span class="currency">$</span>';
                        details += '<p>' + targetOPE.price.DM.toFixed(2) + '</p>';
                        details += '</div>';
                    }

                    // Condition for RVP
                    if ((G_userRole == 'RVP' || G_userRole == 'BG') && targetOPE.price.RVP) {
                        endclass = 'cpl_TM3';
                        details += '<div class="' + endclass + '">';
                        details += '<span class="currency">$</span>';
                        details += '<p>' + targetOPE.price.RVP.toFixed(2) + '</p>';
                        details += '</div>';
                    }

                    details += '</div>';




                    details += '<div class="line col6">';
                    details += '<div class="cpl_TM1">';
                    details += '<p>TM1</p>';
                    details += '</div>';
                    details += '<div class="cpl_TM2">';
                    details += '<p>TM2</p>';
                    details += '</div>';

                    if (G_userRole == 'DM' || G_userRole == 'RVP' || G_userRole == 'BG') {
                        endclass = 'cpl_TM2';
                    }
                    details += '<div class="' + endclass + '">';
                    details += '<p>TM3</p>';
                    details += '</div>';

                    // Condition for DM
                    if ((G_userRole == 'DM' || G_userRole == 'RVP' || G_userRole == 'BG') && targetOPE.price.DM) {
                        if (G_userRole == 'RVP' || G_userRole == 'BG') {
                            endclass = 'cpl_TM2';
                        }
                        else {
                            endclass = 'cpl_TM3';
                        }
                        details += '<div class="' + endclass + '">';
                        details += '<p>DM</p>';
                        details += '</div>';
                    }

                    // Condition for RVP
                    if ((G_userRole == 'RVP' || G_userRole == 'BG') && targetOPE.price.RVP) {
                        endclass = 'cpl_TM3';
                        details += '<div class="' + endclass + '">';
                        details += '<p>RVP</p>';
                        details += '</div>';
                    }

                    details += '</div>';

                    // Set price points based on userrole : END



                    // Set user controls based on userrole
                    details += '<div class="line col7 ender">';
                    details += '<div class="cpl_editbtns">';

                    // If targetOPE.status == 'completed', don't display controls
                    if (targetOPE.status !== 'completed') {

                        //disable controls
                        var disable = '';
                        //if (targetOPE.status == 'inprocess')                    
                        if (targetOPE.stage != G_userRole) {
                            disable = ' disabled';
                        }

                        if (G_userRole == 'DM' || G_userRole == 'RVP' || G_userRole == 'BG') {

                            details += '<a href="javascript:approveOPE(' + id + ');" id="ope_approve" class="btn approve' + disable + '">Approve <br><span class="min">Requested Price</span></a>';

                            details += '<a href="javascript:denyOPE(' + id + ');" id="ope_deny" class="btn deny' + disable + '">Deny <br><span class="min">Requested Price</span></a>';

                        }
                        else {

                           
                            details += '<a href="javascript:requestApprovalOPE(' + id + ');" id="ope_approve" class="btn approve' + disable + '">Approve <br><span class="min">Requested Price</span></a>';

                            details += '<a href="javascript:requestChangePOF(' + id + ');" id="ope_pof" class="btn change' + disable + '">Change <br><span class="min">To Price On File</span></a>';

                            details += '<a href="javascript:requestEditOPE(' + id + ');" id="ope_edit" class="btn edit' + disable + '">Edit <br><span class="min">Requested Price</span></a>';


                        }


                    }



                    details += '</div>';
                    details += '</div>';

                    details += '<div class="sm_shim"></div>';


                    // Set user controls based on userrole : END



                    // Set status base on targetOPE.status
                    // Use targetOPE.approvers and targetOPE.stage to determine steps in process
                    var steps = 0;
                    var current_step = 0;
                    //var current_approver;

                    details += '<div class="line colx">';
                    details += '<div class="ope_info">';
                    details += '<h6>Status</h6>';

                    details += '<div class="status">';

                    
                    // Get current step and current approver
                    for (var key in targetOPE.approvers) {
                        if (targetOPE.approvers.hasOwnProperty(key)) {
                            if (targetOPE.stage == key) {
                                current_step = steps;
                                //current_approver = targetOPE.approvers[key];
                                //console.log('Current approver: '+current_approver.name);                                
                            }
                            ++steps;
                        }
                    }


                    for (i = 0; i < targetOPE.steps; i++) {

                        //console.log('Access by index: '+JSON.stringify(targetOPE.approvers[Object.keys(targetOPE.approvers)[i]]));
                        var iope = targetOPE.approvers[Object.keys(targetOPE.approvers)[i]];
                        var opecomplete = '';
                        var line = '';

                        if (i < current_step) {
                            opecomplete = ' status_complete';
                        }
                        else if (i == current_step) {
                            //Check approver action to determine if the OPE request was approved or denied                            
                            if (iope.action && iope.action.toLowerCase() === 'deny') {
                                opecomplete = ' status_denied';
                            }
                            else if (iope.action && iope.action.toLowerCase() === 'approve') {
                                opecomplete = ' status_complete';
                            }
                            else {
                                opecomplete = ' status_todo';
                                line = ' disabled';
                            }
                        }                        
                        else {
                            opecomplete = ' status_todo disabled';
                            line = ' disabled';
                        }

                        
                        details += '<div class="status_block">';
                        details += '<div class="checker' + opecomplete + '">';
                        details += '<div class="icon_circle"></div>';
                        details += '<h6>' + iope.label + '</h6>';
                        // Include email address link if the link isn't disabled
                        if (opecomplete.indexOf('disabled') !== -1) {
                            details += '<p>' + iope.name + '</p>';
                        }
                        else {
                            details += '<p><a href="mailto:' + iope.email + '?subject=Regarding an Order Price Exception" target="_blank">' + iope.name + '</a></p>';

                        }

                        details += '</div>';
                        details += '</div>';

                        //console.log('Index: '+i);
                        if (i !== (targetOPE.steps - 1)) {
                            details += '<div class="status_gap">';
                            details += '<div class="tline' + line + '"></div>';
                            details += '</div>';
                        }


                    }

                    details += '</div>';

                    details += '</div>';
                    details += '</div>';

                    // Set status base on targetOPE.status END

                    // Set comments based on targetOPE.comments
                    details += '<div class="line colx2">';
                    details += '<div class="ope_info divider">';
                    details += '<h6>Comments</h6>';

                    details += '<div class="comments">';
                    
                    for (var key in targetOPE.comments) {

                        details += '<div class="comment_line">';
                        details += '<div class="ccol1">';
                        details += targetOPE.comments[key].date;
                        details += '</div>';
                        details += '<div class="ccol2">';
                        details += targetOPE.comments[key].time;
                        details += '</div>';
                        details += '<div class="ccol3">';
                        details += targetOPE.comments[key].action;
                        details += '</div>';
                        details += '<div class="ccol4">';
                        details += targetOPE.comments[key].person;
                        details += '</div>';
                        details += '<div class="ccol5">';
                        details += targetOPE.comments[key].comment;
                        details += '</div>';
                        details += '<div class="clear"></div>';
                        details += '</div>';

                    }

                    details += '</div>';
                    details += '</div>';
                    details += '</div>';
                    // Set comments based on targetOPE.comments : END

                    details += '<div class="clear"></div>';
                    details += '</div>';
                    details += '</div>';
                    details += '</div>';

                }

                break;


            default:
                $('#ope').removeClass('soft_view');
                $('#ope').addClass('all_view');
                // Set table header
                th += '<div class="container fluid fullh">';
                th += '<div class="container custom fullh">';
                th += '<div class="sort starter col1">';
                th += '<h5>Style #<h5>';
                th += '</div>';
                th += '<div class="sort col2">';
                th += '<h5>Style Name<h5>';
                th += '</div>';
                th += '<div class="sort col3">';
                th += '<h5>Size<h5>';
                th += '</div>';
                th += '<div class="sort col4">';
                th += '<h5>Brand<h5>';
                th += '</div>';
                th += '<div class="sort col5">';
                th += '<h5>Price on File<h5>';
                th += '</div>';
                th += '<div class="sort col6">';
                th += '<h5>Requested Price<h5>';
                th += '</div>';
                th += '<div class="sort col7 ender">';
                th += '<h5>Order Qty<h5>';
                th += '</div>';
                th += '</div>';
                th += '</div>';


                // Set details //targetOPE.product.type
                details += '<div class="m_li container fluid even active">';
                details += '<div class="container custom">';
                details += '<div class="starter line col1">';
                details += '<p>' + targetOPE.product.styleNo + '</p>';
                details += '</div>';
                details += '<div class="line col2">';
                details += '<p>' + targetOPE.product.styleName + '</p>';
                details += '</div>';
                details += '<div class="line col3">';
                details += '<p>' + targetOPE.product.size + '</p>';
                details += '</div>';
                details += '<div class="line col4">';
                details += '<p>' + targetOPE.product.brand + '</p>';
                details += '</div>';
                details += '<div class="line col5">';
                details += '<span class="currency">$</span>';
                details += '<p>' + targetOPE.price.POF.toFixed(2) + '</p>';
                details += '</div>';
                details += '<div class="line col6">';
                details += '<span class="currency">$</span>';
                details += '<p id="ope_requested">' + targetOPE.price.requested.toFixed(2) + '</p>';
                details += '</div>';
                details += '<div class="line col7 ender">';
                details += '<p>' + targetOPE.qty + '</p>';
                details += '</div>';
                details += '</div>';
                details += '</div>';

                details += '<div class="calpanel container fluid">';
                details += '<div class="container custom">';
                details += '<div class="p_data">';
                details += '<div class="line colx">';
                details += '<div class="ope_info">';

                //// Set product details - NOTE: key must match what label should be!
                //for (var key in targetOPE.product.details) {
                //    //console.log(key);
                //    //console.log(targetOPE.product.details[key]);
                //    details += '<p><span class="info_label">' + key + ':</span> <span class="info_data">' + targetOPE.product.details[key] + '</span></p>';
                //}
                details += '<p><span class="info_label">Color Name:</span> <span class="info_data">' + targetOPE.product.colorName + '</span></p>';
                details += '<p><span class="info_label">Backing:</span> <span class="info_data">' + targetOPE.product.backing + '</span></p>';
                details += '<p><span class="info_label">Standard Roll Size:</span> <span class="info_data">' + targetOPE.product.standardRollSize + '</span></p>';
                details += '<p><span class="info_label">Rebate:</span> <span class="info_data">' + targetOPE.product.rebate + '%</span></p>';
                details += '<p><span class="info_label">Terms:</span> <span class="info_data">' + targetOPE.product.terms + '</span></p>';
                details += '<p><span class="info_label">FOB Warehouse:</span> <span class="info_data">' + targetOPE.product.fobWarehouse + '</span></p>';
                details += '<p><span class="info_label">Price:</span> <span class="info_data">' + targetOPE.product.priceType + '</span></p>';
                details += '</div>';
                details += '</div>';



                // Set price points based on userrole
                var endclass = 'cpl_TM3';

                details += '<div class="line col5">';

                details += '<div class="cpl_TM1">';
                details += '<span class="currency">$</span>';
                details += '<p>' + targetOPE.price.TM1.toFixed(2) + '</p>';
                details += '</div>';
                details += '<div class="cpl_TM2">';
                details += '<span class="currency">$</span>';
                details += '<p>' + targetOPE.price.TM2.toFixed(2) + '</p>';
                details += '</div>';

                if (G_userRole == 'DM' || G_userRole == 'RVP' || G_userRole == 'BG') {
                    endclass = 'cpl_TM2';
                }

                details += '<div class="' + endclass + '">';
                details += '<span class="currency">$</span>';
                details += '<p>' + targetOPE.price.TM3.toFixed(2) + '</p>';
                details += '</div>';

                // Condition for DM
                if ((G_userRole == 'DM' || G_userRole == 'RVP' || G_userRole == 'BG') && targetOPE.price.DM) {
                    if (G_userRole == 'RVP' || G_userRole == 'BG') {
                        endclass = 'cpl_TM2';
                    }
                    else {
                        endclass = 'cpl_TM3';
                    }
                    details += '<div class="' + endclass + '">';
                    details += '<span class="currency">$</span>';
                    details += '<p>' + targetOPE.price.DM.toFixed(2) + '</p>';
                    details += '</div>';
                }

                // Condition for RVP
                if ((G_userRole == 'RVP' || G_userRole == 'BG') && targetOPE.price.RVP) {
                    endclass = 'cpl_TM3';
                    details += '<div class="' + endclass + '">';
                    details += '<span class="currency">$</span>';
                    details += '<p>' + targetOPE.price.RVP.toFixed(2) + '</p>';
                    details += '</div>';
                }

                details += '</div>';




                details += '<div class="line col6">';
                details += '<div class="cpl_TM1">';
                details += '<p>TM1</p>';
                details += '</div>';
                details += '<div class="cpl_TM2">';
                details += '<p>TM2</p>';
                details += '</div>';

                if (G_userRole == 'DM' || G_userRole == 'RVP' || G_userRole == 'BG') {
                    endclass = 'cpl_TM2';
                }
                details += '<div class="' + endclass + '">';
                details += '<p>TM3</p>';
                details += '</div>';

                // Condition for DM
                if ((G_userRole == 'DM' || G_userRole == 'RVP' || G_userRole == 'BG') && targetOPE.price.DM) {
                    if (G_userRole == 'RVP' || G_userRole == 'BG') {
                        endclass = 'cpl_TM2';
                    }
                    else {
                        endclass = 'cpl_TM3';
                    }
                    details += '<div class="' + endclass + '">';
                    details += '<p>DM</p>';
                    details += '</div>';
                }

                // Condition for RVP
                if ((G_userRole == 'RVP' || G_userRole == 'BG') && targetOPE.price.RVP) {
                    endclass = 'cpl_TM3';
                    details += '<div class="' + endclass + '">';
                    details += '<p>RVP</p>';
                    details += '</div>';
                }

                details += '</div>';

                // Set price points based on userrole : END



                // Set user controls based on userrole
                details += '<div class="line col7 ender">';
                details += '<div class="cpl_editbtns">';

                // If targetOPE.status == 'completed', don't display controls
                if (targetOPE.status !== 'completed') {

                    //disable controls
                    var disable = '';
                    //if (targetOPE.status == 'inprocess')                    
                    if (targetOPE.stage != G_userRole) {
                        disable = ' disabled';
                    }

                    if (G_userRole == 'DM' || G_userRole == 'RVP' || G_userRole == 'BG') {

                        details += '<a href="javascript:approveOPE(' + id + ');" id="ope_approve" class="btn approve' + disable + '">Approve <br><span class="min">Requested Price</span></a>';

                        details += '<a href="javascript:denyOPE(' + id + ');" id="ope_deny" class="btn deny' + disable + '">Deny <br><span class="min">Requested Price</span></a>';

                    }
                    else {
                                              

                        details += '<a href="javascript:requestApprovalOPE(' + id + ');" id="ope_approve" class="btn approve' + disable + '">Approve <br><span class="min">Requested Price</span></a>';

                        details += '<a href="javascript:requestChangePOF(' + id + ');" id="ope_pof" class="btn change' + disable + '">Change <br><span class="min">To Price On File</span></a>';

                        details += '<a href="javascript:requestEditOPE(' + id + ');" id="ope_edit" class="btn edit' + disable + '">Edit <br><span class="min">Requested Price</span></a>';


                    }


                }



                details += '</div>';
                details += '</div>';

                details += '<div class="sm_shim"></div>';


                // Set user controls based on userrole : END



                // Set status base on targetOPE.status
                // Use targetOPE.approvers and targetOPE.stage to determine steps in process
                var steps = 0;
                var current_step = 0;
                //var current_approver;

                details += '<div class="line colx">';
                details += '<div class="ope_info">';
                details += '<h6>Status</h6>';

                details += '<div class="status">';

                
                // Get current step and current approver
                for (var key in targetOPE.approvers) {
                    if (targetOPE.approvers.hasOwnProperty(key)) {
                        if (targetOPE.stage == key) {
                            current_step = steps;
                            //current_approver = targetOPE.approvers[key];
                            //console.log('Current approver: '+current_approver.name);                                
                        }
                        ++steps;
                    }
                }


                for (i = 0; i < targetOPE.steps; i++) {

                    //console.log('Access by index: '+JSON.stringify(targetOPE.approvers[Object.keys(targetOPE.approvers)[i]]));
                    var iope = targetOPE.approvers[Object.keys(targetOPE.approvers)[i]];
                    var opecomplete = '';
                    var line = '';

                    if (i < current_step) {
                        opecomplete = ' status_complete';
                    }
                    else if (i == current_step) {
                        //Check approver action to determine if the OPE request was approved or denied                            
                        if (iope.action && iope.action.toLowerCase() === 'deny') {
                            opecomplete = ' status_denied';
                        }
                        else if (iope.action && iope.action.toLowerCase() === 'approve') {
                            opecomplete = ' status_complete';
                        }
                        else {
                            opecomplete = ' status_todo';
                            line = ' disabled';
                        }
                    }
                    else {
                        opecomplete = ' status_todo disabled';
                        line = ' disabled';
                    }


                    details += '<div class="status_block">';
                    details += '<div class="checker' + opecomplete + '">';
                    details += '<div class="icon_circle"></div>';
                    details += '<h6>' + iope.label + '</h6>';
                    // Include email address link if the link isn't disabled
                    if (opecomplete.indexOf('disabled') !== -1) {
                        details += '<p>' + iope.name + '</p>';
                    }
                    else {
                        details += '<p><a href="mailto:' + iope.email + '?subject=Regarding an Order Price Exception" target="_blank">' + iope.name + '</a></p>';

                    }

                    details += '</div>';
                    details += '</div>';

                    //console.log('Index: '+i);
                    if (i !== (targetOPE.steps - 1)) {
                        details += '<div class="status_gap">';
                        details += '<div class="tline' + line + '"></div>';
                        details += '</div>';
                    }


                }

                details += '</div>';

                details += '</div>';
                details += '</div>';

                // Set status base on targetOPE.status END

                // Set comments based on targetOPE.comments
                details += '<div class="line colx2">';
                details += '<div class="ope_info divider">';
                details += '<h6>Comments</h6>';

                details += '<div class="comments">';
                
                for (var key in targetOPE.comments) {

                    details += '<div class="comment_line">';
                    details += '<div class="ccol1">';
                    details += targetOPE.comments[key].date;
                    details += '</div>';
                    details += '<div class="ccol2">';
                    details += targetOPE.comments[key].time;
                    details += '</div>';
                    details += '<div class="ccol3">';
                    details += targetOPE.comments[key].action;
                    details += '</div>';
                    details += '<div class="ccol4">';
                    details += targetOPE.comments[key].person;
                    details += '</div>';
                    details += '<div class="ccol5">';
                    details += targetOPE.comments[key].comment;
                    details += '</div>';
                    details += '<div class="clear"></div>';
                    details += '</div>';

                }

                details += '</div>';
                details += '</div>';
                details += '</div>';
                // Set comments based on targetOPE.comments : END

                details += '<div class="clear"></div>';
                details += '</div>';
                details += '</div>';
                details += '</div>';


        }


        $('#ope_columns').html(th);
        $('#ope_datapanel').html(details);

    }
    
    
    // Render table head based on targetOPE.product.type (carpet, pad: Susan's Decorating or hard_surface: Oakstone Flooring)
    setTable(targetOPE.product.l1Type, targetOPE.product.l2Type);
    
    sectionLoader('ope', '', 0); //sectionLoader(appstate,msg,id)

};

var doSearchOPEAccounts = function doSearchOPEAccounts(useBlur) {
    
    if ($('#search_opes').val() != dealerPhrase) {
        if (G_opeaccountsFilterCalled == true) {
            return;
        }
        G_opeaccountsFilterCalled = true;

        opeAccountsFilter();
        $('#search_opes').siblings('.wdgt_icon').addClass('toreset');

        if (useBlur) {
            $('#search_opes').blur();
        }
    }
    if ($('#search_opes').val() == '')
    {
        $('#search_opes').val(dealerPhrase);
        $('#search_opes').siblings('.wdgt_icon').removeClass('toreset');
    }

}

var opeAccountsFilter = function () {
    
    try {
        var theval = $('#search_opes').val()
        var total = OPEs.length;
        var patternSearch = false;


        for (var i = 0; i < total; i++) {
            patternFilterResult = false;

            OPEs[i].itemVisible = "false";
            OPEs[i].itemVisiblePotential = "false";

            if (theval == "" || theval == dealerPhrase) {
                patternFilterResult = true;
            }
            else {
                if (OPEs[i].orderNo.toUpperCase().indexOf($('#search_opes').val().toUpperCase()) >= 0) {
                    patternFilterResult = true;
                }
                if (OPEs[i].account.name.toUpperCase().indexOf($('#search_opes').val().toUpperCase()) >= 0) {
                    patternFilterResult = true;
                }

                if (OPEs[i].account.number.toUpperCase().indexOf($('#search_opes').val().toUpperCase()) >= 0) {
                    patternFilterResult = true;
                }
            }


            if (patternFilterResult == true) {
                OPEs[i].itemVisible = "true";
            }
            else {
                OPEs[i].itemVisible = "false";
            }

            if (patternFilterResult == true) {
                OPEs[i].itemVisiblePotential = "true";
            }
            else {
                OPEs[i].itemVisiblePotential = "false";
            }


        }
        
        renderOPEList('opecreated');        

    }

    catch (err) {
        logError(welcomeUserName, "opeAccountsFilter", err.message, err.stack, '');

    }

}

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


// SHELL FUNCTIONS

//var opesQuery = function () {
//    var value = $('#search_opes').val();
//    var placeholder = $('#search_opes').attr('placeholder');


//    if ((value == '') || (value == placeholder)) {
//        alert("Please enter a Dealer Name or Account #.");
//    }
//    else {
//        alert("This is currently an empty function. The dealer account search will be connected here.");
//    }

//};


var approveOPE = function (id) {
    debugger;    
    lockoutInput();
    showProcessing('#data_loading');
    
    // Insert call to update status in database and return new JSON data here...
    $.post(
           G_AbsoluteUri + 'Home/approveOPE',
           { headerID: targetOPE.vid, comments: ' User approved from Mobile App', userID: welcomeUserName, password: welcomePassword },
          
           function (content) {      
               var responseObject = JSON.parse(content);
               if (responseObject.responseCode == "SUCCESS")
               {      
                   
                   //rebuild OPE list to reflect this change                   
                   getTargetOPEUpdates(responseObject.headerID);
                   goModal('#OPE_approved');                   

                   //// Use targetOPE.approvers and targetOPE.stage to determine the state of the OPE
                   //// Perhaps use user credentials (userrole) and the keys in targetOPE.approvers to assess who is approving
                   //// Object keys are: "TM", "DM", "RCM", "BG", RVP"

                   //var i = 0;
                   //var current_step = 0;                   
                   //var total_steps = targetOPE.steps - 1;
                   
                   //// Cycle once to get current step and current approver
                   //for (var key in targetOPE.approvers) {
                   //    if (targetOPE.approvers.hasOwnProperty(key)) {
                   //        if (targetOPE.stage == key) {
                   //            current_step = i;
                   //        }
                   //        ++i;
                   //    }
                   //}

                   ////Update targetOPE to next stage
                   //var id = OPEs.findIndex(x => x.itemIndex == G_opeAccount_index);
                   //if (current_step < total_steps) {   
                   //    targetOPE.status = 'inprocess';  
                   //    OPEs[id].status = 'inprocess';
                   //    switch (targetOPE.stage) {
                   //        case 'TM':                               
                   //            targetOPE.stage = 'DM';
                   //            OPEs[id].stage = 'DM';
                   //            break;
                   //        case 'DM':                               
                   //            targetOPE.stage = 'RVP';
                   //            OPEs[id].stage = 'RVP';
                   //            break;
                   //        case 'RVP':                               
                   //            targetOPE.stage = 'BG';
                   //            OPEs[id].stage = 'BG';
                   //            break;                         
                   //    }    
                   //}
                   //else if (current_step == total_steps) {
                   //    targetOPE.status = 'completed';                         
                   //    OPEs[id].status = 'completed';
                   //    switch (targetOPE.stage) {
                   //        case 'TM':
                   //            targetOPE.stage = 'TM';
                   //            OPEs[id].stage = 'TM';
                   //            break;
                   //        case 'DM':
                   //            targetOPE.stage = 'DM';
                   //            OPEs[id].stage = 'DM';
                   //            break;
                   //        case 'RVP':
                   //            targetOPE.stage = 'RVP';
                   //            OPEs[id].stage = 'RVP';
                   //            break;
                   //        case 'BG':
                   //            targetOPE.stage = 'BG';
                   //            OPEs[id].stage = 'BG';
                   //            break;
                   //    }    
                   //}
                 
                  
               }
               else
               {
                   if (responseObject.RememberMeCookie == 'INVALID') {
                       logOut();
                       return;
                   }                                      
                   $("#alertMessageContent").html(responseObject.responseMessage);
                   releaseLockout(true);
                   goModal('#alertMessageBox');
                   
               }
               
           }
         );
    
};

var denyOPE = function (id) {
    debugger;     
    lockoutInput();
    showProcessing('#data_loading');

    // Insert call to update status in database and return new JSON data here itself...
    $.post(
            G_AbsoluteUri + 'Home/denyOPE',
            { headerID: targetOPE.vid, comments: ' User denied from Mobile App', userID: welcomeUserName, password: welcomePassword },

            function (content) {
                
                if (content != undefined && content != null && content != "") {
                    var responseObject = JSON.parse(content);
                    if (responseObject.responseCode == "SUCCESS") {

                        //rebuild OPE list to reflect this change                   
                        getTargetOPEUpdates(responseObject.headerID);            
                        goModal('#OPE_denied');
                    }
                    else {
                        if (responseObject.RememberMeCookie == 'INVALID') {
                            logOut();
                            return;
                        }                        
                        $("#alertMessageContent").html(responseObject.responseMessage);
                        releaseLockout(true);
                        goModal('#alertMessageBox');
                    }
                }
            }
          );
    
};

var requestApprovalOPE = function (id) {
    debugger;
    lockoutInput();
    showProcessing('#data_loading');

    //Insert call to update status in database and return new JSON data here...
    $.post(
            G_AbsoluteUri + 'Home/approveOPE',
            { headerID: targetOPE.vid, comments: ' User approved from Mobile App', userID: welcomeUserName, password: welcomePassword },
             
             function (content) {
                 
                 if (content != undefined && content != null && content != "") {
                     var responseObject = JSON.parse(content);
                     if (responseObject.responseCode == "SUCCESS") {

                         //rebuild OPE list to reflect this change                   
                         getTargetOPEUpdates(responseObject.headerID);                  
                         goModal('#OPE_requestapproval');
                     }
                     else {
                         if (responseObject.RememberMeCookie == 'INVALID') {
                             logOut();
                             return;
                         }
                         $("#alertMessageContent").html(responseObject.responseMessage);
                         releaseLockout(true);
                         goModal('#alertMessageBox');
                     }
                     
                 }
             }
          );
    

};

var requestChangePOF = function (id) {
    debugger;
    lockoutInput();
    showProcessing('#data_loading');

    //Determine if the POF needs to use roll or cut POF based on targetOPE.product.type and the value of targetOPE.product.details.Price
    //console.log('Product type: ' + targetOPE.product.type);
    var thisPOF = getPOF(targetOPE.product.l1Type, targetOPE.product.l2Type);
   
    // Insert call to update status in database and return new JSON data here...    
    $.post(
            G_AbsoluteUri + 'Home/approveOPE',
            { headerID: targetOPE.vid, comments: ' POF approved from Mobile App', userID: welcomeUserName, password: welcomePassword },

            function (content) {
                
                if (content != undefined && content != null && content != "")
                {
                    var responseObject = JSON.parse(content);
                    if (responseObject.responseCode == "SUCCESS") {

                        //rebuild OPE list to reflect this change                   
                        getTargetOPEUpdates(responseObject.headerID);

                        //Also update requested price in the OPE view (#ope) 
                        //in case the user just closes the modal without returning to the OPE List panel (#opes)
                        $('#ope_requested').html(thisPOF);
                        goModal('#OPE_setPOF');
                    }
                    else {
                        if (responseObject.RememberMeCookie == 'INVALID') {
                            logOut();
                            return;
                        }
                        $("#alertMessageContent").html(responseObject.responseMessage);
                        releaseLockout(true);
                        goModal('#alertMessageBox');
                    }
                }

            }
          );    
    

};

var getPOF = function (l1type, l2type) {
    var POF;
    if (l1type == 'Soft' && l2type != 'Pad') {
        //console.log('Roll or cut? ' + targetOPE.product.priceType.toLowerCase());
        if (targetOPE.product.priceType.toLowerCase() == 'cut') {
            //console.log('Set Cut POF: $' + targetOPE.price.POFCut);
            POF = targetOPE.price.POFCut;
            // Set calculator detail
            $('#price_detail').html(' Cut');
        }
        else {
            //console.log('Set Roll POF: $' + targetOPE.price.POFRoll);
            POF = targetOPE.price.POFRoll;
            // Set calculator detail
            $('#price_detail').html(' Roll');
        }

    }
    else {
        //console.log('The product is pad or hard_surface. Just access the single value POF.');
        //console.log('Set POF: $' + targetOPE.price.POF);
        POF = targetOPE.price.POF;
        // Set calculator detail
        $('#price_detail').html('');

    }

    return POF;

};

var requestEditOPE = function (id) {
    debugger;
    console.log('This is an empty placeholder to edit OPE with id - ' + id + '.');

    var thisPOF = getPOF(targetOPE.product.l1Type, targetOPE.product.l2Type);
    $('#pof_price').html('$ ' + thisPOF.toFixed(2));
    $('#pof_target').html('$ ' + thisPOF.toFixed(2));
    $('#ope_value').html('$ ' + targetOPE.price.requested.toFixed(2));

    // Add active class based on comparison of requested price and price levels (TM1, TM2, TM3)
    //<a class="priceset disabled" id="ope_TM1">TM1<br><span class="subtxt">$4.86</span></a>
    var thisTM1, thisTM2, thisTM3;
    // Reset TM buttons in OPE calculator
    $('#ope_editprice').find('.priceset').removeClass('active');

    // Use type to determine price check
    if (targetOPE.product.l1type == 'Soft' && targetOPE.product.l2type != 'Pad') {
        if (targetOPE.product.priceType.toLowerCase() == 'cut') {
            console.log('Cut POF: $' + targetOPE.price.POFCut);

            thisTM1 = targetOPE.price.TM1Cut;
            thisTM2 = targetOPE.price.TM2Cut;
            thisTM3 = targetOPE.price.TM3Cut;

            if (targetOPE.price.requested === targetOPE.price.TM1Cut) {
                $('#ope_TM1').addClass('active');
            }
            if (targetOPE.price.requested === targetOPE.price.TM2Cut) {
                $('#ope_TM2').addClass('active');
            }
            if (targetOPE.price.requested === targetOPE.price.TM3Cut) {
                $('#ope_TM3').addClass('active');
            }


        }
        else {
            console.log('Roll POF: $' + targetOPE.price.POFRoll);

            thisTM1 = targetOPE.price.TM1Roll;
            thisTM2 = targetOPE.price.TM2Roll;
            thisTM3 = targetOPE.price.TM3Roll;


            if (targetOPE.price.requested === targetOPE.price.TM1Roll) {
                $('#ope_TM1').addClass('active');
            }
            if (targetOPE.price.requested === targetOPE.price.TM2Roll) {
                $('#ope_TM2').addClass('active');
            }
            if (targetOPE.price.requested === targetOPE.price.TM3Roll) {
                $('#ope_TM3').addClass('active');
            }


        }

    }
    else {
        console.log('POF: $' + targetOPE.price.POF);

        thisTM1 = targetOPE.price.TM1;
        thisTM2 = targetOPE.price.TM2;
        thisTM3 = targetOPE.price.TM3;

        if (targetOPE.price.requested === targetOPE.price.TM1) {
            $('#ope_TM1').addClass('active');
        }
        if (targetOPE.price.requested === targetOPE.price.TM2) {
            $('#ope_TM2').addClass('active');
        }
        if (targetOPE.price.requested === targetOPE.price.TM3) {
            $('#ope_TM3').addClass('active');
        }

    }

    $('#ope_TM1 span.subtxt').html('$' + thisTM1.toFixed(2));
    $('#ope_TM2 span.subtxt').html('$' + thisTM2.toFixed(2));
    $('#ope_TM3 span.subtxt').html('$' + thisTM3.toFixed(2));


    buildOPESlider(targetOPE.price.requested, thisPOF);

    goModal('#ope_editprice');





};

var savePriceOPE = function (id, price) {
    debugger;
    lockoutInput();
    showProcessing('#data_loading');
    
    // Insert call to update status in database and return new JSON data here...
    $.post(
                G_AbsoluteUri + 'Home/savePriceOPE',
                { headerID: targetOPE.vid, comments: 'User revision from Mobile App', lineIDs: targetOPE.vitemid, proposedRoll: price, proposedCut: price, currentHeaderStatus: targetOPE.headerStatus, currentLineStatus: targetOPE.lineStatus, userID: welcomeUserName, password: welcomePassword },

                function (content) {

                    if (content != undefined && content != null && content != "") {
                        var responseObject = JSON.parse(content);
                        if (responseObject.responseCode == "SUCCESS") {
                            
                            //rebuild OPE list to reflect this change                   
                            getTargetOPEUpdates(responseObject.headerID);                            
                            goModal('#OPE_edited');
                        }
                        else {
                            if (responseObject.RememberMeCookie == 'INVALID') {
                                logOut();
                                return;
                            }
                            $("#alertMessageContent").html(responseObject.responseMessage);
                            releaseLockout(true);
                            goModal('#alertMessageBox');
                        }
                    }

                }
          );


   

};

var buildOPESlider = function (price, POF) {

    // Add custom slider component
    //Store frequently used elements in variables
    debugger;
    var slider = $('#ope_slider'),
    price_target = price,
    slider_price = POF,
    valpad = 5.4, // Random value - need to figure how this is best set
    minval = slider_price - valpad,
    maxval = slider_price + valpad,
    value = $('#ope_value').html();

    value = parseFloat(value.split(' ')[1]);
    //console.log(value);
    //console.log('MIN: '+minval+' || MAX: '+maxval+' || PRICE: '+slider_price);

    console.log('Slider value: ' + price_target.toFixed(2));


    $('#pof_target').html('$ ' + slider_price.toFixed(2));

    //Call the Slider
    slider.slider({
        //Config
        range: "min",
        min: minval,
        max: maxval,
        step: G_priceStep,
        value: price_target,
        start: function (event, ui) {

        },
        //Slider Event
        slide: function (event, ui) { //When the slider is sliding
            var value = slider.slider('value');
            //console.log(value);
            $('.priceset_ope').removeClass('active');
            $('#ope_value').html('$ ' + (value.toFixed(2)));

        },
        stop: function (event, ui) {
            var value = slider.slider('value');

            if (value <= 0) {
                $('#ope_value').addClass('alerted');
                $('#accountOPE_save_btn').addClass('disabled');
                value = 0;
            }
            else {
                $('#ope_value').removeClass('alerted');
                $('#accountOPE_save_btn').removeClass('disabled');
            }

            $('#ope_value').html('$ ' + (value.toFixed(2)));

        },
    });


}




