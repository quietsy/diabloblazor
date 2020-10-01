class Graphics {
    constructor() {
        this.initGraphics = (offscreen) => {
            const canvas = document.getElementById('canvas');
            this.context = (offscreen) ? canvas.getContext('bitmaprenderer') : canvas.getContext('2d', { alpha: false });
        };
        this.drawBegin = () => {
            this.renderBatch = {
                images: [],
                text: [],
                clip: null
            };
        };
        this.drawEnd = () => {
            this.onRender();
            this.renderBatch = null;
        };
        this.drawBlit = (x, y, width, height, data) => {
            this.renderBatch.images.push({ x, y, width, height, data: data.slice() });
        };
        this.drawClipText = (x0, y0, x1, y1) => {
            this.renderBatch.clip = { x0, y0, x1, y1 };
        };
        this.drawText = (x, y, text, color) => {
            this.renderBatch.text.push({ x, y, text, color });
        };
        this.drawBelt = (items) => {
        };
        this.onRender = () => {
            if (this.context instanceof ImageBitmapRenderingContext)
                this.context.transferFromImageBitmap(this.renderBatch.bitmap);
            else if (this.context instanceof CanvasRenderingContext2D) {
                const ctx = this.context;
                for (let i of this.renderBatch.images) {
                    const image = ctx.createImageData(i.width, i.height);
                    image.data.set(i.data);
                    ctx.putImageData(image, i.x, i.y);
                }
                if (this.renderBatch.text.length) {
                    ctx.save();
                    ctx.font = 'bold 13px Times New Roman';
                    if (this.renderBatch.clip) {
                        const c = this.renderBatch.clip;
                        ctx.beginPath();
                        ctx.rect(c.x0, c.y0, c.x1 - c.x0, c.y1 - c.y0);
                        ctx.clip();
                    }
                    for (let t of this.renderBatch.text) {
                        const r = ((t.color >> 16) & 0xFF);
                        const g = ((t.color >> 8) & 0xFF);
                        const b = (t.color & 0xFF);
                        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                        ctx.fillText(t.text, t.x, t.y);
                    }
                    ctx.restore();
                }
            }
        };
        windowAny.DApi.draw_begin = this.drawBegin;
        windowAny.DApi.draw_end = this.drawEnd;
        windowAny.DApi.draw_blit = this.drawBlit;
        windowAny.DApi.draw_clip_text = this.drawClipText;
        windowAny.DApi.draw_text = this.drawText;
        windowAny.DApi.draw_belt = this.drawBelt;
    }
}
//# sourceMappingURL=graphics.js.map