import DSIUtil from "./DSIUtil";


export default class CamPhoto {
    public photo: File;
    public url: string;
    constructor(photo: File) {
        this.photo = photo;
        this.url = URL.createObjectURL(this.photo);
    }

    applyToPreview() {
        DSIUtil.instance.preview.src = this.url;
        DSIUtil.instance.photodate.innerText = new Date(this.photo.lastModified).toLocaleString();
    }
}