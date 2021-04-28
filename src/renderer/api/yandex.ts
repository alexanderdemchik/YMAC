import axios from 'axios';
import { CLIENT_ID, CLIENT_SECRET, HOST, OAUTH_TOKEN_URL, SESSIONID_GRANT_TYPE, LOGIN_INFO_URL, HOME_LANDING_URL } from '../constants/yandex';

export interface GetTokenResponse {
  access_token: string,
  expires_in: number,
  token_type: string,
  uid: number
}

export interface LoginInfoResponse {
  id: number,
  login: string,
  client_id: string,
  display_name: string,
  real_name: string,
  first_name: string,
  last_name: string,
  sex: string,
  default_email: string,
  emails: string[],
  birthday: string,
  default_avatar_id: string,
  is_avatar_empty: boolean,
  psuid: string
}

export interface InvocationInfo {
  hostname: string,
  'req-id': string,
  'exec-duration-millis': string
}

export interface LandingBlock {
  id: string,
  type: string,
  typeForFrom: string,
  title: string,
  description: string,
  entities: Array<LandingBlockEntity>
}

export interface LandingBlockEntity {
  id: string,
  type: string,
  data: PersonalPlaylistEntityData
}

export interface PersonalPlaylistEntityData {
  type: string,
  ready: boolean,
  notify: boolean,
  data: {
    uid: number,
    kind: number,
    title: string,
    description: string,
    descriptionFormatted: string,
    created: string,
    modified: string,
    available: boolean,
    animatedCoverUri: string,
    ogImage: string,
    durationMs: number,
    cover: {
      type: string,
      dir: string,
      version: string,
      uri: string,
      custom: boolean
    },
    playCounter: {
      value: number,
      description: string,
      updated: boolean
    }

  }
}

export interface HomeLandingResponse {
  invocationInfo: InvocationInfo,
  result: {
    pumpkin: boolean,
    contentId: string,
    blocks: Array<LandingBlock>
  }
}

export const getTokenBySessionId = async (sid: string) => {
  const params = new URLSearchParams();

  params.append('grant_type', SESSIONID_GRANT_TYPE);
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', CLIENT_SECRET);
  params.append('host', HOST);
  params.append('sessionid', sid);
  
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  return axios.post<GetTokenResponse>(OAUTH_TOKEN_URL, params, config);
}

export const getUserInfo = () => {
  return axios.get<LoginInfoResponse>(LOGIN_INFO_URL);
}

export const getHomeLandingData = () => {
  return axios.get<HomeLandingResponse>(HOME_LANDING_URL);
}