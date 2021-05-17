namespace Yandex {

  interface GetTokenResponse {
    access_token: string,
    expires_in: number,
    token_type: string,
    uid: number
  }
  
  interface LoginInfoResponse {
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
  
  interface InvocationInfo {
    hostname: string,
    'req-id': string,
    'exec-duration-millis': string
  }
  
  interface LandingBlock {
    id: string,
    type: string,
    typeForFrom: string,
    title: string,
    description: string,
    entities: Array<LandingBlockEntity>
  }
  
  interface LandingBlockEntity {
    id: string,
    type: string,
    data: PersonalPlaylistEntityData
  }
  
  interface Album {
  
  }
  
  interface Artist {
    id: number,
    name: string
  }
  
  interface Track {
    albums?: Album[],
    artists?: Artist[],
    available?: boolean,
    availableForPremiumUsers?: boolean,
    availableFullWithoutPermission?: boolean,
    coverUri?: string,
    durationMs?: number,
    fileSize?: number,
    id: string,
    lyricsAvailable?: boolean,
    major?: any,
    normalization?: any,
    ogImage?: string,
    previewDurationMs?: number,
    realId?: string,
    rememberPosition?: boolean,
    storageDir?: string,
    title?: string,
    trackSharingFlag?: string,
    type?: string,
    version?: string
  }
  
  interface TrackWrapper {
    id: number,
    recent: boolean,
    timestamp: string,
    track: Track
  }
  
  interface Playlist {
    uid?: number,
    playlistUuid?: string,
    kind?: number,
    title?: string,
    description?: string,
    descriptionFormatted?: string,
    created?: string,
    modified?: string,
    available?: boolean,
    animatedCoverUri?: string,
    ogImage?: string,
    durationMs?: number,
    revision?: number,
    cover?: {
      type: string,
      dir: string,
      version: string,
      uri?: string,
      custom: boolean,
      itemsUri?: string[]
    },
    playCounter?: {
      value: number,
      description: string,
      updated: boolean
    }
    tracks?: TrackWrapper[] | Track[]
  }
  interface PersonalPlaylistEntityData {
    type: string,
    ready: boolean,
    notify: boolean,
    data: Playlist
  }
  
  interface HomeLandingResponse {
    invocationInfo: InvocationInfo,
    result: {
      pumpkin: boolean,
      contentId: string,
      blocks: Array<LandingBlock>
    }
  }
  
  interface Response<T> {
    invocationInfo: InvocationInfo,
    result: T
  }
  
  interface DonwloadInfo {
    codec: string,
    gain: boolean,
    preview: boolean,
    downloadInfoUrl: string,
    direct: boolean,
    bitrateInKbps: number
  }
  
  interface DirectLinkInfo {
    s: string,
    ts: string,
    path: string,
    host: string
  }
  interface TinyTrack {
    id: string,
    albumId: string,
    timestamp: string
  }

  interface LikesResponse {
    library: {
      uid: number,
      revision: number,
      tracks: TinyTrack[]
    }
  }
}
