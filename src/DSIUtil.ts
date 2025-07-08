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
            (document.getElementById("menuscreen") as HTMLDivElement).style.display = "none";
            (document.getElementById("menufooter") as HTMLDivElement).style.display = "none";
            this.camera = new CameraApp();
        });
        this.dsisoundbutton = new DSIMenuButton(document.getElementById("dsisoundbutton") as HTMLDivElement, () => {
            //(document.getElementById("menuscreen") as HTMLDivElement).style.display = "none";
            //(document.getElementById("menufooter") as HTMLDivElement).style.display = "none";
            //this.sound = new SoundApp();
        });
    };
}
let app = new DSIUtil();
