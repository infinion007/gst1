"use strict";
var paytm_config = require('./paytm/paytm_config').paytm_config;
var paytm_checksum = require('./paytm/checksum');
var querystring = require('querystring');
function route(request,response){
	switch(request.url){
		case '/':
			console.log("/ has started");
			response.writeHead(200 , {'Content-type':'text/html'});
			response.write('<html><head><title>Paytmdddddd</title></head><body>');
			response.write('</body></html>');
			response.end(); 
			break;
		case '/generate_checksum':
			if(request.method == 'POST'){
			var paramarray = {};
				paramarray['MID'] = request.body["MID"]; //Provided by Paytm
				paramarray['ORDER_ID'] = request.body["ORDER_ID"] //unique OrderId for every request
				paramarray['CUST_ID'] = request.body["CUST_ID"];  // unique customer identifier 
				paramarray['INDUSTRY_TYPE_ID'] = request.body["INDUSTRY_TYPE_ID"]; //Provided by Paytm
				paramarray['CHANNEL_ID'] = 'WAP'; //Provided by Paytm
				paramarray['TXN_AMOUNT'] = request.body["TXN_AMOUNT"]; // transaction amount
			    paramarray['WEBSITE'] = request.body["WEBSITE"]; //Provided by Paytm
			    paramarray['CALLBACK_URL'] = request.body["CALLBACK_URL"]//Provided by Paytm
			    paramarray['EMAIL'] = request.body["EMAIL"]; // customer email id
				paramarray['MOBILE_NO'] = request.body["MOBILE_NO"]; // customer 10 digit mobile no.
					paytm_checksum.genchecksum(paramarray, paytm_config.MERCHANT_KEY, function (err, res) {
						//response.writeHead(200, {'Content-type' : 'text/json','Cache-Control': 'no-cache'});
						response.send(JSON.stringify(res));
						//response.end();
					});
			}else{
				response.writeHead(200, {'Content-type' : 'text/json'});
				response.end();
			}
			break;
		case '/verify_checksum':
			if(request.method == 'POST'){
				var fullBody = '';
				request.on('data', function(chunk) {
					fullBody += chunk.toString();
				});
				request.on('end', function() {
					var decodedBody = querystring.parse(fullBody);
					response.writeHead(200, {'Content-type' : 'text/html','Cache-Control': 'no-cache'});
					if(paytm_checksum.verifychecksum(decodedBody, paytm_config.MERCHANT_KEY)) {
						console.log("true");
					}else{
						console.log("false");
					}
					 // if checksum is validated Kindly verify the amount and status 
					 // if transaction is successful 
					// kindly call Paytm Transaction Status API and verify the transaction amount and status.
					// If everything is fine then mark that transaction as successful into your DB.			
					
					response.end();
				});
			}else{
				response.writeHead(200, {'Content-type' : 'text/json'});
				response.end();
			}
			break;
	}	
}

function htmlEscape(str) {
  return String(str)
          .replace(/&/g, '&amp;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
}
exports.route = route;
