require("dotenv").config();
const express = require('express');
const app = express();

const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const events = require('./events');
for (let event of events.calendar) {
    const combinedDateTime = `${event.date}T${event.time}:00`;
    let date = new Date(combinedDateTime);
    date.setHours(date.getHours() - 8);
    event.utcDateTime = date.toISOString();
}

console.log(events);

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

app.listen(3210, () => {
    console.log('Express server running on port 3210');
});

function makeReminderCall(event) {
    console.log("Calling in relation to");
    console.log(event);
    let eventDetails = `You have an event titled ${event.title} at ${event.date}, ${event.time}.`; // Customize this line as needed
    client.calls
        .create({
            url: `https://${process.env.SERVER}/twiml?eventDetails=${encodeURIComponent(eventDetails)}`, // Replace with your server address
            to: process.env.RECEIVER,
            from: process.env.TWILIO_PHONE_NUMBER
        })
        .then(call => console.log(`Call initiated with SID: ${call.sid}`))
        .catch(error => console.error(error));
}

const min15 = 15 * 60 * 1000;

let now = Date.now();

for (let event of events.calendar) {
    let when = new Date(event.utcDateTime);
    let ts = when.getTime();
    console.log(now)
    console.log(ts);
    if (ts - min15 > now) {
        (function (event, when) {
            when.setHours(when.getHours() - 8);
            console.log("Scheduling " + event.title + " at " + when.toString());
            setTimeout(() => {
                makeReminderCall(event);
            }, ts - now - min15);
        })(event, when);
    }
}

console.log("Server started");