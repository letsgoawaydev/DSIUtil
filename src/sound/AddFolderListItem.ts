import ListItem from "./ListItem";
import SoundApp from "./SoundApp";
import SoundPopup from "./SoundPopup";

export default class AddFolderListItem extends ListItem {
    constructor() {
        super();
        this.icon.src = "assets/textures/sound/custom/add.png";
        this.text.innerText = "Add Folder...";

        this.div.addEventListener("click", async (ev) => {
            let folderName = await SoundPopup.openTextInput("Create Folder", "assets/textures/sound/folder.png", "New Folder", "Create");
            let dir = await SoundApp.musicDir.getDirectoryHandle(folderName, { create: true });
            SoundApp.instance.parents.push(dir);
            SoundApp.instance.sortParents();
            SoundApp.instance.list.loadFolders();
        });
    }
}