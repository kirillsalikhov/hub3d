import { useCallback, useEffect, useState } from 'react';
import { isBrowser } from '@/util/isBrowser';
import { usePageData } from '@/util/usePageData';

export const useUploader = ({upload}:{upload: (signedId: string) => void}) => {
    const { uploadsPath } = usePageData();
    const [ file, setFile ] = useState(null);
    const [ progress, setProgress ] = useState(0);
    const [ UploaderClass, setUploaderClass ] = useState(null);

    useEffect(() => {
        if (isBrowser()) {
            import('./Uploader.js')
                .then(({Uploader}) => {
                    setUploaderClass(Uploader.prototype)
                })
                .catch((err) => {
                    console.error(err);
                    throw err;
                });
        }
    }, []);

    const uploadFile = useCallback((file: File) => {
        if (!UploaderClass || !uploadsPath) { return; }
        const uploader = new (UploaderClass.constructor)(file, uploadsPath)
        setFile(uploader)

        uploader.onProgress = ({ loaded, total } : {loaded: number, total: number}) => {
            setProgress(loaded / total);
        }

        interface IBlob {
            signed_id: string
        }

        uploader.create((error: Error, blob: IBlob) => {
            if (error) {
                console.error(error);
            } else {
                upload(blob.signed_id)
            }
        })
    }, [UploaderClass, uploadsPath]);

    return {
        uploadFile,
        file,
        progress
    }
}
