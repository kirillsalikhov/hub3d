import React from 'react'
import { PlusIcon } from '@heroicons/react/20/solid';
import { useDropzoneUpload } from './useDropzoneUpload';
import { UploadProgress } from '../Uploader/UploadProgress';

export const Dropzone = ({ uploadFile, progress, file }) => {

    const { rootProps, inputProps, isDragActive} = useDropzoneUpload({ uploadFile });

    return (
        <div className="bg-white sm:mx-auto sm:w-full sm:max-w-md sm:overflow-hidden sm:rounded-lg shadow-2xl shadow-indigo-500">
            <div className="h-96 p-8">
                {
                    file ?
                        <UploadProgress progress={progress} file={file} /> :
                        <DropzoneContent rootProps={rootProps} inputProps={inputProps} isDragActive={isDragActive} />
                }
            </div>
        </div>
    )
}

const DropzoneContent = ({rootProps, inputProps, isDragActive}) => (
    <div className="col-span-full">
        <form>
            <div htmlFor="dropzone-file-upload" { ...rootProps }>
                <input id="dropzone-file-upload" name="dropzone-file-upload" type="file"
                       className="sr-only" { ...inputProps } />
                <div className={ `${ isDragActive ? 'bg-gradient-to-tr' : '' } group cursor-pointer relative flex rounded-lg h-80 bg-white bg-dropzone from-blue-500 via-pink-300 via-70% to-purple-600 border-2 border-dashed border-gray-300 hover:border-transparent` }>
                    <div className="flex w-full bg-white rounded-md text-center items-center justify-center">
                        <div>
                            <div className="m-auto w-14 h-14 rounded-full p-4 text-white bg-gradient-to-tr from-indigo-600/80 to-purple-700/80 shadow-md shadow-indigo-500/40">
                                <PlusIcon className="w-6 h-6" />
                            </div>
                            <p className="leading-10 text-2xl font-black text-blue-950 group-hover:text-blue-800 pt-6">
                                Upload IFC file
                            </p>
                            <p className="text-l leading-5 text-gray-400">drag & drop here or browse</p>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
)
