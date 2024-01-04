require("dotenv").config();
const express = require('express');
const app = express();

const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const events = require('./events');

function convertToUTC(dateString, timeString) {
    const combinedDateTime = `${dateString}T${timeString}:00`;
    let date = new Date(combinedDateTime);
    return date.toISOString();
}

for (let event of events.calendar) {
    event.utcDateTime = convertToUTC(event.date, event.time);
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

function checkCalendarEvents(title, time) {
    // Implement your calendar checking logic here
    // For example, if an event is soon:
    makeReminderCall({ title, time }); // Replace with actual event details
}

const min15 = 15 * 60 * 1000;

let now = Date.now();

for (let event of events.calendar) {
    let when = new Date(event.utcDateTime).getTime();
    let ts = when.getTime();
    if (ts > now) {
        (function (title, utcDateTime) {
            when.setHours(when.getHours() - 8);
            console.log("Scheduling " + title + " at " + when.toString());
            setTimeout(() => {
                checkCalendarEvents(title, utcDateTime);
            }, ts - now - min15);
        })(event.title, event.utcDateTime);
    }
}
