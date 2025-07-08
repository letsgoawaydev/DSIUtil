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
        CameraApp.instance.preview.applyPhoto(this);
        CameraApp.instance.photodate.setDate(new Date(this.photo.lastModified));
    }
}