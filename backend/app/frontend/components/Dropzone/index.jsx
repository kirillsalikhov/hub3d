import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone';
import { Uploader } from './Uploader';
import { UploadProgress } from './UploadProgress';
import uploadImg from './images/icn_upload.png';

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
        <div htmlFor="file-upload" {...getRootProps()}>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" {...getInputProps()} />
            <div className={`${isDragActive ? 'shadow-md' : ''} group relative my-2 flex justify-center rounded-lg border border-dashed cursor-pointer border-gray-900/25 hover:border-blue-800 px-8 py-20`}>
                <div className="text-center mt-6 flex leading-6 justify-center">
                    <div>
                        <img className="inline-block h-16 w-16 rounded-full" src={uploadImg} />
                        <p className=" leading-10 text-2xl font-black text-blue-950 group-hover:text-blue-800 pt-6">Upload IFC file</p>
                        <p className="text-l leading-5 text-gray-400">drag & drop here or browse</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
