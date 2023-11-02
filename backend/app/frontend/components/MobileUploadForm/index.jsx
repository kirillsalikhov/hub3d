import React, { useRef } from 'react';
import { useUploader } from '../Uploader/useUploader';
import { Progress } from '../Progress';

export const MobileUploadForm = ({ uploadsPath, submitForm }) => {
    const inputRef = useRef(null);
    const { uploadFile, file, progress } = useUploader({ uploadsPath, upload: submitForm })

    const handleChange = () => {
        uploadFile(inputRef.current.files[0]);
    }

    if (file) {
        return <MobileUploadFormProgress progress={progress} />
    }

    return (
        <div className="justify-center items-center bg-white m-8 sm:overflow-hidden rounded-lg shadow-2xl shadow-indigo-500 visible sm:invisible">
            <div className="px-10 py-10">
                <div className="relative flex rounded-lg bg-white text-center items-center justify-center">
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
            </div>
        </div>
    )
}

const MobileUploadFormProgress = ({ progress }) => (
    <div className="flex m-8 rounded-md text-center items-end justify-center">
        <Progress progress={ progress } />
    </div>
)
