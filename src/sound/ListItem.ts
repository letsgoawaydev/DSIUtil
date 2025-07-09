export default class ListItem {
    div: HTMLDivElement;
    text: HTMLDivElement;
    icondiv: HTMLDivElement;
    icon: HTMLImageElement;
    constructor() {
        this.div = document.createElement("div");
        this.div.classList.add("listitem");
        (document.getElementById("songlist") as HTMLDivElement).appendChild(this.div);

        this.icondiv = document.createElement("div");
        this.icondiv.classList.add("listitem_icondiv");
        this.div.appendChild(this.icondiv);

        this.icon = document.createElement("img");
        this.icon.classList.add("listitem_icon");
        this.icon.src = "assets/textures/sound/music.png";

        this.text = document.createElement("div");
        this.text.innerText = "PLACEHOLDER";
        this.text.classList.add("listitem_text");
        this.div.appendChild(this.text);

        this.icondiv.appendChild(this.icon);

    }
}