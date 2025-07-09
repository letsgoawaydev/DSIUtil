import Song from "./Song";
import SongListItem from "./SongListItem";
import SoundApp from "./SoundApp";

export default class SongPlayer {
    video: HTMLVideoElement;
    audio: HTMLAudioElement;
    url: string | null;
    song: Song | null = null;

    constructor() {
        this.video = document.createElement("video");
        this.audio = document.createElement("audio");
        this.url = null;
    }

    play(song: Song) {
        this.song = song;
        this.audio.pause();
        this.video.pause();
        if (this.song.file.type.includes("audio") || this.song.file.type == "") {
            this.audio = document.createElement("audio");
            this.audio.addEventListener("loadeddata", this.audio_play)
            this.audio.src = this.createURL(this.song);
        }
        else if (this.song.file.type.includes("video")) {
            this.video = document.createElement("video");
            this.video.addEventListener("loadeddata", this.video_play)
            this.video.src = this.createURL(this.song);
        }
    }

    private createURL(song: Song) {
        this.url = URL.createObjectURL(song.file);
        return this.url;
    }
    private deleteURL() {
        if (this.url != null) {
            URL.revokeObjectURL(this.url);
        }
    }

    private audio_play(this: HTMLAudioElement, ev: Event) {
        this.play().then(() => {
            SoundApp.instance.waveformCanvas_renderer.initialize(this);
        });
    }

    private video_play(this: HTMLVideoElement, ev: Event) {
        this.play().then(() => {
            SoundApp.instance.waveformCanvas_renderer.initialize(this);
        });
    }
}