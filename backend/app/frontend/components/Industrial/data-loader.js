export const dataLoader = (files) => {
    return (url, responseType, progressWatcher, watcherType) => {
        // modification from copyPaste
        const _url = files[url].path;
        const xhr = new XMLHttpRequest();
        xhr.open('GET', _url, true);
        xhr.responseType = responseType;

        if (progressWatcher != null) {
            const childWatcher = progressWatcher.createChild({
                type: watcherType,
                // modification from copyPaste
                name: _url,
                unit: 'byte'
            });
            xhr.onprogress = (e) => {
                childWatcher.change({
                    current: e.loaded,
                    total: e.total,
                    computable: e.lengthComputable
                });
            };
        }
        return new Promise((resolve, reject) => {
            xhr.onload = () => {
                if (xhr.status < 400) {
                    resolve({
                        response: xhr.response,
                        mimeType: xhr.getResponseHeader('Content-Type')?.split(';')[0] ?? ''
                    });
                } else {
                    reject(new Error(`Request to "${_url} has failed with HTTP status ${xhr.status}"`));
                }
            };

            xhr.onerror = () => {
                reject(new Error('Network request has failed'));
            };

            xhr.send(null);
        });
    };
};
