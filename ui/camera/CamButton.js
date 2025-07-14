export default class CamButton {
    constructor(div, callback) {
        this.div = div;
        this.div.addEventListener("click", () => {
            callback();
        });
    }
    set selected(b) {
        if (b) {
            if (!this.div.classList.contains("cambutton_selected")) {
                this.div.classList.add("cambutton_selected");
            }
        }
        else {
            this.div.classList.remove("cambutton_selected");
        }
    }
    get selected() {
        return this.div.classList.contains("cambutton_selected");
    }
}
