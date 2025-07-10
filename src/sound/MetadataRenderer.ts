import { IAudioMetadata } from "music-metadata-browser";
import Song from "./Song";

export default class MetadataRenderer {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    metadatabg: HTMLImageElement;
    readonly WIDTH: number = 256;
    readonly HEIGHT: number = 144;

    song: Song | null = null;


    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = (canvas.getContext("2d", { alpha: false }) as CanvasRenderingContext2D);
        this.ctx.imageSmoothingEnabled = false;
        this.metadatabg = (document.getElementById("metadatabg") as HTMLImageElement);
    }

    setSong(song: Song | null) {
        this.song = song;
    }


    draw() {
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;
        this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);

        this.canvas.style.height = `${Math.round(window.innerHeight / 2)}px`;
        this.ctx.drawImage(this.metadatabg, 0, 0);

        this.ctx.font = "14px DSIFont";
        this.ctx.fontKerning = "none";
        this.ctx.textBaseline = "hanging";

        // Folder
        this.ctx.fillStyle = "#fff";
        this.ctx.fillText(this.getFolderText(), 24, 5);

        let space = 24;
        let offset = 6;
        this.ctx.fillStyle = "#000";

        // Song Title
        this.ctx.fillText(this.getTitleText(), 52, offset + space * 1);

        // Song Artist
        this.ctx.fillText(this.getArtistText(), 52, offset + space * 2);

        // Song Album
        this.ctx.fillText(this.getAlbumText(), 52, offset + space * 3);

        // Song Track
        this.ctx.fillText(this.getTrackText(), 52, offset + space * 4);

        // Song Year
        this.ctx.fillText(this.getYearText(), 52, offset + space * 5);

    }

    getFolderText():string {
        if (this.song != null && this.song.parent != null) {
            return this.song.parent.name;
        }
        else {
            return "/SD Card";
        }
    }

    getTitleText():string {
        if (this.song != null) {
            if (this.song.meta != null && this.song.meta.common.title != null) {
                return this.song.meta.common.title;
            }
            else {
                return this.song.file.name.substring(0, this.song.file.name.length - 4);
            }
        }
        else {
            return "--------";
        }
    }

    getArtistText():string {
        if (this.song != null && this.song.meta != null && this.song.meta.common.artist != null) {
            return this.song.meta.common.artist;
        }
        else {
            return "--------";
        }
    }


    getAlbumText():string {
        if (this.song != null && this.song.meta != null && this.song.meta.common.album != null) {
            return this.song.meta.common.album;
        }
        else {
            return "--------";
        }
    }

    getTrackText():string {
        if (this.song != null && this.song.meta != null && this.song.meta.common.track != null) {
            let noString = this.song.meta.common.track.no == null ? "-" : this.song.meta.common.track.no;
            let ofString = this.song.meta.common.track.of == null ? "-" : this.song.meta.common.track.of;

            return noString + " / " + ofString;
        }
        else {
            return "- / -";
        }
    }

    getYearText():string {
        if (this.song != null && this.song.meta != null && this.song.meta.common.year != null) {
            return this.song.meta.common.year + "";
        }
        else {
            return "----";
        }
    }
}