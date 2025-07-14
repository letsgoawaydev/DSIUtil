export default class SoundPopupButton {
    button: HTMLButtonElement;
    constructor(text: string, callback: VoidFunction) {
        this.button = document.createElement("button");
        this.button.classList.add("soundpopup_button");
        this.button.innerText = text;
        (document.getElementById("soundpopup_buttons") as HTMLDivElement).appendChild(this.button);
        this.button.addEventListener("click", () => {
            callback();
        });
    }
}