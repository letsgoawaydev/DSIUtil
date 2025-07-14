import path from "path";
import ListItem from "./ListItem";
import SoundApp from "./SoundApp";
import SoundPopup from "./SoundPopup";

export default class AddSongListItem extends ListItem {
    constructor(extension: String = "mp4") {
        super();
        this.icon.src = "assets/textures/sound/custom/add.png";
        this.text.innerText = `Add Song as ${extension}...`;

        this.div.addEventListener("click", async (ev) => {
            let handles: Array<FileSystemFileHandle> = [];
            let totalConverted = 0;
            let totalFiles = 0;
            SoundPopup.openSongInput(extension, async (files) => {
                let parent = SoundApp.instance.list.parent;
                if (parent != null) {
                    totalFiles = files.length;
                    for (let i = 0; i < files.length; i++) {
                        const file = files[i];
                        handles.push(await parent.getFileHandle(file.name.replace(path.extname(file.name), "") + "." + extension, { create: true }));
                    }
                }
                SoundPopup.setTitle(`Converting... ${totalConverted}/${totalFiles}`);
                SoundPopup.openProgress();
            }, async (output, original) => {
                for (let i = 0; i < handles.length; i++) {
                    const handle = handles[i];
                    if (original.name.replace(path.extname(original.name), "") != handle.name.replace(path.extname(handle.name), "")) {
                        continue;
                    }
                    let writable = await handle.createWritable();
                    await writable.write(output.buffer as ArrayBuffer);
                    await writable.close();
                    totalConverted++;
                    SoundPopup.setTitle(`Converting... ${totalConverted}/${totalFiles}`);
                    break;
                }
            }, async () => {
                SoundPopup.hide();
                await SoundApp.instance.getAllFiles(SoundApp.root);
                SoundApp.instance.list.loadFolders();
            });
        });
    }
}