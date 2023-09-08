import React, { useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone';
import { DirectUpload } from '@rails/activestorage';

export const Dropzone = ({uploadsPath}) => {

    const rootRef = useRef(null);
    const uploadFile = (file) => {
        const upload = new DirectUpload(file, uploadsPath)

        upload.create((error, blob) => {
            if (error) {
                //showErrors();
                console.log(error);
            } else {
                const hiddenField = document.createElement('input')
                hiddenField.setAttribute('type', 'hidden');
                hiddenField.setAttribute('value', blob.signed_id);
                hiddenField.name = 'file-upload';
                if (rootRef.current) {
                    rootRef.current.appendChild(hiddenField)
                }
            }
        })
    }

    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles.length === 0) {
            return;
        }

        acceptedFiles.forEach((file) => {
            //do validation

            const isValid = true;

            //if valid
            if (isValid) {
                uploadFile(file)
            } else {
                //showErrors();
            }
        });
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    return (
        <div ref={rootRef} className={`${isDragActive ? 'shadow-md' : ''} mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10`} {...getRootProps()}>
            <div className='text-center'>
                <div className='mt-4 flex text-sm leading-6 text-gray-600'>
                    <label
                        htmlFor='file-upload'
                        className='relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500'
                    >
                        <span>Upload a file</span>
                        <input id='file-upload' name='file-upload' type='file' className='sr-only' {...getInputProps()} />
                    </label>
                    <p className='pl-1'>or drag and drop</p>
                </div>
                <p className='text-xs leading-5 text-gray-600'>FBX up to 10MB</p>
            </div>
        </div>
    )
}
