import DSIMenuButton from "./ui/menu/DSIMenuButton";
import CameraApp from "./camera/CameraApp";
import SoundApp from "./sound/SoundApp";

export default class DSIUtil {
    static instance: DSIUtil;
    dsicamerabutton: DSIMenuButton;
    dsisoundbutton: DSIMenuButton;

    camera: CameraApp | null = null;
    sound: SoundApp | null = null;

    constructor() {
        DSIUtil.instance = this;

        this.dsicamerabutton = new DSIMenuButton(document.getElementById("dsicamerabutton") as HTMLDivElement, () => {
            this.hideMenu();
            this.camera = new CameraApp();
        });
        this.dsisoundbutton = new DSIMenuButton(document.getElementById("dsisoundbutton") as HTMLDivElement, () => {
            if ("chrome" in window) {
                this.hideMenu();
                this.sound = new SoundApp();
            }
            else {
                alert("Sorry, DSi Sound file uploading only works with Chromium browsers. (e.g Google Chrome, Microsoft Edge). \n This is a limitation of the browsers engine you are using and cannot be fixed for your browser.");
            }
        });
    };

    hideMenu() {
        (document.getElementById("menuscreen") as HTMLDivElement).style.display = "none";
        (document.getElementById("menufooter") as HTMLDivElement).style.display = "none";
    }
}
let app = new DSIUtil();
