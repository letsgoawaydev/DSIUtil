export interface DirectoryHandleFunction {
    (): Promise<FileSystemDirectoryHandle>
}

export interface FileArray {
    readonly length: number;
    [index: number]: File;
}

export interface FileWithPathArray {
    readonly length: number;
    [index: number]: FileWithPath;
}

export interface FileWithPath {
    file: File,
    path: string
}

export default class Files {
    
}