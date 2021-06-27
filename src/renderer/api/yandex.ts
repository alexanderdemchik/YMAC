import axios from "axios";
import {
  CLIENT_ID,
  CLIENT_SECRET,
  HOST,
  OAUTH_TOKEN_URL,
  SESSIONID_GRANT_TYPE,
  LOGIN_INFO_URL,
  HOME_LANDING_URL,
  PERSONAL_PLAYLIST_URL,
  DOWNLOAD_INFO_URL,
  SIGNATURE_KEY,
  DIRECT_LINK_URL,
  PLAYLISTS_LIST_URL,
  PLAYLISTS_URL,
  TRACKS_URL,
  LIKES_URL,
  REMOVE_LIKES_URL,
  ADD_LIKES_URL
} from "../constants/yandex";
import crypto from "crypto";

export const getTokenBySessionId = async (sid: string) => {
  const params = new URLSearchParams();

  params.append("grant_type", SESSIONID_GRANT_TYPE);
  params.append("client_id", CLIENT_ID);
  params.append("client_secret", CLIENT_SECRET);
  params.append("host", HOST);
  params.append("sessionid", sid);

  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  return axios.post<Yandex.GetTokenResponse>(OAUTH_TOKEN_URL, params, config);
};

export const getUserInfo = async () => {
  return axios.get<Yandex.LoginInfoResponse>(LOGIN_INFO_URL);
};

export const getHomeLandingData = async () => {
  return axios.get<Yandex.HomeLandingResponse>(HOME_LANDING_URL);
};

export const getPlaylist = async (uid: number, kind: number) => {
  return axios.get<Yandex.Response<Yandex.Playlist>>(
    PERSONAL_PLAYLIST_URL(uid, kind)
  );
};

export const getDownloadInfo = async (trackId: number) => {
  return axios.get<Yandex.Response<Yandex.DonwloadInfo[]>>(
    DOWNLOAD_INFO_URL(trackId)
  );
};

export const getDirectLink = async (trackId: number) => {
  const infos = (await getDownloadInfo(trackId)).data.result;

  const info = infos[0];

  const drinfo = (
    await axios.get<Yandex.DirectLinkInfo>(
      `${info.downloadInfoUrl}&format=json`
    )
  ).data;

  const sign = crypto
    .createHash("md5")
    .update(`${SIGNATURE_KEY}${drinfo.path.substr(1)}${drinfo.s}`)
    .digest("hex");

  return DIRECT_LINK_URL(drinfo.host, sign, drinfo.ts, drinfo.path);
};

export const convertUri = (uri?: string, size: number = 200) => {
  if (uri) {
    return `https://${uri.replace("%%", `${size}x${size}`)}`;
  } else {
    return "";
  }
};

export const getPlaylistList = (userId: number) => {
  return axios.get<Yandex.Response<Yandex.Playlist[]>>(
    PLAYLISTS_LIST_URL(userId)
  );
};

export const getPlaylists = (userId: number, kinds: number[]) => {
  const data = new FormData();

  data.append("kinds", kinds.join(","));

  return axios.post<Yandex.Response<Yandex.Playlist[]>>(
    PLAYLISTS_URL(userId),
    data
  );
};

/**
 * @param trackIds array with elements in format <<trackId:albumId>>
 */
export const getTracks = (trackIds: string[]) => {
  const data = new FormData();

  data.append("track-ids", trackIds.join(","));
  data.append("with-positions", "True");

  return axios.post<Yandex.Response<Yandex.Track[]>>(TRACKS_URL, data);
};

export const getLikes = (userId: number) => {
  return axios.get<Yandex.Response<Yandex.LikesResponse>>(LIKES_URL(userId));
};

/**
 * @param trackIds array with elements in format <<trackId:albumId>>
 */
export const likeTrack = (userId: number, trackIds: string[] = []) => {
  const data = new FormData();

  data.set('track-ids', trackIds.join(','));

  return axios.post(ADD_LIKES_URL(userId), data);
};

export const removeTracksLikes = (userId: number, trackIds: string[] = []) => {
  const data = new FormData();

  data.set('track-ids', trackIds.join(','));

  return axios.post(REMOVE_LIKES_URL(userId), data);
}
