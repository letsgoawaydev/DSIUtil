import CamPhoto from "./CamPhoto";
import GridItem from "./GridItem";

export default class PhotoGridItem extends GridItem {
    photo:CamPhoto;
    constructor(photo: CamPhoto) {
        let elem = document.createElement("div");
        elem.classList.add("griditem", "griditemphoto");
        elem.style.backgroundImage = `url(${photo.url})`;
        
        (document.getElementById("gallery") as HTMLDivElement).appendChild(elem);
        super(elem);
        this.photo = photo;
    }
}