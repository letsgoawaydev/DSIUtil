import SoundApp from "./SoundApp";

export default class Navbar {
    //file: HTMLDivElement;
    edit: HTMLDivElement;

    constructor() {
        //this.file = (document.getElementById("navbar_file") as HTMLDivElement);
        /*
        this.file.addEventListener("click", () => {
            SoundApp.instance.contextMenu.show([
                {
                    text: "Upload and convert song to mp4...", onselect: () => {
                        SoundApp.instance.uploadAndConvertFileToMp4();
                    }
                },
                {
                    text: "Upload and convert song to m4a...", onselect: () => {
                        SoundApp.instance.uploadAndConvertFileToM4a();
                    }
                }
            ], this.file.getBoundingClientRect().x + 10, this.file.getBoundingClientRect().y + this.file.getBoundingClientRect().height)
        });
        */
        this.edit = (document.getElementById("navbar_edit") as HTMLDivElement);
        this.edit.addEventListener("click", () => {
            if (SoundApp.instance.songPlayer.song != null) {
                SoundApp.instance.contextMenu.show([
                    {
                        text: "Metadata...", onselect: () => {
                            SoundApp.instance.editCurrentSongMeta();
                        }
                    }
                ], this.edit.getBoundingClientRect().x + 10, this.edit.getBoundingClientRect().y + this.edit.getBoundingClientRect().height)
            }
        });
    }
}