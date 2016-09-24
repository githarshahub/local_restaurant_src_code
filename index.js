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
	res.send('hello world. My first bot')
})

// for facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'harshalocalrestaurants') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
	console.log("on chat open");
})

// handler receiving messages
app.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
	console.log("Entered the post method");
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
            sendMessage(event.sender.id, {text: "Echo: " + event.message.text});
        }
    }
    res.sendStatus(200);
});




// generic function sending messages
function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        //qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
		qs: {access_token:token,'action':action},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};


// recommended to inject access tokens as environmental variables, e.g.
// const token = process.env.PAGE_ACCESS_TOKEN
const token ="EAAZAFsYln0fwBAMA2mCUj499jQLn21Bl6iod8tUHOZBkc0VvsMJhDVe3RnyQ76x3zsfuFQy1o0xEsH6WxrLkwGHNZCr1LwQZCxe9EmGwdN32xiZAEjAZACgEHjfjD1dkTSlvJz65bd9SAugudZBZBPxDPtLRGCzLFgN07l3DUMm6KgZDZD"



// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})
