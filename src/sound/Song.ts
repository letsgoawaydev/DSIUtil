import { FileWithPath } from "../fs/Files";
import { IAudioMetadata, parseBlob } from "music-metadata-browser";

export default class Song implements FileWithPath {
    file: File;
    handle: FileSystemFileHandle | null;
    path: string;
    parent: FileSystemDirectoryHandle | null;
    meta: IAudioMetadata | null = null;
    constructor(obj: FileWithPath) {
        this.file = obj.file;
        this.handle = obj.handle;
        this.path = obj.path;
        this.parent = obj.parent;
    }

    static fromFile(file: File): Song {
        let fwp: FileWithPath = {
            file: file,
            handle: null,
            parent: null,
            path: ""
        }
        return new Song(fwp);
    }

    async loadMetadata() {
        let promise: Promise<IAudioMetadata> | null = null;

        // for file changes / reloads
        if (this.handle != null) {
            this.file = await this.handle.getFile();
        }
        
        promise = parseBlob(this.file);
        

        promise.then((meta) => {
            this.meta = meta;
        })
        return promise;
    }
}