import path from "path";
import { FileWithPath } from "../fs/Files";
import ListItem from "./ListItem";
import Song from "./Song";
import SoundApp from "./SoundApp";

export default class FolderListItem extends ListItem {
    folder: FileSystemDirectoryHandle;
    constructor(folder: FileSystemDirectoryHandle) {
        super();
        this.folder = folder;
        this.icon.src = "assets/textures/sound/folder.png";

        if (this.folder == SoundApp.root) {
            this.text.innerText = "/SD Card";
        }
        else {
            this.text.innerText = folder.name;
        }

        this.div.addEventListener("click", (ev) => {
            SoundApp.instance.list.loadSongs(folder);
        })
    }
}