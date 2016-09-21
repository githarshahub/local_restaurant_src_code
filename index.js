'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
var action = 'none';

app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

// index
app.get('/', function (req, res) {
	res.send('hello world I am a secret bottt')
})

// for facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
	console.log("on chat open");
})

// to post data
app.post('/webhook/', function (req, res) {	
	let messaging_events = req.body.entry[0].messaging
	console.log("on chat open post");
	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i]
		let sender = event.sender.id		
		if (event.message && event.message.text) {
			let text = event.message.text
			if (text === 'Generic') {
				sendGenericMessageTest(sender)
				continue
			} else {				
			sendTextMessageModified(sender,text)
			continue
			}
		}
		if (event.postback) {
			let text = JSON.stringify(event.postback)
			if(text.includes("Hi")) {
				var action='order';
				sendTextMessage(sender,'order', token)
				sendTextMessageModified(sender,'track')

			} else {
				sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
			}
			console.log('action is... '+action);
			continue
		}
	}
	res.sendStatus(200)
})

function sendTextMessageModified(sender, text) {
	text= text.toLowerCase();
	console.log();
	if((text.includes("hi") || text.includes("hello") || text.includes("hey"))&& !text.includes("his") ){
	sendGenericMessageTest(sender); }
	else if(text.includes("order") || text.includes("track") || text.includes("status")) {
	sendTextMessage(sender,"Please provide order number or email id"); }
	else if(text.includes("2016") || text.includes("@") ) {		
	var propertiesObject = { ordernumber:text, emailid:text };

request({url:'https://nodejsapitest1.herokuapp.com/listUsers/:', qs:propertiesObject}, function(err, response, body) {
  if(err) { console.log(err); return; }
  console.log("Get response: " + response);
  var jsonContent = JSON.parse(body);
  var responsedata=''; 
 for (var Key in jsonContent) {
	 responsedata = responsedata + "For customer " + jsonContent[Key]['EmailID'] + ' And Order ID ' + jsonContent[Key]['Ordernumber'] + ' order '+ jsonContent[Key]['status'] + '\n';
 }
 console.log("in method returning response" + responsedata);
 if(responsedata.length < 5)
sendTextMessage(sender,"Sorry no order found with this email id or order number. Please try again");
else 
sendTextMessage(sender,responsedata);	
});	
	} else {
		sendTextMessage(sender,"I didn't get your question. Please select one of the option from below.");
		sendGenericMessageTest(sender);
	}
	
}

function sendTextMessageCoupon(sender, text) {
			
	var propertiesObject = { ordernumber:text, emailid:text };

request({url:'https://nodejsapitest1.herokuapp.com/listCoupons/:', qs:propertiesObject}, function(err, response, body) {
  if(err) { console.log(err); return; }
  console.log("Get response: " + response);
  var jsonContent = JSON.parse(body);
  var responsedata=''; 
 for (var Key in jsonContent) {
	 for (var kkey in jsonContent[Key]) {
		 responsedata = responsedata+ ' '+ kkey + ' : ' +  jsonContent[Key][kkey] + '\n';
	 }
	 sendTextMessage(sender,responsedata);
	 console.log("sent response " + responsedata); 
	 responsedata='';
 }
 console.log("in method returning response" + responsedata); 
 responsedata='Please visit http://m.jcpenney.com/m/jcpenney-coupons/N-mpi6e5 for more info. ';
 sendTextMessage(sender,responsedata);
	
});	
	 
	
}

// recommended to inject access tokens as environmental variables, e.g.
// const token = process.env.PAGE_ACCESS_TOKEN
const token ="628643280648104"

function sendTextMessage(sender, text) {
	let messageData = { text:text }
	
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token,'action':action},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

function sendGenericMessage(sender) {
	let messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [{
					"title": "First card",
					"subtitle": "Element #1 of an hscroll",
					"image_url": "http://messengerdemo.parseapp.com/img/rift.png",
					"buttons": [{
						"type": "web_url",
						"url": "https://www.messenger.com",
						"title": "web url"
					}, {
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for first element in a generic bubble",
					}],
				}, {
					"title": "Second card",
					"subtitle": "Element #2 of an hscroll",
					"image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
					"buttons": [{
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for second element in a generic bubble",
					}],
				}]
			}
		}
	}
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

function sendGenericMessageTest(sender) {
	let messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [{
					"title": "Hey there, how can I assist you",					
					"image_url": "http://m.jcpenney.com/b/assets/img/app_icon_2x.png",
					"buttons": [{
						"type": "postback",						
						"title": "View Coupons",
						"payload": "Coupon",
					}, {
						"type": "postback",
						"title": "Track Order",
						"payload": "Order",
					} , {
						"type": "postback",
						"title": "Search Product",
						"payload": "Product",
					}],
				}]
			}
		}
	}
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

function sendGenericProduct(sender) {
	
	let messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [{
					"title": "St. John's Bay® Legacy Piqué Polo Shirt",
					"subtitle": "Price Is -> Original : 26 $ Sale : 11.99$ \n Colors are -> Red, Black, Blue \n sizes are -> small,Medium,Large, X-Large, Xx-Large",
					"image_url": "https://dl.dropboxusercontent.com/u/7335680/DP0726201620434916C%20(1).jpg",
					"buttons": [{
						"type": "web_url",						
						"title": "5133600 \n click on the URL to see complete product details",
						"url": "http://m.jcpenney.com/product?ppId=pp5006230285",
					}],
				}]
			}
		}
	}
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})
