import React from 'react'
import { PlusIcon } from '@heroicons/react/20/solid';
import { useDropzoneUpload } from './useDropzoneUpload';
import { UploadProgress } from '../Uploader/UploadProgress';
import {DropzoneInputProps, DropzoneRootProps} from "react-dropzone-esm";

type DropzoneProps = {
    uploadFile: (file: File) => void,
    progress: number,
    file: any // TODO !
}

export const Dropzone = ({ uploadFile, progress, file } : DropzoneProps) => {

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

type DropZoneContent = {
    rootProps: DropzoneRootProps,
    inputProps: DropzoneInputProps,
    isDragActive: boolean
}

const DropzoneContent = ({rootProps, inputProps, isDragActive}: DropZoneContent) => (
    <div className="col-span-full">
        <form>
            <div { ...rootProps }>
                <input id="dropzone-file-upload" name="dropzone-file-upload" type="file"
                       className="sr-only" { ...inputProps } />
                <div className={ `${ isDragActive ? 'bg-gradient-to-tr border-none' : '' } group cursor-pointer relative flex rounded-lg h-80 bg-white hover:bg-gradient-to-tr from-blue-500 via-pink-300 via-70% to-purple-600 border-2 border-dashed border-gray-300 hover:border-none` }>
                    <div className="flex w-full m-0.5 bg-white rounded-md text-center items-center justify-center">
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
