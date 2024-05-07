import { DirectUpload } from '@rails/activestorage';

export class Uploader {
    constructor(file, url) {
        this.file = file;
        this.url = url;
        this.upload = new DirectUpload(this.file, this.url, this)
        this.onProgress = () => {};
    }

    create(callback) {
        this.upload.create(callback);
    }

    directUploadWillStoreFileWithXHR(request) {
        request.upload.addEventListener('progress',
            event => this.directUploadDidProgress(event))
    }

    directUploadDidProgress({ loaded, total }) {
        this.onProgress({loaded, total})
    }
}
