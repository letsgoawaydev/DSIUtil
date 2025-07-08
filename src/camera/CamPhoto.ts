import CameraApp from "./CameraApp";


export default class CamPhoto {
    public photo: File;
    public url: string | null;
    constructor(photo: File) {
        this.photo = photo;
        this.url = null;
    }

    revokeURL() {
        if (this.url != null) {
            URL.revokeObjectURL(this.url);
            this.url = null;
        }
    }

    createURL() {
        this.revokeURL();
        return URL.createObjectURL(this.photo);
    }

    applyToPreview() {
        if (this.url == null) {
            this.url = this.createURL();
        }
        CameraApp.instance.preview.src = this.url;
        CameraApp.instance.photodate.setDate(new Date(this.photo.lastModified));
    }
}