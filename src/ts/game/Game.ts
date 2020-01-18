export default class Game {
    private iteration = 0;
    private initialTime?: number;
    private time = 0;

    update(timestamp: number, ctx: CanvasRenderingContext2D, width: number, height: number) {
        this.iteration++;
        let delta;
        if (this.initialTime === undefined) {
            this.initialTime = timestamp;
            delta = 0;
            this.time = 0;
        } else {
            delta = timestamp - this.time;
            this.time = timestamp - this.initialTime;
        }

        ctx.clearRect(0, 0, width, height);

        ctx.fillStyle = 'rgb(200, 0, 0)';
        ctx.fillRect(10, 10, 50, 50);

        ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
        ctx.fillRect(30, 30, 50, 50);

        ctx.fillStyle = 'white';
        ctx.font = '20px sans-serif';
        ctx.fillText("Frame " + this.iteration, 60, 120);
        ctx.fillText("Time " + this.time, 60, 150);
        ctx.fillText("Average fps: " + this.iteration / this.time * 1000, 60, 180);
    }
}