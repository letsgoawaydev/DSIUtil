
// todo why does webpack hate me
import { FileWithPath } from "../fs/Files";
import { IAudioMetadata, parseBlob} from "music-metadata-browser";

export default class Song implements FileWithPath {
    file: File;
    path: string;
    meta: IAudioMetadata | null = null;
    constructor(obj: FileWithPath) {
        this.file = obj.file;
        this.path = obj.path;
    }

    async loadMetadata() {
        let promise: Promise<IAudioMetadata> = parseBlob(this.file);
        promise.then((meta) => {
            this.meta = meta;
        })
        return promise;
    }
}