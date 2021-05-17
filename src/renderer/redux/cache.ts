interface Cache {
  playlists: Record<string, Yandex.Playlist>
}

export const cache: Cache = {
  playlists: {}
}