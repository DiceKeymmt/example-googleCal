const http = require('http');
const https = require('https');
const url = require('url');
const path = require('path');
const querystring = require('querystring');
const fs = require('fs');
const { google } = require('googleapis');
const opn = require('opn');

const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/calendar.events.readonly',
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.settings.readonly'
];

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URIS.split(' ')
);

const server = http.createServer();

server.on('request', (req, res) => {
    switch (req.method) {
        case 'GET':
            console.log(querystring.parse(url.parse(req.url)))
    }
}).listen(process.env.PORT);

