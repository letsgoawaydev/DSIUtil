export default class PhotoDateDisplay {
    div:HTMLDivElement;
    constructor(div:HTMLDivElement) {
        this.div = div;
    }

    public setDate(date:Date) {
        this.div.innerText = date.toLocaleString();
    }
}