export default class PhotoDateDisplay {
    constructor(div) {
        this.div = div;
    }
    setDate(date) {
        this.div.innerText = date.toLocaleString();
    }
}
