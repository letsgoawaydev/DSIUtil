import CamButton from "./ui/camera/CamButton";
import CamPhoto from "./camera/CamPhoto";
import DayGridItem from "./ui/camera/preview/griditems/DayGridItem";
import DSIMenuButton from "./ui/menu/DSIMenuButton";
import GridItem from "./ui/camera/preview/griditems/GridItem";
import PhotoGridItem from "./ui/camera/preview/griditems/PhotoGridItem";
import CameraApp from "./camera/CameraApp";

export default class DSIUtil {
    static instance: DSIUtil;
    dsicamerabutton: DSIMenuButton;
    dsisoundbutton: DSIMenuButton;

    camera:CameraApp | null = null;
    constructor() {
        DSIUtil.instance = this;
       
        this.dsicamerabutton = new DSIMenuButton(document.getElementById("dsicamerabutton") as HTMLDivElement, () => {
            (document.getElementById("menuscreen") as HTMLDivElement).style.display = "none";
            (document.getElementById("menufooter") as HTMLDivElement).style.display = "none";
            this.camera = new CameraApp();
        });
        this.dsisoundbutton = new DSIMenuButton(document.getElementById("dsisoundbutton") as HTMLDivElement,()=>{});
    };
}
let app = new DSIUtil();
