import Song from "./Song";
import SongListItem from "./SongListItem";
import SoundApp from "./SoundApp";

export default class SongPlayer {
    video: HTMLVideoElement;
    audio: HTMLAudioElement;
    // true: playing on audio
    // false: playing on video
    // null: not playing anything anywhere
    avbool: boolean | null = null;
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
            this.avbool = true;
            this.volume = this.volume;
        }
        else if (this.song.file.type.includes("video")) {
            this.video = document.createElement("video");
            this.video.addEventListener("loadeddata", this.video_play)
            this.video.src = this.createURL(this.song);
            this.avbool = false;
            this.volume = this.volume;
        }
    }

    pause() {
        let current = this.getCurrent();
        if (current != null) {
            current.pause();
        }
    }

    /* Returns number of seconds in playback */
    currentTime(): number {
        let current = this.getCurrent();
        if (current != null) {
            return current.currentTime;
        }
        return 0;
    }

    /* Returns number of seconds in the media total */
    duration(): number {
        let current = this.getCurrent();
        if (current != null) {
            return current.duration;
        }
        return 0;
    }

    private _volume: number = 1.0;

    set volume(n:number) { 
        this._volume = n;
        let current = this.getCurrent();
        if (current != null) {
            current.volume = this._volume;
        }
    }

    get volume():number { 
        return this._volume;
    }


    getCurrent(): HTMLMediaElement | null {
        if (this.avbool == true) {
            return this.audio;
        }
        else if (this.avbool == false) {
            return this.video;
        }
        return null;
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
            SoundApp.instance.waveformCanvas_renderer.initialize(this, SoundApp.instance.songPlayer.song);
        });
    }

    private video_play(this: HTMLVideoElement, ev: Event) {
        this.play().then(() => {
            SoundApp.instance.waveformCanvas_renderer.initialize(this, SoundApp.instance.songPlayer.song);
        });
    }
}