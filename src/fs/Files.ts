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
    path: string,
    parent: FileSystemDirectoryHandle | null
}

export default class Files {
    
}