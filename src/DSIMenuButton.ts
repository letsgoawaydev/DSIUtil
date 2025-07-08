export default class DSIMenuButton {
    public div: HTMLDivElement;
    constructor(div: HTMLDivElement, callback: VoidFunction) {
        this.div = div;
        this.div.addEventListener("click", () => {
            callback();
        });
    }
    set selected(b: boolean) {
        if (b) {
            if (!this.div.classList.contains("dsimenubutton_selected")) {
                this.div.classList.add("dsimenubutton_selected");
            }
        }
        else {
            this.div.classList.remove("dsimenubutton_selected");
        }
    }
    get selected(): boolean {
        return this.div.classList.contains("dsimenubutton_selected");
    }
}