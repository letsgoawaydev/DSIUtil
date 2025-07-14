import { IAudioMetadata } from "music-metadata-browser";
import Song from "./Song";
import SoundApp from "./SoundApp";
import path from "path";

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
        this.draw();
    }


    draw() {
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;
        this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);

        //    this.canvas.style.height = `${Math.round(window.innerHeight / 2)}px`;
        this.ctx.drawImage(this.metadatabg, 0, 0);

        this.ctx.font = "16px DSIFont";
        this.ctx.fontKerning = "none";
        this.ctx.textBaseline = "hanging";

        // Folder
        this.ctx.fillStyle = "#fff";
        this.ctx.fillText(this.getFolderText(), 24, 5);

        let space = 24;
        let offset = 6;
        this.ctx.fillStyle = "#000";

        // Song Title
        this.drawText(this.getTitleText(), 52, offset + space * 1);

        // Song Artist
        this.drawText(this.getArtistText(), 52, offset + space * 2);

        // Song Album
        this.drawText(this.getAlbumText(), 52, offset + space * 3);

        // Song Track
        this.ctx.fillText(this.getTrackText(), 52, offset + space * 4);

        // Song Year
        this.ctx.fillText(this.getYearText(), 52, offset + space * 5);

    }

    drawText(text: string, x: number, y: number) {
        let metrics: TextMetrics = this.ctx.measureText(text);
        if (x + metrics.width > this.WIDTH) {
            let displayedperecentage: number = (this.WIDTH - x) / (metrics.width);
            let cutoff = Math.floor((text.length - 1) * displayedperecentage);

            let cutofftext = text.substring(0, cutoff);
            // Ellipsis is probably more accurate than ... tbh
            let dotmetrics: TextMetrics = this.ctx.measureText("…");
            let dotdotdotcutoff: number = -1;
            for (let i = 0; i < 5; i++) {
                let cutoffmetrics = this.ctx.measureText(cutofftext.substring((cutofftext.length) - i));
                if (cutoffmetrics.width > dotmetrics.width) {
                    dotdotdotcutoff = i-1;
                    break;
                }
            }

            cutofftext = cutofftext.substring(0, cutofftext.length - dotdotdotcutoff);

            text = cutofftext + "...";
        }
        this.ctx.fillText(text, x, y);
    }


    getFolderText(): string {
        if (this.song != null && this.song.parent != null && this.song.parent != SoundApp.root) {
            return this.song.parent.name;
        }
        else {
            return "/SD Card";
        }
    }

    getTitleText(): string {
        if (this.song != null) {
            if (this.song.meta != null && this.song.meta.common.title != null) {
                return this.song.meta.common.title;
            }
            else {
                let name = this.song.file.name.replace(path.extname(this.song.file.name), "");
                if (name.length > 23) {
                    return name.substring(0, 23) + "...";
                }
                return this.song.file.name.replace(path.extname(this.song.file.name), "");
            }
        }
        else {
            return "--------";
        }
    }

    getArtistText(): string {
        if (this.song != null && this.song.meta != null && this.song.meta.common.artist != null) {
            return this.song.meta.common.artist;
        }
        else {
            return "--------";
        }
    }


    getAlbumText(): string {
        if (this.song != null && this.song.meta != null && this.song.meta.common.album != null) {
            return this.song.meta.common.album;
        }
        else {
            return "--------";
        }
    }

    getTrackText(): string {
        if (this.song != null && this.song.meta != null && this.song.meta.common.track != null) {
            let noString = this.song.meta.common.track.no == null ? "-" : this.song.meta.common.track.no;
            let ofString = this.song.meta.common.track.of == null ? "-" : this.song.meta.common.track.of;
            return "Track " + noString + " / " + ofString;
        }
        else {
            return "- / -";
        }
    }

    getYearText(): string {
        if (this.song != null && this.song.meta != null && this.song.meta.common.year != null) {
            return this.song.meta.common.year + "";
        }
        else {
            return "----";
        }
    }
}