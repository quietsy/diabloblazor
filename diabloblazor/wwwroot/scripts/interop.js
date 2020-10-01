class Interop {
    constructor() {
        this.setDotNetReference = (dotNetReference) => {
            this._dotNetReference = dotNetReference;
        };
        this.addEventListeners = () => {
            window.addEventListener('resize', () => this._dotNetReference.invokeMethodAsync('OnResize', this.getCanvasRect()));
            const main = document.getElementById('main');
            main.addEventListener('drop', (e) => this._fileStore.onDropFile(e));
            main.addEventListener('dragover', (e) => {
                if (this._fileStore.isDropFile(e))
                    e.preventDefault();
            });
            this.canvas.addEventListener('keydown', (e) => {
                if (e.keyCode === 8 || e.keyCode === 9 || (e.keyCode >= 112 && e.keyCode <= 119))
                    e.preventDefault();
            });
            this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        };
        this.getCanvasRect = () => {
            return this.canvas.getBoundingClientRect();
        };
        this.openKeyboard = (...args) => {
        };
        this.closeKeyboard = () => {
        };
        this.exitError = (error) => {
            throw Error(error);
        };
        this.exitGame = () => {
            this._dotNetReference.invokeMethodAsync('OnExit');
        };
        this.currentSaveId = (id) => {
            this._dotNetReference.invokeMethodAsync('SetSaveName', id);
        };
        this.setCursor = (x, y) => {
            this._webassembly.dapiMouse(0, 0, 0, x, y);
        };
        this.reload = () => {
            window.location.reload();
        };
        this.clickDownloadLink = (element, download, href) => {
            element.setAttribute('download', download);
            element.setAttribute('href', href);
            element.click();
            element.removeAttribute('download');
            element.removeAttribute('href');
        };
        this.download = async (url, sizes) => {
            const response = await axios.request({
                url: url,
                responseType: 'arraybuffer',
                onDownloadProgress: (e) => this._dotNetReference.invokeMethodAsync('OnProgress', new Progress('Downloading...', e.loaded, e.total || sizes[1])),
                headers: { 'Cache-Control': 'max-age=31536000' }
            });
            return response.data;
        };
        this.downloadAndUpdateIndexedDb = async (url, name, sizes) => {
            const arrayBuffer = await this.download(url, sizes);
            const array = await this._fileStore.updateIndexedDbFromArrayBuffer(name, arrayBuffer);
            this._fileStore.setFile(name, array);
            return arrayBuffer.byteLength;
        };
        this._webassembly = new Webassembly();
        this._graphics = new Graphics();
        this._sound = new Sound();
        this._fileStore = new FileStore();
        windowAny.DApi.open_keyboard = this.openKeyboard;
        windowAny.DApi.close_keyboard = this.closeKeyboard;
        windowAny.DApi.set_cursor = this.setCursor;
        windowAny.DApi.current_save_id = this.currentSaveId;
        windowAny.DApi.exit_game = this.exitGame;
        windowAny.DApi.exit_error = this.exitError;
    }
    get webassembly() {
        return this._webassembly;
    }
    get graphics() {
        return this._graphics;
    }
    get sound() {
        return this._sound;
    }
    get fileStore() {
        return this._fileStore;
    }
    get canvas() {
        if (!this._canvas)
            this._canvas = document.getElementById('canvas');
        return this._canvas;
    }
    get dotNetReference() {
        return this._dotNetReference;
    }
}
const windowAny = window;
windowAny.DApi = {};
windowAny.interop = new Interop();
const getInterop = () => windowAny.interop;
//# sourceMappingURL=interop.js.map