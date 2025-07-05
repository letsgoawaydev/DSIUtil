export default class CamButton {
    public div: HTMLDivElement;
    constructor(div: HTMLDivElement, callback: VoidFunction) {
        this.div = div;
        this.div.addEventListener("click", () => {
            callback();
        });
    }
    set selected(b: boolean) {
        if (b) {
            if (!this.div.classList.contains("cambutton_selected")) {
                this.div.classList.add("cambutton_selected");
            }
        }
        else {
            this.div.classList.remove("cambutton_selected");
        }
    }
    get selected(): boolean {
        return this.div.classList.contains("cambutton_selected");
    }
}