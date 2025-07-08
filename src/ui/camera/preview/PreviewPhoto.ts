import CamPhoto from "../../../camera/CamPhoto";

export default class PreviewPhoto {
    img: HTMLImageElement;
    constructor(img: HTMLImageElement) {
        this.img = img;
    }

    applyPhoto(photo: CamPhoto) { 
        if (photo.url == null){
            photo.url = photo.createURL();
        }
        this.img.src = photo.url;
    }
}