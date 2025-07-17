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
        });
        if (this.folder != SoundApp.root) {
            this.div.addEventListener("contextmenu", (ev) => {
                ev.preventDefault();
                SoundApp.instance.contextMenu.show([{
                    text: "Delete",
                    onselect: () => {
                        if (confirm(`Are you sure you want to delete "` + this.folder.name + `"? All songs inside this folder will also be removed.`)) {
                            // non standard so we have to do this
                            (this.folder as any).remove({ recursive: true });
                            SoundApp.instance.parents.splice(SoundApp.instance.parents.indexOf(this.folder), 1);
                            SoundApp.instance.sortParents();
                            this.div.remove();
                            SoundApp.instance.list.loadFolders();
                        }
                    }
                }], this.div.getBoundingClientRect().x, this.div.getBoundingClientRect().y)
            })
        }
    }
}