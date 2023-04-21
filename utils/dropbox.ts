const { Dropbox, DropboxAuth } = require('dropbox')

const auth = new DropboxAuth({
    accessToken: 'sl.Bc6cvAJgiPCQBW7q0qHVOu0U-xmVDm2FJIXILRttIqkrJrZgoiZ9hAaZxV7W7G8F7_U2Ldn5foFqTRTif_wERENOn0YkdAJIecjeTL4rcP1RsS-P2YW8aNND_tAoJOaCYpx5A150y-DM'
});

export const dbx = new Dropbox({
    auth: auth
});

export async function checkAccessToken() {
    if (auth.getAccessTokenExpiresAt(Date.now()) < Date.now() + 60 * 60 * 1000) {
        const refreshedToken = await auth.tokenRefresh();
        dbx.setAccessToken(refreshedToken.accessToken);
    }
}
