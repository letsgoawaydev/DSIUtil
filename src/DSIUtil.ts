import CamButton from "./CamButton";
import CamPhoto from "./CamPhoto";
import DayGridItem from "./DayGridItem";
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
    constructor() {
        DSIUtil.instance = this;
        this.dirselect = (document.getElementById("dirselect") as HTMLInputElement);

        this.preview = (document.getElementById("preview") as HTMLImageElement);
        this.photodate = (document.getElementById("photodate") as HTMLDivElement);

        this.galleryslider = (document.getElementById("galleryslider") as HTMLInputElement);
        this.sdcardbutton = new CamButton(document.getElementById("sdcardbutton") as HTMLDivElement, () => {
            this.sdcardbutton.selected = true;
            this.dirselect.click();
            this.dirselect.addEventListener("cancel", (ev) => {
                this.sdcardbutton.selected = false;
            });
            this.dirselect.addEventListener("change", () => {
                if (this.dirselect.files != null) {
                    (document.getElementById("initialscreen") as HTMLDivElement).style.display = "none";
                    (document.getElementById("albumscreen") as HTMLDivElement).style.display = "flex";
                    document.body.style.backgroundImage = "url(\"looping_album.png\")";
                    (document.getElementById("navbar") as HTMLDivElement).style.backgroundColor = "#ff5900";
                    for (let i = 0; i < this.dirselect.files.length; i++) {
                        const file = this.dirselect.files.item(i);
                        if (file != null) {
                            this.parseFile(file);
                        }
                    }
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
            });
        });
    };

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
        if (file.name.startsWith("HNI_") && file.name.endsWith(".JPG")) {
            this.photos.push(new CamPhoto(file));
        }
    }
}
let app = new DSIUtil();
