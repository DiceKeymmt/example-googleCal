const http = require('http');
const https = require('https');
const url = require('url');
const path = require('path');
const fs = require('fs');
const { google } = require('googleapis');

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
    keys.redirect_uris = process.env.REDIRECT_URIS.split(' ')[0]
}

console.log(keys);