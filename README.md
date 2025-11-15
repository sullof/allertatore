# allertatore

Configure the app adding an `.env` file like this example:
```
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
RECEIVER=
SERVER=
EMAIL=
```

And a file `events.js` like this one:

```
const events = {
    calendar: [
        {
            title: 'Meeting with the carpenter',
            date: '2024-01-03 15:15',
            offset: [60, 5]
            timezone: "Europe/Rome",
        },
        {
            title: 'Call with Federico',
            date: '2024-01-04 12:00',
            offset: [10]
            timezone: "America/Los_Angeles",
        }
    ]

}

module.exports = events;
```

then start the docker server calling

```
./server.sh
```

## Development

In development, you can add to your /etc/hosts a local domain, like `allertatore.local` pointing to 127.0.0.1 and use `dev.sh` to run the app.


## License

MIT

## Author

(c) 2023, Francesco Sullo
