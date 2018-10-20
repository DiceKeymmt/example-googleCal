require('dotenv').config();
const http = require('http');
const https = require('https');
const url = require('url');
const path = require('path');
const querystring = require('querystring');
const fs = require('fs');
const {
    google
} = require('googleapis');
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
    process.env.REDIRECT_URIS.split(' ')[1]
);

async function authenticate() {
    return new Promise((resolve, reject) => {
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: scopes
        });
        if (process.env.REFRESH_TOKEN) {
            oauth2Client.setCredentials({
                refresh_token: process.env.REFRESH_TOKEN
            });

            return resolve(oauth2Client);
        }

        const server = http.createServer(async (req, res) => {
            opn(authUrl);
            if (url.parse(req.url).pathname === '/oauth2callback') {
                const qs = querystring.parse(url.parse(req.url).query);
                server.close();
                const {
                    tokens
                } = await oauth2Client.getToken(qs.code);
                oauth2Client.setCredentials(tokens);
                resolve(oauth2Client);
            }
        }).listen(process.env.PORT || 8080);
    });
}

authenticate()
    .then(client => {
        const calendar = google.calendar({
            version: 'v3',
            auth: client
        });

        const server = http.createServer();

        server.on('request', (req, res) => {
            switch (url.parse(req.url).pathname) {
                case '/calendars':
                    switch (req.method) {
                        case 'GET':
                        const qs = querystring.parse(url.parse(req.url).query);
                        return calendar.calendars.get({
                            calendarId: qs.calendarid
                        }, (err, r) => {
                            res.writeHead(200, {
                                'Content-Type': 'application/json'
                            });
                            res.write(JSON.stringify(r.data));
                            res.end();
                        })

                        default:
                            res.end('404\nFile Not Found');
                    }
                
                default:
                    res.end('404\nFile Not Found');
            }
        }).listen(process.env.PORT||8080);
    });