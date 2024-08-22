import React, { useRef } from 'react';
import { UploadProgress } from '../Uploader/UploadProgress';

type MobileUploadFormProps = {
    uploadFile: (file: File) => void,
    progress: number,
    file: any // TODO !
}

export const MobileUploadForm = ({ uploadFile, progress, file } : MobileUploadFormProps) => {

    return (
        <div className="justify-center items-center bg-white m-6 sm:overflow-hidden rounded-lg shadow-2xl shadow-indigo-500 visible sm:invisible">
            <div className="h-64 p-6">
                { file ?
                    <UploadProgress progress={progress} file={file} /> :
                    <MobileUploadFormContent uploadFile={uploadFile} />
                }
            </div>
        </div>
    )
}
type MobileUploadFormContent = {
    uploadFile: (file: File) => void
}

const MobileUploadFormContent = ({ uploadFile } : MobileUploadFormContent) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const handleChange = () => {
        if (inputRef.current?.files) {
            uploadFile(inputRef.current.files[0]);
        }
    }

    return (
        <div className="relative h-full flex rounded-lg bg-white text-center items-center justify-center">
            <form>
                <div className="text-2xl font-normal text-blue-950 group-hover:text-blue-800 pt-2">
                    <label htmlFor="mobile-form-file-upload" className="cursor-pointer">
                        <input ref={inputRef} id="mobile-form-file-upload" name="mobile-form-file-upload" type="file" className="sr-only" onChange={ handleChange } />
                        <div>
                            <p>View and share</p>
                            <p>IFC files online</p>
                        </div>
                        <div className="rounded-full m-4 px-6 py-3 text-lg text-white bg-gradient-to-tr from-indigo-600/80 to-purple-700/80 shadow-md shadow-indigo-500/40">
                            Upload a file
                        </div>
                    </label>
                </div>
            </form>
        </div>
    )
}
