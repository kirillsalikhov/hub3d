import React, { useCallback, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone';
import { Uploader } from './Uploader';
import { UploadProgress } from './UploadProgress';

export const Dropzone = ({uploadsPath, filesUploaded}) => {

    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);

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

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

    const uploadFile = (file) => {
        const uploader = new Uploader(file, uploadsPath)
        setFile(uploader)

        uploader.onProgress = ({loaded, total}) => {
            setProgress(loaded/total);
        }

        uploader.create((error, blob) => {
            if (error) {
                //showErrors();
                console.log(error);
            } else {
                filesUploaded(blob.signed_id)
            }
        })
    }

    if (file) {
        return <UploadProgress file={file} progress={progress} />
    }

    return (
        <div className={`${isDragActive ? 'shadow-md' : ''} mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10`} {...getRootProps()}>
            <div className='text-center'>
                <div className='mt-4 flex text-sm leading-6 text-gray-600'>
                    <label
                        htmlFor='file-upload'
                        className='relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500'
                    >
                        <span>Upload a file</span>
                        <input id='file-upload' name='file-upload' type='file' className='sr-only' {...getInputProps()}/>
                    </label>
                    <p className='pl-1'>or drag and drop</p>
                </div>
                <p className='text-xs leading-5 text-gray-600'>FBX up to 10MB</p>
            </div>
        </div>
    )
}
