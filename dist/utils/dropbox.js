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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAccessToken = exports.dbx = void 0;
const { Dropbox, DropboxAuth } = require('dropbox');
const auth = new DropboxAuth({
    accessToken: 'sl.Bc6cvAJgiPCQBW7q0qHVOu0U-xmVDm2FJIXILRttIqkrJrZgoiZ9hAaZxV7W7G8F7_U2Ldn5foFqTRTif_wERENOn0YkdAJIecjeTL4rcP1RsS-P2YW8aNND_tAoJOaCYpx5A150y-DM'
});
exports.dbx = new Dropbox({
    auth: auth
});
function checkAccessToken() {
    return __awaiter(this, void 0, void 0, function* () {
        if (auth.getAccessTokenExpiresAt(Date.now()) < Date.now() + 60 * 60 * 1000) {
            const refreshedToken = yield auth.tokenRefresh();
            exports.dbx.setAccessToken(refreshedToken.accessToken);
        }
    });
}
exports.checkAccessToken = checkAccessToken;
