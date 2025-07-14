export interface TrackInfo {
    no?: number | null,
    of?: number | null
}


export default interface Metadata {
    title?: string,
    artist?: string,
    album?: string,
    track?: TrackInfo,
    year?: number
}