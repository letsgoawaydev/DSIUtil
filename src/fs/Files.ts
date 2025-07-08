export interface DirectoryHandleFunction {
    (): Promise<FileSystemDirectoryHandle>
}

export interface FileArray {
    readonly length: number;
    [index: number]: File;
}

export default class Files {
    
}