import { DirectoryHandleFunction, FileArray, FileWithPath, FileWithPathArray } from "../fs/Files";
import DSIMenuButton from "../ui/menu/DSIMenuButton";
import MetadataRenderer from "./MetadataRenderer";
import Song from "./Song";
import SongListItem from "./SongListItem";
import SongPlayer from "./SongPlayer";
import WaveformRenderer from "./WaveformRenderer";

export default class SoundApp {
    static instance: SoundApp;
    startupAudio: HTMLAudioElement;
    waveformCanvas: HTMLCanvasElement;
    waveformCanvas_renderer: WaveformRenderer;
    metadataCanvas: HTMLCanvasElement;
    metadataCanvas_renderer: MetadataRenderer;
    sdcardbutton: DSIMenuButton;

    songPlayer: SongPlayer;

    constructor() {
        SoundApp.instance = this;
        this.songPlayer = new SongPlayer();
        this.startupAudio = (document.getElementById("startupaudio") as HTMLAudioElement);
        this.startupAudio.volume = 1.0;
        this.startupAudio.play();
        this.waveformCanvas = (document.getElementById("waveform") as HTMLCanvasElement);
        this.waveformCanvas_renderer = new WaveformRenderer(this.waveformCanvas, this.startupAudio);
        this.metadataCanvas = (document.getElementById("metadatacanvas") as HTMLCanvasElement);
        this.metadataCanvas_renderer = new MetadataRenderer(this.metadataCanvas);
        this.sdcardbutton = new DSIMenuButton(document.getElementById("sdcardbutton-sound") as HTMLDivElement, () => {
            if ("showDirectoryPicker" in window) {
                // what are we doing bro
                (window.showDirectoryPicker as DirectoryHandleFunction)().then(async (handle) => {
                    try {
                        await this.getAllFiles(handle);
                    }
                    catch (e) {
                        console.error(e);
                        alert("Please ensure you are picking the root of your SD Card and not any folders inside of it.")
                        this.sdcardbutton.selected = false;
                    }
                }).catch(() => {
                    this.sdcardbutton.selected = false;
                });
            }
        });

        (document.getElementById("sdcardscreen-sound") as HTMLDivElement).style.display = "inherit";
        (document.getElementById("soundscreen") as HTMLDivElement).style.display = "inherit";


        document.body.style.backgroundImage = `url("looping_sound.png")`;
        document.body.style.backgroundSize = "50vw auto";
        requestAnimationFrame(() => {
            SoundApp.instance.draw();
        });
    }

    static root: FileSystemDirectoryHandle;
    async getAllFiles(fh: FileSystemDirectoryHandle) {
        SoundApp.root = fh;
        let fl: Array<FileWithPath> = [];
        for await (const obj of this.getFilesRecursively(SoundApp.root, null, null)) {
            if (obj != null) {
                if (obj.file.name.endsWith(".mp4") || obj.file.name.endsWith(".m4a") || obj.file.name.endsWith(".3gp")) {
                    fl.push(obj);
                }
            }
        }
        this.loadSongList(fl);
    }

    folders: Array<FileSystemDirectoryHandle> = [];

    async *getFilesRecursively(entry: FileSystemHandle, path: string | null, parent: FileSystemDirectoryHandle | null): AsyncGenerator<FileWithPath> {
        // the only formats that DSi sound supports
        if (entry instanceof FileSystemFileHandle) {
            if (path == null) {
                path = "";
            }
            else {
                path += entry.name;
            }
            const file = await entry.getFile();
            if (file !== null) {
                yield {
                    file: file,
                    path: path,
                    parent: parent
                };
            }
        } else if (entry instanceof FileSystemDirectoryHandle) {
            if (path == null) {
                path = "";
            }
            else {
                path += entry.name + "/";
            }
            // type script what the fuck are we doing
            for await (const handle of (entry as any).values()) {
                yield* this.getFilesRecursively(handle, path, entry);
            }
        }
    }

    songs: Array<Song> = [];

    loadedSongs: boolean = false;

    async loadSongList(fl: Array<FileWithPath>) {
        (document.getElementById("sdcardscreen-sound") as HTMLDivElement).style.display = "none";

        for (let i = 0; i < fl.length; i++) {
            let song = new Song(fl[i]);
            await song.loadMetadata();
            console.log(song.meta)
            this.songs.push(song);
        }
        this.songs.sort((a, b) => {
            // sort by album like the DSi does
            if (a.meta != null && b.meta != null) {
                if (a.meta.common.album != null && b.meta.common.album != null) {
                    return a.meta.common.album.localeCompare(b.meta.common.album);
                }
            }
            return a.path.localeCompare(b.path);
        })
        this.songs.forEach((song) => {
            new SongListItem(song);
        });
        this.loadedSongs = true;
    }



    draw() {
        this.waveformCanvas_renderer.draw();

        this.metadataCanvas_renderer.draw();

        requestAnimationFrame(() => {
            SoundApp.instance.draw();
        });
    }
}