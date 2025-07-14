export default class DSIMenuButton {
    constructor(div, callback) {
        this.div = div;
        this.div.addEventListener("click", () => {
            callback();
        });
    }
    set selected(b) {
        if (b) {
            if (!this.div.classList.contains("dsimenubutton_selected")) {
                this.div.classList.add("dsimenubutton_selected");
            }
        }
        else {
            this.div.classList.remove("dsimenubutton_selected");
        }
    }
    get selected() {
        return this.div.classList.contains("dsimenubutton_selected");
    }
}
