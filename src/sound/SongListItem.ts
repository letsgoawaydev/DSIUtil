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