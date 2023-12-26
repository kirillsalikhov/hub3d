import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useUploader } from '../Uploader/useUploader';

export const useDropzoneUpload = ({ uploadFile }) => {

    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles.length === 0) {
            return;
        }
        const file = acceptedFiles[0];
        //do validation
        const isValid = true;
        //if valid
        if (isValid) {
            uploadFile(file)
        } else {
            //showErrors();
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return {
        rootProps: getRootProps(),
        inputProps: getInputProps(),
        isDragActive
    }
}
