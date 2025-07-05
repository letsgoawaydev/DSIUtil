import DSIUtil from "./DSIUtil";

export default class GridItem {
    div: HTMLDivElement;
    x: number;
    y: number;
    id: number;
    private static GRID_WIDTH = 128;
    private static GRID_HEIGHT = 128;

    constructor(div: HTMLDivElement) {
        this.id = DSIUtil.griditems.length;
        console.log(this.id);
        this.div = div;
        this.div.addEventListener("click", (ev) => {
            DSIUtil.instance.setGridItem(this.id);
        })

        this.x = 0;
        this.y = 0;
        this.update();
    }
    update() {

        this.x = window.innerWidth / 2 - (GridItem.GRID_WIDTH / 2);
        this.x += -160 * (DSIUtil.instance.currentGridItemSelected - this.id);


        let progress = (this.div.getBoundingClientRect().x + (GridItem.GRID_WIDTH / 2)) / window.innerWidth;
        if (progress > 0.5) {
            progress = 1.0 - progress;
        }
        this.y = 48 * progress;


        if (-200 > this.x + GridItem.GRID_WIDTH || this.x > (window.innerWidth + 200)) {
            this.div.style.display = `none`;
            return;
        }
        else {
            this.div.style.display = `inherit`;
        }

        if (DSIUtil.instance.currentGridItemSelected == this.id) {
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