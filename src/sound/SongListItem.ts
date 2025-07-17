import path from "path";
import { FileWithPath } from "../fs/Files";
import ListItem from "./ListItem";
import Song from "./Song";
import SoundApp from "./SoundApp";

export default class SongListItem extends ListItem {
    song: Song;
    constructor(song: Song) {
        super();
        this.song = song;

        this.loadMeta();

        this.div.addEventListener("mouseover", (ev) => {
            SoundApp.instance.metadataCanvas_renderer.setSong(this.song);
        });
        this.div.addEventListener("click", (ev) => {
            console.log("trying to play song")

            SoundApp.instance.songPlayer.play(this.song);
        })

        this.div.addEventListener("contextmenu", (ev) => {
            ev.preventDefault();
            if (this.song.handle != null) {
                SoundApp.instance.contextMenu.show([{
                    text: "Delete",
                    onselect: async () => {
                        if (confirm(`Are you sure you want to delete "` + this.song.file.name + `"? This song will be permanently removed.`)) {
                            // non standard so we have to do this
                            (this.song.handle as any).remove();
                            SoundApp.instance.songs.splice(SoundApp.instance.songs.indexOf(this.song), 1);
                            this.div.remove();
                            await SoundApp.instance.getAllFiles(SoundApp.root);
                            if (this.song.parent != null) {
                                SoundApp.instance.list.loadSongs(this.song.parent);
                            }
                        }
                    }
                }], this.div.getBoundingClientRect().x, this.div.getBoundingClientRect().y);
            }
        })
    }

    async loadMeta() {
        await this.song.loadMetadata();
        if (this.song.meta != null && this.song.meta.common.title != null) {
            this.text.innerText = this.song.meta.common.title;
        }
        else {
            this.text.innerText = this.song.file.name.replace(path.extname(this.song.file.name), "");
        }
    }
}