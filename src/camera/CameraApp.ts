import CamButton from "../ui/camera/CamButton";
import CamPhoto from "./CamPhoto";
import DayGridItem from "../ui/camera/preview/griditems/DayGridItem";
import DSIMenuButton from "../ui/menu/DSIMenuButton";
import GridItem from "../ui/camera/preview/griditems/GridItem";
import PhotoGridItem from "../ui/camera/preview/griditems/PhotoGridItem";
import PhotoDateDisplay from "../ui/camera/preview/PhotoDateDisplay";
import PreviewPhoto from "../ui/camera/preview/PreviewPhoto";
import { DirectoryHandleFunction, FileArray } from "../fs/Files";


export default class CameraApp {
    dirselect: HTMLInputElement;
    sdcardbutton: CamButton;
    static instance: CameraApp;

    preview: PreviewPhoto;
    photodate: PhotoDateDisplay;
    currentGridItemSelected: number = -1;
    static griditems: Array<GridItem> = [];
    galleryslider: HTMLInputElement;


    // buttons
    rotatebutton: CamButton;
    downloadbutton: CamButton;

    constructor() {
        CameraApp.instance = this;
        if (!("chrome" in window)) {
            alert("Hi, please note that non chromium browsers aren't fully supported, so you may experience issues")
        }

        (document.getElementById("camerafooter") as HTMLDivElement).style.display = "inherit";

        (document.getElementById("sdcardscreen-camera") as HTMLDivElement).style.display = "inherit";
        (document.getElementById("sdcardscreen-camera") as HTMLDivElement).style.display = "inherit";
        document.body.style.backgroundImage = "url(\"looping.png\")";

        this.dirselect = (document.getElementById("dirselect") as HTMLInputElement);

        this.preview = new PreviewPhoto(document.getElementById("preview") as HTMLImageElement);
        this.photodate = new PhotoDateDisplay(document.getElementById("photodate") as HTMLDivElement);

        this.galleryslider = (document.getElementById("galleryslider") as HTMLInputElement);
        this.sdcardbutton = new CamButton(document.getElementById("sdcardbutton") as HTMLDivElement, () => {
            this.sdcardbutton.selected = true;
            this.filePick();
        });


        this.rotatebutton = new DSIMenuButton(document.getElementById("rotatebutton") as HTMLDivElement, () => {
            this.preview.angle += 90;
            this.preview.updateAngle();
        });

        this.downloadbutton = new DSIMenuButton(document.getElementById("downloadbutton") as HTMLDivElement, () => {
            this.preview.download();
        });
    };

    filePick() {
        if ("showDirectoryPicker" in window) {
            // what are we doing bro
            (window.showDirectoryPicker as DirectoryHandleFunction)().then(async (handle) => {
                try {
                    await this.getAllFiles(handle);
                }
                catch (e) {
                    alert("Please ensure you are picking the root of your SD Card and not any folders inside of it.")
                    this.sdcardbutton.selected = false;
                }
            }).catch(() => {
                this.sdcardbutton.selected = false;
            });
        }
        else {
            this.dirselect.click();
            this.dirselect.addEventListener("cancel", (ev) => {
                this.sdcardbutton.selected = false;
            });
            this.dirselect.addEventListener("change", () => {
                if (this.dirselect.files != null) {
                    this.loadPreviewMenu(this.dirselect.files);
                }
            });
        }
    }

    async getAllFiles(fh: FileSystemDirectoryHandle) {
        let fl: Array<File> = [];

        let DCIM: FileSystemDirectoryHandle;

        DCIM = await fh.getDirectoryHandle("DCIM");

        for await (const file of this.getFilesRecursively(DCIM)) {
            fl.push(file);
        }
        this.loadPreviewMenu(fl);
    }


    async *getFilesRecursively(entry: FileSystemHandle): AsyncGenerator<File> {
        if (entry instanceof FileSystemFileHandle) {
            const file = await entry.getFile();
            if (file !== null) {
                yield file;
            }
        } else if (entry instanceof FileSystemDirectoryHandle) {
            // type script what the fuck are we doing
            for await (const handle of (entry as any).values()) {
                yield* this.getFilesRecursively(handle);
            }
        }
    }

    loadPreviewMenu(files: FileArray) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
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
                    CameraApp.griditems.push(new DayGridItem(newPhotoDate));
                }
            }
            else {
                CameraApp.griditems.push(new DayGridItem(new Date(photo.photo.lastModified)));
            }
            CameraApp.griditems.push(new PhotoGridItem(photo));
        }
        CameraApp.griditems.push(new GridItem(document.getElementById("totalphotos") as HTMLDivElement))
        this.setGridItem(CameraApp.griditems.length - 1);
        this.galleryslider.max = "" + (CameraApp.griditems.length - 1);
        this.galleryslider.addEventListener("input", (ev) => {
            this.setGridItem(this.galleryslider.valueAsNumber);
        });
        requestAnimationFrame(CameraApp.instance.updatePreview);
    }

    setGridItem(id: number) {
        this.currentGridItemSelected = id;
        this.galleryslider.valueAsNumber = this.currentGridItemSelected;
        let item = CameraApp.griditems[id];
        this.preview.angle = 0;
        this.preview.updateAngle();
        if (item instanceof PhotoGridItem) {
            this.preview.img.style.opacity = "1";
            this.photodate.div.style.opacity = "1";
            (document.getElementById("buttons") as HTMLDivElement).style.opacity = "1";


            item.photo.applyToPreview();
        } else {
            this.photodate.div.style.opacity = "0";
            this.preview.img.style.opacity = "0";
            (document.getElementById("buttons") as HTMLDivElement).style.opacity = "0";
        }
    }

    updatePreview() {
        for (let i = 0; i < CameraApp.griditems.length; i++) {
            CameraApp.griditems[i].update();
        }
        requestAnimationFrame((time) => {
            CameraApp.instance.updatePreview();
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
