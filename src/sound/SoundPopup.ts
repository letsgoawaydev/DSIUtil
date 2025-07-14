import { FileArray } from "../fs/Files";
import Metadata from "./Metadata";
import SoundApp from "./SoundApp";
import SoundPopupButton from "./SoundPopupButton";



export default class SoundPopup {
    static show() {
        SoundPopup.hide();
        (document.getElementById("soundpopupbg") as HTMLDivElement).style.display = "inherit";
        (document.getElementById("soundpopup") as HTMLDivElement).style.display = "flex";
        (document.getElementById("soundpopup_buttons") as HTMLDivElement).textContent = ``;

    }

    static hide() {
        (document.getElementById("soundpopupbg") as HTMLDivElement).style.display = "none";
        (document.getElementById("soundpopup") as HTMLDivElement).style.display = "none";
        (document.getElementById("metadatawindow") as HTMLDivElement).style.display = "none";
        (document.getElementById("progresswindow") as HTMLDivElement).style.display = "none";
        (document.getElementById("textinputwindow") as HTMLDivElement).style.display = "none";
        (document.getElementById("songinputwindow") as HTMLDivElement).style.display = "none";
    }

    private static metadata: Promise<Metadata>;

    static openMetadata(startmeta: Metadata): Promise<Metadata> {
        SoundPopup.show();
        this.setTitle("Edit Metadata");

        (document.getElementById("metadatawindow") as HTMLDivElement).style.display = "flex";
        SoundPopup.metadata = new Promise<Metadata>((resolve, reject) => {
            let title: HTMLInputElement = (document.getElementById("metadata_title") as HTMLInputElement);
            if (startmeta.title != null) {
                title.value = startmeta.title;
            } else {
                title.value = "";
            }
            let artist: HTMLInputElement = (document.getElementById("metadata_artist") as HTMLInputElement);
            if (startmeta.artist != null) {
                artist.value = startmeta.artist;
            }
            else {
                artist.value = "";
            }
            let album: HTMLInputElement = (document.getElementById("metadata_album") as HTMLInputElement);
            if (startmeta.album != null) {
                album.value = startmeta.album;
            }
            else {
                album.value = "";
            }
            let trackNo: HTMLInputElement = (document.getElementById("metadata_track_no") as HTMLInputElement);
            let trackOf: HTMLInputElement = (document.getElementById("metadata_track_of") as HTMLInputElement);
            if (startmeta.track != null) {
                if (startmeta.track.no != null) {
                    trackNo.valueAsNumber = startmeta.track.no;
                }
                else {
                    trackNo.value = "";
                }
                if (startmeta.track.of != null) {
                    trackOf.valueAsNumber = startmeta.track.of;
                }
                else {
                    trackOf.value = "";
                }
            }
            let year: HTMLInputElement = (document.getElementById("metadata_year") as HTMLInputElement);
            if (startmeta.year != null) {
                year.valueAsNumber = startmeta.year;
            }
            else {
                year.value = "";
            }


            let cancelButton = new SoundPopupButton("Cancel", () => {
                SoundPopup.hide();
                reject("cancelled");
            });


            let nextButton = new SoundPopupButton("Next", () => {
                SoundPopup.hide();
                SoundPopup.openProgress();
                resolve(SoundPopup.getMeta());
            });

        });
        return SoundPopup.metadata;
    }

    static openSongInput(extension: String = "mp4", onNext: (files: FileArray) => {}, onConvert: (output: Uint8Array, original: File) => void, onFinish: VoidFunction): Promise<FileArray> {
        SoundPopup.show();
        this.setTitle("Upload Songs");

        (document.getElementById("songinputwindow") as HTMLDivElement).style.display = "flex";

        return new Promise((resolve, reject) => {
            let cancelButton = new SoundPopupButton("Cancel", () => {
                SoundPopup.hide();
                reject("cancelled");
            });


            let nextButton = new SoundPopupButton("Next", () => {
                SoundPopup.openProgress();
                let files: FileList | null = (document.getElementById("songinput") as HTMLInputElement).files;

                if (files != null) {
                    resolve(files);
                    onNext(files);
                    SoundApp.instance.convertFiles(files, extension, onConvert, onFinish, true);
                }
            });


        })
    }

    static openProgress() {
        SoundPopup.show();
        (document.getElementById("soundpopup-title") as HTMLDivElement).innerText = "Converting...";
        (document.getElementById("progresswindow") as HTMLDivElement).style.display = "flex";
    }

    static openTextInput(title: string, iconPath: string, placeholder: string, acceptButtonText: string, value?: string): Promise<string> {
        SoundPopup.show();
        (document.getElementById("textinputwindow") as HTMLDivElement).style.display = "flex";
        this.setTitle(title);
        (document.getElementById("textinput-img") as HTMLImageElement).src = iconPath;
        let input: HTMLInputElement = (document.getElementById("textinput-sound") as HTMLInputElement);
        input.placeholder = placeholder;
        if (value != null) {
            input.value = value;
        }
        return new Promise<string>((resolve, reject) => {
            let cancelButton = new SoundPopupButton("Cancel", () => {
                SoundPopup.hide();
                reject("cancelled");
            });


            let createButton = new SoundPopupButton(acceptButtonText, () => {
                SoundPopup.hide();
                resolve(input.value);
            });

        })
    }

    static setTitle(title:string) {
        (document.getElementById("soundpopup-title") as HTMLDivElement).innerText = title;
    }

    static getMeta(): Metadata {
        let title: HTMLInputElement = (document.getElementById("metadata_title") as HTMLInputElement);
        let artist: HTMLInputElement = (document.getElementById("metadata_artist") as HTMLInputElement);
        let album: HTMLInputElement = (document.getElementById("metadata_album") as HTMLInputElement);
        let trackNo: HTMLInputElement = (document.getElementById("metadata_track_no") as HTMLInputElement);
        let trackOf: HTMLInputElement = (document.getElementById("metadata_track_of") as HTMLInputElement);
        let year: HTMLInputElement = (document.getElementById("metadata_year") as HTMLInputElement);

        let trackNoValid = (!Number.isNaN(trackNo.valueAsNumber) && trackNo.value != "");
        let trackOfValid = (!Number.isNaN(trackOf.valueAsNumber) && trackOf.value != "");

        return {
            title: title.value != "" ? title.value : undefined,
            artist: artist.value != "" ? artist.value : undefined,
            album: album.value != "" ? album.value : undefined,
            track: (trackNoValid || trackOfValid) ? ({
                no: trackNoValid ? trackNo.valueAsNumber : undefined,
                of: trackOfValid ? trackOf.valueAsNumber : undefined,
            }) : undefined,
            year: (!Number.isNaN(year.valueAsNumber) && year.value != "") ? year.valueAsNumber : undefined
        }
    }

}