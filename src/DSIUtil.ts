import CamButton from "./CamButton";
import CamPhoto from "./CamPhoto";
import DayGridItem from "./DayGridItem";
import DSIMenuButton from "./DSIMenuButton";
import GridItem from "./GridItem";
import PhotoGridItem from "./PhotoGridItem";

export default class DSIUtil {
    dirselect: HTMLInputElement;
    sdcardbutton: CamButton;
    static instance: DSIUtil;

    preview: HTMLImageElement;
    photodate: HTMLDivElement;
    currentGridItemSelected: number = -1;
    static griditems: Array<GridItem> = [];
    galleryslider: HTMLInputElement;
    dsicamerabutton: DSIMenuButton;
    constructor() {
        DSIUtil.instance = this;
        this.dirselect = (document.getElementById("dirselect") as HTMLInputElement);

        this.preview = (document.getElementById("preview") as HTMLImageElement);
        this.photodate = (document.getElementById("photodate") as HTMLDivElement);

        this.galleryslider = (document.getElementById("galleryslider") as HTMLInputElement);
        this.dsicamerabutton = new DSIMenuButton(document.getElementById("dsicamerabutton") as HTMLDivElement, () => {
            (document.getElementById("menuscreen") as HTMLDivElement).style.display = "none";
            (document.getElementById("menufooter") as HTMLDivElement).style.display = "none";
            (document.getElementById("camerafooter") as HTMLDivElement).style.display = "inherit";

            (document.getElementById("sdcardscreen-camera") as HTMLDivElement).style.display = "inherit";
            (document.getElementById("sdcardscreen-camera") as HTMLDivElement).style.display = "inherit";
            document.body.style.backgroundImage = "url(\"looping.png\")";
            (document.getElementById("navbar") as HTMLDivElement).style.backgroundColor = "#82658a";

        });
        this.sdcardbutton = new CamButton(document.getElementById("sdcardbutton") as HTMLDivElement, () => {
            this.sdcardbutton.selected = true;
            this.dirselect.click();
            this.dirselect.addEventListener("cancel", (ev) => {
                this.sdcardbutton.selected = false;
            });
            this.dirselect.addEventListener("change", () => {
                this.loadPreviewMenu();
            });
        });
    };

    loadPreviewMenu() {
        if (this.dirselect.files != null) {
            for (let i = 0; i < this.dirselect.files.length; i++) {
                const file = this.dirselect.files.item(i);
                if (file != null) {
                    this.parseFile(file);
                }
            }
            if (this.photos.length == 0) {
                this.sdcardbutton.selected = false;
                alert("No photos were found.")
                return;
            }
            (document.getElementById("sdcardscreen-camera") as HTMLDivElement).style.display = "none";
            (document.getElementById("albumscreen") as HTMLDivElement).style.display = "flex";
            (document.getElementById("camerafooter") as HTMLDivElement).style.display = "none";

            document.body.style.backgroundImage = "url(\"looping_album.png\")";
            (document.getElementById("navbar") as HTMLDivElement).style.backgroundColor = "#ff5900";
            this.photos.sort((a, b) => {
                return a.photo.lastModified - b.photo.lastModified;
            });
            (document.getElementById("photoscount") as HTMLDivElement).innerText = "" + this.photos.length;
            for (let i = 0; i < this.photos.length; i++) {
                let photo = this.photos[i];
                if (i != 0) {
                    let prevPhoto = this.photos[i - 1];
                    let newPhotoDate = new Date(photo.photo.lastModified);
                    if (new Date(prevPhoto.photo.lastModified).getDay() != (newPhotoDate.getDay())) {
                        DSIUtil.griditems.push(new DayGridItem(newPhotoDate));
                    }
                }
                else {
                    DSIUtil.griditems.push(new DayGridItem(new Date(photo.photo.lastModified)));
                }
                DSIUtil.griditems.push(new PhotoGridItem(photo));
            }
            DSIUtil.griditems.push(new GridItem(document.getElementById("totalphotos") as HTMLDivElement))
            this.setGridItem(DSIUtil.griditems.length - 1);
            this.galleryslider.max = "" + (DSIUtil.griditems.length - 1);
            this.galleryslider.addEventListener("input", (ev) => {
                this.setGridItem(this.galleryslider.valueAsNumber);
            });
            requestAnimationFrame(DSIUtil.instance.updatePreview);
        }
    }

    setGridItem(id: number) {
        this.currentGridItemSelected = id;
        this.galleryslider.valueAsNumber = this.currentGridItemSelected;
        let item = DSIUtil.griditems[id];
        if (item instanceof PhotoGridItem) {
            this.preview.style.opacity = "1";
            item.photo.applyToPreview();
        } else {
            this.preview.style.opacity = "0";
        }
    }

    updatePreview() {
        for (let i = 0; i < DSIUtil.griditems.length; i++) {
            DSIUtil.griditems[i].update();
        }
        requestAnimationFrame((time) => {
            DSIUtil.instance.updatePreview();
        });
    }

    photos: Array<CamPhoto> = [];

    async parseFile(file: File) {
        // authentic DSI camera app photos
        let nintendoDSICameraPhoto = file.name.startsWith("HNI_") && file.name.endsWith(".JPG");
        // photos taken using https://github.com/Epicpkmn11/dsi-camera 
        // (.png), some might prefer for slightly higher quality
        // we will handle it because we can and probably should considering this app has 0 ui for viewing photos
        let dsiCameraHomebrewPhoto = file.name.startsWith("IMG_") && file.name.endsWith(".PNG");

        if (nintendoDSICameraPhoto || dsiCameraHomebrewPhoto) {
            this.photos.push(new CamPhoto(file));
        }
    }
}
let app = new DSIUtil();
