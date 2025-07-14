import { FFmpeg } from "@ffmpeg/ffmpeg";
import { DirectoryHandleFunction, FileArray, FileWithPath, FileWithPathArray } from "../fs/Files";
import DSIMenuButton from "../ui/menu/DSIMenuButton";
import MetadataRenderer from "./MetadataRenderer";
import Song from "./Song";
import SongListItem from "./SongListItem";
import SongPlayer from "./SongPlayer";
import WaveformRenderer from "./WaveformRenderer";
import { toBlobURL } from "@ffmpeg/util";
import path from 'path';
import SoundPopup from "./SoundPopup";
import Metadata from "./Metadata";
import CustomContextMenuHandler from "./context/CustomContextMenuHandler";
import Navbar from "./Navbar";
import ListManager from "./ListManager";
export default class SoundApp {
    static instance: SoundApp;
    startupAudio: HTMLAudioElement;
    waveformCanvas: HTMLCanvasElement;
    waveformCanvas_renderer: WaveformRenderer;
    metadataCanvas: HTMLCanvasElement;
    metadataCanvas_renderer: MetadataRenderer;
    list: ListManager;
    sdcardbutton: DSIMenuButton;
    contextMenu: CustomContextMenuHandler;

    navbar: Navbar;
    songPlayer: SongPlayer;

    ffmpeg: FFmpeg;

    constructor() {
        SoundApp.instance = this;
        this.ffmpeg = new FFmpeg();
        this.songPlayer = new SongPlayer();
        this.navbar = new Navbar();
        this.contextMenu = new CustomContextMenuHandler();
        this.list = new ListManager();

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

        (document.getElementById("soundscreen") as HTMLDivElement).style.display = "inherit";


        document.body.style.backgroundImage = `url("looping_sound.png")`;
        document.body.style.backgroundSize = "50vw auto";
        requestAnimationFrame((timestep) => {
            SoundApp.instance.draw(timestep);
            this.metadataCanvas_renderer.draw();
        });
        this.loadFFmpeg();
    }

    async loadFFmpeg() {
        const baseURL = 'assets/ffmpeg';
        this.ffmpeg.on('log', ({ message }) => {
            console.info(message);
        });
        // toBlobURL is used to bypass CORS issue, urls with the same
        // domain can be used directly.
        await this.ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
        });
        await this.ffmpeg.exec(["-sample_fmts"])

        this.ffmpeg.on("progress", (ev) => {
            this.onFFmpegProgress(ev.progress, ev.time);
        });
        console.log("FFMPEG LOADED");
    }

    onFFmpegProgress(progress: number, time: number): void {
        console.log(`progress: ${progress}, time: ${time}`);
        (document.getElementById("conversionprogress") as HTMLProgressElement).value = progress * 1000;
    }

    async uploadAndConvertFileToMp4() {
        await this.uploadAndConvertFile("mp4");
    }

    async uploadAndConvertFileToM4a() {
        await this.uploadAndConvertFile("m4a");
    }

    async uploadAndConvertFileTo3gp() {
        await this.uploadAndConvertFile("3gp");
    }

    async uploadAndConvertFile(extension: String = "mp4") {
        let files = await ((window as any).showOpenFilePicker as () => Promise<Array<FileSystemFileHandle>>)();
        let newFiles: Array<File> = [];
        for (let i = 0; i < files.length; i++) {
            const fileHandle = files[i];
            let file = (await fileHandle.getFile());
            newFiles.push(file);
        }
        await this.convertFiles(newFiles, extension, async (output, original) => {
            let aElement = document.createElement("a");
            aElement.download = original.name.replace(path.extname(original.name), "") + "." + extension;
            aElement.href = URL.createObjectURL(new Blob([output.buffer as ArrayBuffer]));
            aElement.click();
        }, () => {
            SoundPopup.hide();
        });
    }

    async convertFiles(files: FileArray, extension: String = "mp4", onConvert: (output: Uint8Array, original: File) => void, onFinish: VoidFunction, skipMetadata: boolean = false) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            let inputFileName = "input" + path.extname(file.name);

            const uint8Array = new Uint8Array(await file.arrayBuffer());
            await this.ffmpeg.writeFile(inputFileName, uint8Array);

            let args = ["-i", inputFileName, "-acodec", "aac", "-vn"];

            try {
                if (skipMetadata) {
                    args.push("-map_metadata", "0");
                }
                else {
                    let meta = this.buildMetadata(await SoundPopup.openMetadata(await this.getMetaFromFile(file)));
                    meta.forEach((str) => {
                        args.push("-metadata");
                        args.push(str);
                    });
                }

                args.push("output." + extension);
                await this.ffmpeg.exec(args);
                let output = await this.ffmpeg.readFile("output." + extension);
                if (output instanceof Uint8Array) {
                    onConvert(output, file);
                }
            }
            catch { };
        }
        onFinish();
    }

    async editCurrentSongMeta() {
        if (this.songPlayer.song != null) {
            let song = this.songPlayer.song;
            let file = this.songPlayer.song.file;
            let ext = path.extname(file.name);
            let inputFileName = "input" + ext;
            if (song.meta != null && song.handle != null) {
                let meta: Metadata = {
                    album: song.meta.common.album,
                    artist: song.meta.common.artist,
                    title: song.meta.common.title,
                    track: {
                        no: song.meta.common.track.no,
                        of: song.meta.common.track.of
                    },
                    year: song.meta.common.year
                }
                const uint8Array = new Uint8Array(await file.arrayBuffer());
                await this.ffmpeg.writeFile(inputFileName, uint8Array);

                let newMeta = this.buildMetadata(await SoundPopup.openMetadata(meta));
                let args = ["-i", inputFileName];
                newMeta.forEach((str) => {
                    args.push("-metadata");
                    args.push(str);
                });
                args.push("-codec", "copy", "output" + ext);
                await this.ffmpeg.exec(args);
                SoundPopup.openProgress();
                let output = await this.ffmpeg.readFile("output" + ext);
                if (output instanceof Uint8Array) {
                    let writable = await song.handle.createWritable();
                    await writable.write(output.buffer as ArrayBuffer)
                    await writable.close();
                    SoundPopup.hide();
                }
            }
        }
    }

    async getMetaFromFile(file: File): Promise<Metadata> {
        return new Promise(async (resolve, reject) => {
            let song = Song.fromFile(file);
            await song.loadMetadata();
            if (song.meta != null) {
                let meta: Metadata = {
                    album: song.meta.common.album,
                    artist: song.meta.common.artist,
                    title: song.meta.common.title,
                    track: {
                        no: song.meta.common.track.no,
                        of: song.meta.common.track.of
                    },
                    year: song.meta.common.year
                }
                resolve(meta);
            }
            else {
                resolve({});
            }
        });
    }




    buildMetadata(meta: Metadata): Array<string> {
        let metaarr: Array<string> = [];
        if (meta.title != null) {
            metaarr.push(`title=${meta.title}`);
        }

        if (meta.artist != null) {
            metaarr.push(`artist=${meta.artist}`, `author=${meta.artist}`, `album_artist=${meta.artist}`, `composer=${meta.artist}`);
        }


        if (meta.album != null) {
            metaarr.push(`album=${meta.album}`);
        }

        if (meta.track != null) {
            let trackstr = "";
            if (meta.track.no != null) {
                trackstr += `${meta.track.no}`;
                if (meta.track.of != null) {
                    trackstr += `/${meta.track.of}`;
                }
            }
            if (trackstr != "") {
                metaarr.push(`track=${trackstr}`);
            }
        }

        if (meta.year != null) {
            metaarr.push(`date=${meta.year}`);
        }

        return metaarr;
    }


    static root: FileSystemDirectoryHandle;
    static musicDir: FileSystemDirectoryHandle;
    async getAllFiles(fh: FileSystemDirectoryHandle) {
        SoundApp.root = fh;
        SoundApp.musicDir = await SoundApp.root.getDirectoryHandle("Music", { create: true });
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
                    handle: entry,
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
    parents: Array<FileSystemDirectoryHandle> = [];

    loadedSongs: boolean = false;

    async loadSongList(fl: Array<FileWithPath>) {
        this.folders = [];
        this.songs = [];
        this.parents = [];

        let sdcardscreen = (document.getElementById("sdcardscreen-sound"));
        if (sdcardscreen != null) {
            (sdcardscreen as HTMLDivElement).style.display = "none";
        }


        let sdcardbutton = (document.getElementById("sdcardscreen-sound"));
        if (sdcardbutton != null) {
            (sdcardbutton as HTMLDivElement).style.display = "none";
        }

        let selectsdcard = (document.getElementById("selectsdcard-sound"));
        if (selectsdcard != null) {
            (selectsdcard as HTMLDivElement).style.display = "none";
        }


        for (let i = 0; i < fl.length; i++) {
            let song = new Song(fl[i]);
            if (song.parent != null && song.parent != SoundApp.root && !this.parents.includes(song.parent)) {
                this.parents.push(song.parent);
            }
            await song.loadMetadata();
            this.songs.push(song);
        }
        this.sortParents();
        this.songs.sort((a, b) => {
            // sort by album like the DSi does
            if (a.meta != null && b.meta != null) {
                if (a.meta.common.album != null && b.meta.common.album != null) {
                    return a.meta.common.album.localeCompare(b.meta.common.album);
                }
            }
            return a.path.localeCompare(b.path);
        });
        this.songs.sort((a, b) => {
            if (a.meta != null && b.meta != null && a.meta.common.track.no != null && b.meta.common.track.no != null) {
                return a.meta.common.track.no - b.meta.common.track.no;
            }
            return 0;
        });
        this.loadedSongs = true;

        this.list.loadFolders();
    }

    sortParents() {
        this.parents.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
    }

    lastTimestep: number = 0;
    elapsed: number = 0;
    draw(timestep: number) {

        this.elapsed = timestep - this.lastTimestep;

        this.lastTimestep = timestep;

        this.waveformCanvas_renderer.draw();

        //this.metadataCanvas_renderer.draw();

        requestAnimationFrame((ts) => {
            SoundApp.instance.draw(ts);
        });
    }
}