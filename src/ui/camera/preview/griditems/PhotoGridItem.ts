import CamPhoto from "../../../../camera/CamPhoto";
import GridItem from "./GridItem";

export default class PhotoGridItem extends GridItem {
    public photo: CamPhoto;
    constructor(photo: CamPhoto) {
        let div = document.createElement("div");
        div.classList.add("griditem", "griditemphoto");
        super(div);
        this.photo = photo;
        (document.getElementById("gallery") as HTMLDivElement).appendChild(div);
    }

    offscreenStyle(): void {
        super.offscreenStyle();

        this.div.style.backgroundImage = ``;
        this.photo.revokeURL();
    }

    onscreenStyle(): void {

        super.onscreenStyle();
        if (this.photo.url == null) {
            this.photo.url = this.photo.createURL();
        }
        this.div.style.backgroundImage = `url(${this.photo.url})`;
    }
}