import { FileWithPath } from "../fs/Files";
import ListItem from "./ListItem";
import Song from "./Song";
import SoundApp from "./SoundApp";

export default class SongListItem extends ListItem {
    song: Song;
    constructor(song: Song) {
        super();
        this.song = song;
        if (song.meta != null && song.meta.common.title != null) {
            this.text.innerText = song.meta.common.title;
        }
        else {
            this.text.innerText = song.path;
        }

        this.div.addEventListener("mouseover", (ev) => {
            SoundApp.instance.metadataCanvas_renderer.setSong(this.song);
        });
        this.div.addEventListener("click", (ev) => {
            console.log("trying to play song")

            SoundApp.instance.songPlayer.play(this.song);
        })
    }
}