import { DirectoryHandleFunction, FileArray } from "../fs/Files";
import DSIMenuButton from "../ui/menu/DSIMenuButton";
import WaveformRenderer from "./WaveformRenderer";

export default class SoundApp {
    static instance: SoundApp;
    startupAudio: HTMLAudioElement;
    waveformCanvas: HTMLCanvasElement;
    waveformCanvas_renderer: WaveformRenderer;
    sdcardbutton: DSIMenuButton;
    constructor() {
        SoundApp.instance = this;
        this.startupAudio = (document.getElementById("startupaudio") as HTMLAudioElement);
        this.startupAudio.volume = 1.0;
        this.startupAudio.play();
        this.waveformCanvas = (document.getElementById("waveform") as HTMLCanvasElement);
        this.waveformCanvas_renderer = new WaveformRenderer(this.waveformCanvas, this.startupAudio);
        this.sdcardbutton = new DSIMenuButton(document.getElementById("sdcardbutton-sound") as HTMLDivElement, () => {
            if ("showDirectoryPicker" in window) {
                // what are we doing bro
                (window.showDirectoryPicker as DirectoryHandleFunction)().then(async (handle) => {
                    try {
                        await this.getAllFiles(handle);
                    }
                    catch (e) {
                        alert("Please ensure you are picking the root of your SD Card and not any folders inside of it.")
                        this.sdcardbutton.selected = false;
                    }
                }).catch(() => {
                    this.sdcardbutton.selected = false;
                });
            }
        });

        (document.getElementById("navbar") as HTMLDivElement).style.backgroundColor = "#608098";
        (document.getElementById("sdcardscreen-sound") as HTMLDivElement).style.display = "inherit";
        (document.getElementById("soundscreen") as HTMLDivElement).style.display = "inherit";


        document.body.style.backgroundImage = `url("looping_sound.png")`;
        document.body.style.backgroundSize = "50vw auto";
        requestAnimationFrame(() => {
            SoundApp.instance.draw();
        });
    }

    static root:FileSystemDirectoryHandle;
    async getAllFiles(fh: FileSystemDirectoryHandle) {
        SoundApp.root = fh;
        let fl: Array<File> = [];
        for await (const file of this.getFilesRecursively(SoundApp.root)) {
            if (file != null) {
                if (file.name.endsWith(".mp4") || file.name.endsWith(".m4a") || file.name.endsWith(".3gp")) {
                    console.log(file);
                    fl.push(file);
                }
            }
        }
        this.loadSongList(fl);
    }

    async *getFilesRecursively(entry: FileSystemHandle): AsyncGenerator<File | null> {
        // the only formats that DSi sound supports
        if (entry instanceof FileSystemFileHandle) {
            const file = await entry.getFile();
            if (file !== null) {
                yield file;
            }
        } else if (entry instanceof FileSystemDirectoryHandle) {
            // type script what the fuck are we doing
            for await (const handle of (entry as any).values()) {
                yield* this.getFilesRecursively(handle);
            }
        }
    }

    loadSongList(fl: FileArray) {

    }



    draw() {
        this.waveformCanvas.width = Math.round(window.innerWidth / 4);
        this.waveformCanvas.style.width = window.innerWidth + "px";
        this.waveformCanvas.height = Math.round(this.waveformCanvas.getBoundingClientRect().height / 4);

        this.waveformCanvas_renderer.draw();
        requestAnimationFrame(() => {
            SoundApp.instance.draw();
        });
    }
}