import CamPhoto from "../../../camera/CamPhoto";

export default class PreviewPhoto {
    img: HTMLImageElement;
    photo: CamPhoto | null = null;
    constructor(img: HTMLImageElement) {
        this.img = img;
    }

    angle = 0;

    updateAngle() {
        this.angle = this.angle % 360;
        this.img.style.transformOrigin = "center";
        this.img.style.transform = `rotate(${this.angle}deg)`
    }

    applyPhoto(photo: CamPhoto) {
        this.photo = photo;
        if (photo.url == null) {
            photo.url = photo.createURL();
        }
        this.img.src = photo.url;
    }
    // holy null checks
    download() {
        if (this.photo == null) {
            return;
        }
        let img = document.createElement("img");
        img.src = this.img.src;
        img.addEventListener("load", () => {
            if (this.photo != null) {
                let vertical: boolean = Math.round(this.angle) == 90 || Math.round(this.angle) == 270;
                let canvas = new OffscreenCanvas(vertical ? img.height : img.width, vertical ? img.width : img.height)
                let ctx = canvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
                ctx.imageSmoothingEnabled = false;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(this.angle * Math.PI / 180);
                ctx.drawImage(img, -img.width / 2, -img.height / 2);
                canvas.convertToBlob({ type: this.photo.photo.type, quality: 1 }).then((blob) => {
                    if (this.photo != null) {
                        let link = document.createElement('a');
                        link.download = `${this.photo.photo.name}`;
                        link.href = URL.createObjectURL(blob);
                        link.click();
                    }
                })
            }
        })



    }
}