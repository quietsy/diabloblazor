class Webassembly {
    constructor() {
        this.initWebAssemblyUnmarshalledBegin = async (isSpawn, address, length) => {
            const array = windowAny.Module.HEAPU8.subarray(address, address + length);
            this.wasm = await (isSpawn ? DiabloSpawn : Diablo)({ wasmBinary: array }).ready;
            getInterop().dotNetReference.invokeMethodAsync('InitWebAssemblyUnmarshalledEnd');
        };
        this.dapiInit = (currentDateTime, offScreen, version0, version1, version2) => {
            if (this.wasm)
                this.wasm._DApi_Init(currentDateTime, offScreen, version0, version1, version2);
        };
        this.dapiMouse = (action, button, eventModifiers, x, y) => {
            if (this.wasm)
                this.wasm._DApi_Mouse(action, button, eventModifiers, x, y);
        };
        this.dapiKey = (action, eventModifiers, key) => {
            if (this.wasm)
                this.wasm._DApi_Key(action, eventModifiers, key);
        };
        this.dapiChar = (chr) => {
            if (this.wasm)
                this.wasm._DApi_Char(chr);
        };
        this.callApi = (func, ...params) => {
            if (!this.wasm)
                return;
            Helper.tryApi(() => {
                if (func !== "text")
                    this.wasm["_" + func](...params);
                else {
                    const ptr = this.wasm._DApi_SyncTextPtr();
                    const text = params[0];
                    const length = Math.min(text.length, 255);
                    const heap = this.wasm.HEAPU8;
                    for (let i = 0; i < length; ++i)
                        heap[ptr + i] = text.charCodeAt(i);
                    heap[ptr + length] = 0;
                    this.wasm._DApi_SyncText(params[1]);
                }
            });
        };
    }
}
//# sourceMappingURL=webassembly.js.map