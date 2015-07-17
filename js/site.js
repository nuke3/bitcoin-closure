$(document).ready(function() {

    var bitaddress,
        closure = [], // the closure of bitaddress
        toBeProcessed = [], // the list of addresses to process
        txnList = [],
        inputsList = [];

    // just a nice waiting indicator for the user
    var spinner = (function () {
        var opts = { lines: 9, length: 6, width: 4, radius: 6, scale: 1, corners: 1, color: '#000', opacity: 0.25, rotate: 0, direction: 1, speed: 0.8, trail: 72, fps: 20, zIndex: 2e9, className: 'spinner', top: '50%', left: '50%', shadow: false, hwaccel: true, position: 'absolute' };
        return new Spinner(opts);
    })();

    // the odds and ends we want to do when the process begins
    var initSubmit = function() {
        // be nice and communicate to the user
        spinner.spin(document.getElementById('spinner'));
        $('.js_bitadd-heading > span').text(bitaddress);

        // prepare the submitted address for checking
        bitaddress = '1PabtoJrSJmDDTf3v5KzM1c4SK2kpkmUnt'; // $('#f-bitaddress__input').val();
        //EXAMPLE WITH A COINJOIN TRANSACTION bitaddress = '1CAbbXyRpdtpA6TKXss2Ydd1gWfPGyCJdK'; // $('#f-bitaddress__input').val();
        toBeProcessed.push(bitaddress);
    };

    // display the results to the user
    var displayData = function(data, message) {
        spinner.stop();
        $('#results > pre').text(message + JSON.stringify(data, null, '\t'));
    };

    $('.js-bitaddress').submit(function(e) {

        e.preventDefault();

        initSubmit();
        console.log("Begining WHILE loop.")
        while (toBeProcessed.length > 0) {
            var addr = toBeProcessed.shift(); // grab the top address to be processed; remove from toBeProcessed
            console.log("   The address currently being processed is: ", addr)
            // process the address by putting the address in the closure
            closure.push(addr);
            console.log("   The closure currently looks like: " , closure); // CONSOLE

            // get the list of all transactions involving the address addr through an API call
            console.log("   Initiating an API call to find txn hashes assoc'd with ", addr)
            $.ajax({
                type : "POST",
                dataType : "JSONP",
                url : 'https://insight.bitpay.com/api/addr/' + addr + '?format=json',
                success : function(data) {
                    displayData(data.transactions, 'Transactions associated with original address: \n\n');
                    txnList = data.transactions; // store the transaction data for further processing
                }
            }).then(function() {
                console.log("   we got the txn hashes assoc'd with ", addr);
                console.log("   The list off transaction assoc'd with ", addr, "is: ", txnList);
                console.log("   now we're initiating API calls to get the specifics for each of the ", txnList.length, "txn hashes")
                // for each txn in txnList we check to see if addr is one of the inputs
                // if it is, then the other inputs in this transaction may need to be processed if it hasn't been processed already.
                for (var i = 0; i < txnList.length; i++) {
                    console.log("       API call being initiated for txn ", txnList[i]);
                    // grab the list of inputs for txn and store them in inputsList. the first step in this 'grab' to get all the info for the txn:
                    $.ajax({
                        type : "POST",
                        dataType : "JSONP",
                        url : 'https://insight.bitpay.com/api/tx/' + txnList[i] + '?format=json',
                        success : function(data) {
                            $('#results > pre').text(JSON.stringify(data));
                            console.log("           Data captured from API.");
                            //in particular we are interested in the data.vin section (data.vin is an array, where each array entry corresponds to exactly one of the inputs of the transaction txn)
                            //if there is only one input, then we don't need to do anything more.
                            console.log("           The number of inputs in this txn is: ", data.vin.length, ". They are: ", data.vin);
                            if (data.vin.length > 1){
                                console.log("           Since there is more than 1 input we look at the inputs.")
                                //now for each input in data.vin we must extract the btc address of the input...
                                var inputsListBtcAddresses = [];

                                for (var inputnum = 0; inputnum < data.vin.length; inputnum++){
                                    //extract the btc address of the inputsList and add it to inputsListBtcAddresses
                                    inputsListBtcAddresses = inputsListBtcAddresses.concat( data.vin[inputnum].addr );
                                    console.log("               Input ", inputnum, " added. inputsListBtcAddresses looks like: ", inputsListBtcAddresses)
                                }
                                console.log("               Finished adding input btc address for txn ", txnList[i], "The list looks like: ", inputsListBtcAddresses)
                                console.log("               Now we check to see if addr (", addr, ") is among them.")
                                //now all input addresses are stored in inputsListBtcAddresses.
                                //we need to check to see if addr is in inputsListBtcAddresses. 
                                //If it's not then we're done (because we are only looking for new addresses that have been inputs along with addr).
                                //If it is, then all addresses in inputsListBtcAddresses are in the closure of bitaddress.
                                var found_addr = false;
                                var non_addr_addreses = [];

                                for (var inputaddress in inputsListBtcAddresses) {
                                    if (inputaddress == addr) {
                                        found_addr = true;
                                        console.log("                Found addr among the input addresses. So the other addresses must be in the closure.")
                                    } else {
                                        non_addr_addreses = non_addr_addreses.concat(inputaddress);

                                    }
                                }

                                if (found_addr){
                                    //so if this code executes, the list non_addr_addreses is in the closure of bitaddress.
                                    //so we check all the addresses in this list to see if (1) it's already in the list closure or (2) it's already in the list toBeProcessed.
                                    //if neither of those things are true, then we add the address to the list toBePrcessed.
                                    console.log("                   Before we add an address to the closure we check to see if we've already added it there previously.");
                                    
                                    for (var newaddr in non_addr_addreses){
                                        var inclosure = false;
                                        for (var c in closure){
                                            if (newaddr == c){
                                                inclosure = true;
                                                console.log("                   The address ", c, " has already been added to the closure.");
                                                break;
                                            }
                                        }
                                        if (!inclosure){
                                            console.log("                   The address ", c, "has not yet been added to the closure. \n let's check to see if it's in the toBeProcessed list.");
                                            var intoBeProcessed = false;
                                            for (var p in toBeProcessed){
                                                if (p == newaddr){
                                                    intoBeProcessed = true;
                                                    console.log("                       It is in the toBeProcessed list already.");
                                                    break;
                                                }
                                            }
                                            //if this code execute then newddt is NOT in closure and NOT in toBeProcessed.
                                            //So we need to add it to the list toBeProcessed.
                                            console.log("               The address ", c, "is not in the toBeProcessed list either. So we'll add it there.")
                                            toBeProcessed = toBeProcessed.concat(newaddr);
                                            console.log("The toBeProcessed list looks like this now: ", toBeProcessed);
                                        }
                                    }
                                }
                                else{
                                    console.log("The address ", addr, "was not found among them, so we don't add these input address to the closure. Moving on to the next txn.")
                                }
                            }
                            inputsList = data.vin;
                        }
                    });//PAUSE ME!!!
                    //when this code executes toBeProcessed should be empty and closure should equal the closure of bitaddress.
                }
            });
        }
        console.log("The WHILE loop has ended.");
        console.log("The closure looks like: ", closure);
        displayData(closure, "The closure looks like: ");
        //This ^ API query gives us a list of (hashes of) all transactions that involve the btc address we gave it.
        //For example, you'll see that the first txn hash that is listed is ae52255570201cb1d6e27119cb329aec9d7cab451aa1d4c42a87cd82ea5a5c98.
        //We can grab the actual transaction data itself (which we'll need) using another API call. In particular, this one:
        //https://insight.bitpay.com/api/tx/ae52255570201cb1d6e27119cb329aec9d7cab451aa1d4c42a87cd82ea5a5c98
        //The response to that ^ API call is the actual bitcoin transaction (whose hash is 'ae5334447....'). We can parse that to get the inputs to the txn. :)

    });
});