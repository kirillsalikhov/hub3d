import React, { useCallback, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone';
import { Uploader } from './Uploader';

export const Dropzone = ({uploadsPath, filesUploaded}) => {

    const [file, setFile] = useState(null);
    const uploadRef = useRef(null);

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

    const UploadNode = ({ uploadId, filename }) => {
        return <div id={`upload-${uploadId}`} className='py-3 border-b' ref={uploadRef}>
            <div className='py-1'>
                { filename }
            </div>
            <div className='relative h-4 overflow-hidden rounded-full bg-secondary w-full'>
                <div className='progress h-full w-full flex-1 bg-indigo-500 py-2 transition-transform' style={{transform: 'translateX(-100%)'}} />
            </div>
        </div>
    }

    const uploadFile = (file) => {
        const uploader = new Uploader(file, uploadsPath)
        setFile(uploader)

        uploader.onProgress = ({loaded, total}) => {
            uploadRef.current.querySelector('.progress').style.transform = `translateX(-${100 - 100 * loaded/total}%)`;
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
        return <UploadNode key={file.upload.id} uploadId={file.upload.id} filename={file.file.name} />
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
