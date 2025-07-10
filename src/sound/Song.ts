import { FileWithPath } from "../fs/Files";
import { IAudioMetadata, parseBlob } from "music-metadata-browser";

export default class Song implements FileWithPath {
    file: File;
    path: string;
    parent: FileSystemDirectoryHandle | null;
    meta: IAudioMetadata | null = null;
    constructor(obj: FileWithPath) {
        this.file = obj.file;
        this.path = obj.path;
        this.parent = obj.parent;
    }

    async loadMetadata() {
        let promise: Promise<IAudioMetadata> = parseBlob(this.file);
        promise.then((meta) => {
            this.meta = meta;
        })
        return promise;
    }
}