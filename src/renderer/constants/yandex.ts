export const AUTH_URL = "https://passport.yandex.ru/auth?origin=music_app&retpath=https%3A%2F%2Foauth.yandex.ru%2Fauthorize%3Fresponse_type%3Dtoken%26client_id%3D23cabbbdc6cd418abb4b39c32c41195d%26redirect_uri%3Dhttps%253A%252F%252Fmusic.yandex.ru%252F%26force_confirm%3DFalse%26language%3Den"
export const REDIRECT_URL = "https://music.yandex.ru";
export const OAUTH_TOKEN_URL = 'https://oauth.yandex.ru/token';
export const LOGIN_INFO_URL = 'https://login.yandex.ru/info?format=json';
export const HOME_LANDING_URL = 'https://api.music.yandex.net/landing3?blocks=personalplaylists%2Cpromotions%2Cnew-releases%2Cnew-playlists%2Cmixes%2Cchart%2Ccharts%2Cartists%2Calbums%2Cplaylists%2Cplay_contexts%2Cpodcasts';
export const PERSONAL_PLAYLIST_URL = (uid: number, kind: number) => `https://api.music.yandex.net/users/${uid}/playlists/${kind}`;
export const DOWNLOAD_INFO_URL = (trackId: number) => `https://api.music.yandex.net/tracks/${trackId}/download-info`;
export const DIRECT_LINK_URL = (host: string, sign: string, ts: string, path: string) => `https://${host}/get-mp3/${sign}/${ts}${path}`
export const SIGNATURE_KEY = 'XGRlBW9FXlekgbPrRHuSiA';
export const SESSIONID_GRANT_TYPE = 'sessionid';
export const CLIENT_ID = '23cabbbdc6cd418abb4b39c32c41195d';
export const CLIENT_SECRET = '53bc75238f0c4d08a118e51fe9203300';
export const COOKIES_SESSION_ID_KEY = 'Session_id';
export const HOST = 'yandex.ru';