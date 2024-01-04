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
            title: 'Call with Andy and Mack',
            date: '2024-01-03',
            time: '18:00'
        },
        {
            title: 'Call with Federico',
            date: '2024-01-04',
            time: '09:45'
        }
    ]

}

module.exports = events;
```

then start the docker server calling

```
./server.sh
```

## License

MIT

## Author

(c) 2023, Francesco Sullo
