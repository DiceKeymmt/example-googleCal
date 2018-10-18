const http = require('http');
const https = require('https');
const url = require('url');
const path = require('path');
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


const keyPath = path.join(__dirname, '../private/client_secret.json');

let keys = {
    client_id: '',
    client_secret: '',
    redirect_uris: ''
};

if (fs.existsSync(keyPath)) {
    keys = JSON.parse(fs.readFileSync(keyPath)).web;
} else {
    keys.client_id = process.env.CLIENT_ID,
    keys.client_secret = process.env.CLIENT_SECRET,
    keys.redirect_uris = process.env.REDIRECT_URIS.split(' ')
}

const oauth2Client = new google.auth.OAuth2(
    keys.client_id,
    keys.client_secret,
    keys.redirect_uris[0]
);

const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
});

opn(authorizeUrl);

const server = http.createServer();

server.on('request', (req, res) => {
    console.log(req.url)
}).listen(process.env.PORT||8080);