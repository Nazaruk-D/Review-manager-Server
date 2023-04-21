const { DbxAuth, Dbx } = require('dropbox');
import fetch from 'node-fetch';
//const fetch = require('node-fetch');
const { Dropbox } = require('dropbox');

const APP_KEY = '1n7ktv09r5w0zz7';
const APP_SECRET = 'qmhpegk1qt39e62';

const dbx = new Dropbox({ fetch, clientId: APP_KEY, clientSecret: APP_SECRET });

async function getAccessToken() {
    // Запрос на получение токена
    const response = await dbx.auth.tokenFromOAuth1({
        oauth1Token: 'your_oauth1_token',
        oauth1TokenSecret: 'your_oauth1_token_secret'
    });
    console.log(response.result.access_token)
    return response.result.access_token;
}

// Теперь вы можете использовать этот токен для выполнения запросов к Dropbox API
getAccessToken();
//console.log(accessToken)
//const response = await dbx.filesListFolder({ path: '' });
//console.log(response);