export default class PreviewPhoto {
    constructor(img) {
        this.img = img;
    }
    applyPhoto(photo) {
        if (photo.url == null) {
            photo.url = photo.createURL();
        }
        this.img.src = photo.url;
    }
}
