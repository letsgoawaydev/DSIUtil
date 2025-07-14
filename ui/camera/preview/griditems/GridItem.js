import CameraApp from "../../../../camera/CameraApp";
class GridItem {
    constructor(div) {
        this.id = CameraApp.griditems.length;
        console.log(this.id);
        this.div = div;
        this.div.addEventListener("click", (ev) => {
            CameraApp.instance.setGridItem(this.id);
        });
        this.x = 0;
        this.y = 0;
    }
    update() {
        this.x = window.innerWidth / 2 - (GridItem.GRID_WIDTH / 2);
        this.x += -160 * (CameraApp.instance.currentGridItemSelected - this.id);
        let progress = (this.div.getBoundingClientRect().x + (GridItem.GRID_WIDTH / 2)) / window.innerWidth;
        if (progress > 0.5) {
            progress = 1.0 - progress;
        }
        this.y = 48 * progress;
        if (-200 > this.x + GridItem.GRID_WIDTH || this.x > (window.innerWidth + 200)) {
            this.offscreenStyle();
            return;
        }
        this.onscreenStyle();
    }
    offscreenStyle() {
        this.div.style.display = `none`;
    }
    onscreenStyle() {
        this.div.style.display = `inherit`;
        if (CameraApp.instance.currentGridItemSelected == this.id) {
            this.div.style.border = "8px ridge #ff9230";
            this.div.style.outline = "2px solid white";
            this.div.style.borderRadius = "8px";
            //            this.div.style.outlineOffset = "-8px";
        }
        else {
            this.div.style.border = "";
            this.div.style.outline = "";
            this.div.style.borderRadius = "";
        }
        this.div.style.left = `${this.x}px`;
        this.div.style.top = `${this.y}px`;
    }
}
GridItem.GRID_WIDTH = 128;
GridItem.GRID_HEIGHT = 128;
export default GridItem;
