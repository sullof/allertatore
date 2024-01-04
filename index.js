require("dotenv").config();
const moment = require('moment-timezone');
const express = require('express');
const app = express();

const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// TODO, this file is hidden, look at sample.env.events for an example
const events = require('./events');

const now = new Date();
const oneMinute = 60 * 1000;

for (let event of events.calendar) {
    const date = moment.tz(event.date, event.timezone);
    const utcDate = date.clone().tz("UTC");
    event.utcDateTime = utcDate.toDate().toISOString();
}

// Express server to handle dynamic TwiML responses
app.use(express.urlencoded({ extended: false }));

app.post('/twiml', (req, res) => {
    const eventDetails = req.query.eventDetails; // Get event details from query parameter
    if (!eventDetails) {
        res.send({
            success: false,
            message: 'What are you doing here?'
        });
        return;
    }

    let response = new twilio.twiml.VoiceResponse();
    response.say(`Reminder: ${eventDetails}`);
    response.pause({ length: 1 });
    response.say('Have a great day!');

    res.type('text/xml');
    res.send(response.toString());
});

app.get("/", (req, res) => {

    res.json({
        hello: "World!"
    });
})

function makeReminderCall(event, when) {
    console.log("Calling in relation to");
    console.log(event);
    const day = new Date(event.utcDateTime);
    let minutes = Math.floor((day.getTime() - Date.now()) / 60000);
    let eventDetails = `You have an event titled "${event.title}" on ${day.toLocaleString('en-US', { timeZone: event.timezone })}. Let me repeat. You have an event titled "${event.title}" in ${minutes} minutes`; // Customize this line as needed
    client.calls
        .create({
            url: `https://${process.env.SERVER}/twiml?eventDetails=${encodeURIComponent(eventDetails)}`, // Replace with your server address
            to: process.env.RECEIVER,
            from: process.env.TWILIO_PHONE_NUMBER
        })
        .then(call => console.log(`Call initiated with SID: ${call.sid}`))
        .catch(error => console.error(error));
}

function schedule(ts, event, when, offset) {
    when.setHours(when.getHours() - 8);
    setTimeout(() => {
        makeReminderCall(event, when);
    }, ts - now - offset);
}


app.listen(3210, () => {
    console.log('Express server running on port 3210');
    for (let event of events.calendar) {
        let when = new Date(event.utcDateTime);
        let ts = when.getTime();
        let offset = [15 * oneMinute, 2 * oneMinute];
        if (event.offset) {
            offset = event.offset.map(e => e * oneMinute);
        }
        const at = when.toLocaleString('en-US', { timeZone: event.timezone });
        for (let o of offset) {
            if (ts - o > now) {
                console.log("\nScheduling: " + event.title + "\nat " + at + " (" + event.timezone + "), offset " + o/60000 + " minutes");
                schedule(ts, event, when, o);
            }
        }
    }
});


