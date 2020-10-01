class Helper {
}
Helper.fromUint8ArrayToBase64 = (array) => {
    return base64js.fromByteArray(array);
};
Helper.onError = (err, action = 'error') => {
    if (err instanceof Error)
        alert(`Action: ${action} Error: ${err.toString()} Stack: ${err.stack}`);
    else
        alert(`Action: ${action} Error: ${err.toString()}`);
};
Helper.tryApi = (func) => {
    try {
        func();
    }
    catch (e) {
        Helper.onError(e);
    }
};
Helper.fromBase64ToUint8Array = (base64) => {
    return base64js.toByteArray(base64);
};
//# sourceMappingURL=helper.js.map