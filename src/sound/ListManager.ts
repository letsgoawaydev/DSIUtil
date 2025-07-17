import AddFolderListItem from "./AddFolderListItem";
import AddSongListItem from "./AddSongListItem";
import BackListItem from "./BackListItem";
import FolderListItem from "./FolderListItem";
import ListItem from "./ListItem";
import Song from "./Song";
import SongListItem from "./SongListItem";
import SoundApp from "./SoundApp";

export default class ListManager {
    displayingItems: Array<ListItem> = [];
    listDiv: HTMLDivElement;
    constructor() {
        this.listDiv = (document.getElementById("songlist") as HTMLDivElement);
        this.listDiv.addEventListener("contextmenu", (ev) => {
            if (this.listDiv.matches(":hover")) {
                ev.preventDefault();
            }
        });
    }

    addItem(item: ListItem) {
        this.displayingItems.push(item);
    }

    parent: FileSystemDirectoryHandle | null = null;

    loadSongs(parent: FileSystemDirectoryHandle) {
        this.parent = parent;
        this.clear();
        this.addItem(new BackListItem())
        let songs: Array<Song> = [];

        SoundApp.instance.songs.filter((song) => {
            return song.parent == parent;
        }).forEach(song => songs.push(song))

        songs.sort((a, b) => {
            return a.path.localeCompare(b.path);
        });
        songs.sort((a, b) => {
            if (a.meta != null && b.meta != null) {
                if (a.meta.common.album != null && b.meta.common.album != null) {
                    return a.meta.common.album.localeCompare(b.meta.common.album);
                }
            }
            return a.path.localeCompare(b.path);
        });
        songs.sort((a, b) => {
            if (a.meta != null && b.meta != null && a.meta.common.track.no != null && b.meta.common.track.no != null) {
                return a.meta.common.track.no - b.meta.common.track.no;
            }
            return 0;
        });
        songs.forEach((song) => {
            this.addItem(new SongListItem(song))
        });
        if (this.parent !== SoundApp.root) {
            this.addItem(new AddSongListItem());
            this.addItem(new AddSongListItem("m4a"));
        }
        this.generate();
    }

    loadFolders() {
        this.parent = null;
        this.clear();
        this.addItem(new FolderListItem(SoundApp.root));
        SoundApp.instance.parents.forEach((folder) => {
            this.addItem(new FolderListItem(folder));
        });
        this.addItem(new AddFolderListItem());
        this.generate();
    }

    clear() {
        this.listDiv.textContent = ``;
        this.displayingItems = [];
    }

    generate() {
        requestAnimationFrame(() => {
            this.displayingItems.forEach((item) => {
                this.listDiv.appendChild(item.div);
            });
        })
    }
}