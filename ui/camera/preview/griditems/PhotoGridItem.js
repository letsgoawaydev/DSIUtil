import GridItem from "./GridItem";
export default class PhotoGridItem extends GridItem {
    constructor(photo) {
        let div = document.createElement("div");
        div.classList.add("griditem", "griditemphoto");
        super(div);
        this.photo = photo;
        document.getElementById("gallery").appendChild(div);
    }
    offscreenStyle() {
        super.offscreenStyle();
        this.div.style.backgroundImage = ``;
        this.photo.revokeURL();
    }
    onscreenStyle() {
        super.onscreenStyle();
        if (this.photo.url == null) {
            this.photo.url = this.photo.createURL();
        }
        this.div.style.backgroundImage = `url(${this.photo.url})`;
    }
}
