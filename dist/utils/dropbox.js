"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { DbxAuth, Dbx } = require('dropbox');
const node_fetch_1 = __importDefault(require("node-fetch"));
//const fetch = require('node-fetch');
const { Dropbox } = require('dropbox');
const APP_KEY = '1n7ktv09r5w0zz7';
const APP_SECRET = 'qmhpegk1qt39e62';
const dbx = new Dropbox({ fetch: node_fetch_1.default, clientId: APP_KEY, clientSecret: APP_SECRET });
function getAccessToken() {
    return __awaiter(this, void 0, void 0, function* () {
        // Запрос на получение токена
        const response = yield dbx.auth.tokenFromOAuth1({
            oauth1Token: 'your_oauth1_token',
            oauth1TokenSecret: 'your_oauth1_token_secret'
        });
        console.log(response.result.access_token);
        return response.result.access_token;
    });
}
// Теперь вы можете использовать этот токен для выполнения запросов к Dropbox API
getAccessToken();
//console.log(accessToken)
//const response = await dbx.filesListFolder({ path: '' });
//console.log(response);
