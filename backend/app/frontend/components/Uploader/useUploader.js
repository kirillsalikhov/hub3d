import { useCallback, useState } from 'react';
import { Uploader } from './Uploader';

export const useUploader = ({ uploadsPath, upload }) => {
    const [ file, setFile ] = useState(null);
    const [ progress, setProgress ] = useState(0);

    const uploadFile = useCallback((file) => {
        const uploader = new Uploader(file, uploadsPath)
        setFile(uploader)

        uploader.onProgress = ({ loaded, total }) => {
            setProgress(loaded / total);
        }

        uploader.create((error, blob) => {
            if (error) {
                console.error(error);
            } else {
                upload(blob.signed_id)
            }
        })
    }, []);

    return {
        uploadFile,
        file,
        progress
    }
}
