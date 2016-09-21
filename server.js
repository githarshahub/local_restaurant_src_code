var express = require('express');
var app = express();
var fs = require("fs");
var request = require('request');
var http = require('http');
var response = require('http');
app.get('/:id', function (req, res) {
   // First read existing users.   
   /*fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       users = JSON.parse( data );
       var user = users["user" + req.params.id] 
       console.log(user);		
/*request('http://127.0.0.1:8081/listUsers', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log("body") // Print the google web page.
		users = JSON.parse( body );
		var user = users["user" + req.params.id] 
		//console.log(user);		
     }
})
       res.send("hii");
   });*/
   
   /*request('http://127.0.0.1:8081/listUsers', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log("body") // Print the google web page.
		users = JSON.parse( body );
		var user = users["user" + req.params.id] 
		console.log(user);
          res.send(user);		
     }
})*/
console.log("starting")
/*var propertiesObject = { ordernumber:'2016', emailid:'skjhavit@gmail.com' };
 var options = {
        uri : 'http://127.0.0.1:8081/listUsers/:',
        method : 'GET'		
    }; 
    var ress
    request(options,propertiesObject, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            ress = body;
        }
        else {
            ress = 'Not Found';
        }
       res.send("ok"+ress);
    });*/
	var responsedata = callAPI();
	console.log("in original method recieved response from callapi "+ responsedata);
  res.send(callAPI());


})

function callAPI() {
	
	var propertiesObject = { ordernumber:'20161234', emailid:'skjhavit@gmail.com' };

request({url:'http://127.0.0.1:5010/listUsers/:', qs:propertiesObject}, function(err, response, body) {
  if(err) { console.log(err); return; }
  console.log("Get response: " + response);
  var jsonContent = JSON.parse(body);
  var responsedata='';
// Get Value from JSON
//var jsoncontents = fs.readFileSync(response);
 console.log("Status:", jsonContent.user1.status);
 console.log("Email:", jsonContent.user1.EmailID);
 console.log("Ordernumber:", jsonContent.user1.Ordernumber);  
 
 for (var Key in jsonContent) {
	 responsedata = responsedata + "For customer " + jsonContent[Key]['EmailID'] + ' And Order ID ' + jsonContent[Key]['Ordernumber'] + ' order '+ jsonContent[Key]['status'] + '\n';
 }
 console.log("in method returning response" + responsedata);
return responsedata;
});	
	
}

var server = app.listen(8082, function () {

  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)

})