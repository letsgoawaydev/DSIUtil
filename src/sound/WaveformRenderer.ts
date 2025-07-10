import SoundApp from "./SoundApp";

export default class WaveformRenderer {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    WIDTH: number;
    HEIGHT: number;
    constructor(canvas: HTMLCanvasElement, audio?: HTMLAudioElement) {
        this.canvas = canvas;
        this.ctx = (canvas.getContext("2d") as CanvasRenderingContext2D);
        if (audio != null) {
            this.initialize(audio);
        }
        this.HEIGHT = this.canvas.height;
        this.WIDTH = this.canvas.width;
        this.ctx.imageSmoothingEnabled = false;
        this.canvas.addEventListener("contextmenu", (ev) => {
            ev.preventDefault();
        });
        this.canvas.addEventListener("mouseover", (ev) => {
            SoundApp.instance.metadataCanvas_renderer.setSong(SoundApp.instance.songPlayer.song);
        });
    }

    audio: HTMLMediaElement | null = null;
    audioCtx: AudioContext | null = null;
    analyser: AnalyserNode | null = null;
    source: MediaElementAudioSourceNode | null = null;
    bufferLength: number = -1;
    dataArray: Uint8Array<ArrayBuffer> | null = null;
    initialize(audio: HTMLMediaElement) {
        this.audio = audio;
        this.audioCtx = new AudioContext();
        this.analyser = this.audioCtx.createAnalyser();
        this.source = this.audioCtx.createMediaElementSource(audio);
        this.source.connect(this.analyser);
        this.analyser.connect(this.audioCtx.destination);
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
    }
    draw() {
        this.canvas.width = Math.round(window.innerWidth / 8);
        this.canvas.style.width = Math.round(window.innerWidth / 2) + "px";

        this.canvas.height = Math.round(this.canvas.getBoundingClientRect().height / 4);
        this.HEIGHT = this.canvas.height;
        this.WIDTH = this.canvas.width;
        this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
        this.renderWaveform();
    }

    renderWaveform() {
        if (this.analyser != null && this.dataArray != null) {
            this.analyser.getByteTimeDomainData(this.dataArray);
        }
        // Fill solid color
        //  canvasCtx.fillStyle = "rgb(200 200 200)";
        //  canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
        // Begin the path

        this.drawLine("#304048", 0, 1);
        this.drawLine("#608098", 0, 0);
    }


    drawLine(strokeStyle: string, xOffset: number, yOffset: number) {
        if (this.bufferLength != -1 && this.dataArray != null) {
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = strokeStyle;
            this.ctx.beginPath();
            // Draw each point in the waveform
            const sliceWidth = this.WIDTH / this.bufferLength;
            let x = 0;
            let lastY = 0;
            for (let i = 0; i < this.bufferLength; i++) {
                const v = this.dataArray[i] / 128.0;
                const y = v * Math.round(this.HEIGHT / 2);

                if (i === 0) {
                    this.ctx.moveTo(x + xOffset, y + yOffset);
                } else {
                    this.ctx.lineTo(x + xOffset, y + yOffset);
                }

                x += sliceWidth;
                lastY = y;
            }

            // Finish the line
            this.ctx.lineTo(this.WIDTH + xOffset, lastY + yOffset);


            this.ctx.stroke();
        }
    }
}