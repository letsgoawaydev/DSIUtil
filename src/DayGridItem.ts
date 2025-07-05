import GridItem from "./GridItem";

export default class DayGridItem extends GridItem {
    constructor(date: Date) {
        let elem = document.createElement("div");
        elem.classList.add("griditem", "infogriditem");

        let datearrow = document.createElement("div");
        datearrow.classList.add("datearrow");
        datearrow.innerText = "🡆";
        elem.appendChild(datearrow);
        
        let datemonthday = document.createElement("div");
        datemonthday.classList.add("datemonthday");
        datemonthday.innerText = date.getDay() + "/" + date.getMonth();
        elem.appendChild(datemonthday);

        
        let dateyear = document.createElement("div");
        dateyear.classList.add("dateyear");
        dateyear.innerText = date.getFullYear()+"";
        elem.appendChild(dateyear);

        (document.getElementById("gallery") as HTMLDivElement).appendChild(elem);
        super(elem);
    }
}