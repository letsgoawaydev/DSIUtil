import ListItem from "./ListItem";
import SoundApp from "./SoundApp";

export default class BackListItem extends ListItem {
    constructor() {
        super();
        this.icon.src = "assets/textures/sound/album.png";
        this.text.innerText = "Back";

        this.div.addEventListener("click", (ev) => {
            SoundApp.instance.list.loadFolders();
        });
    }
}