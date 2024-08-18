import React from "react";

import {useUploader} from "@/components/Uploader/useUploader";
import {useDropzoneUpload} from "@/components/Dropzone/useDropzoneUpload";
import {PlusIcon} from "@heroicons/react/20/solid";
import {progressTransitionDuration} from "@/components/Progress";

type MiniDropPros = {
    onSuccess: (signedId: string) => void,
    fileRecord?: {signed_id: string, filename: string},
    onDelete?: () => void
}

export const MiniDrop = ({onSuccess, fileRecord, onDelete} : MiniDropPros) => {
    const signed_id = fileRecord?.signed_id;
    const filename = fileRecord?.filename;

    const { uploadFile, file, progress } = useUploader({ upload: onSuccess })
    const { rootProps, inputProps, isDragActive} = useDropzoneUpload({ uploadFile });

    return (
        <div className="h-32">
            {signed_id &&
                <div>
                    <span>{filename}</span>
                    <span
                        onClick={onDelete}
                        className="inline-block ml-2 px-2 rounded bg-rose-400 cursor-pointer">X</span>
                </div>
            }
            {
                // TODO that's ugly should be split to separate components
                !signed_id && (file ?
                    <UploadProgress progress={progress} file={file}/> :
                    <DropzoneContent rootProps={rootProps} inputProps={inputProps} isDragActive={isDragActive}/>)
            }
        </div>
    )
}

// TODO: for Marina: I modified styles a bit
const DropzoneContent = ({rootProps, inputProps, isDragActive}) => (
    <div>
        <form>
            <div htmlFor="dropzone-file-upload" { ...rootProps }>
                <input id="dropzone-file-upload" name="dropzone-file-upload" type="file"
                       className="sr-only" { ...inputProps } />
                <div className={ `${ isDragActive ? 'bg-gradient-to-tr border-none' : '' } group cursor-pointer relative flex h-32 rounded-lg bg-white hover:bg-gradient-to-tr from-blue-500 via-pink-300 via-70% to-purple-600 border-2 border-dashed border-gray-300 hover:border-none` }>
                    <div className="flex w-full m-0.5 bg-white rounded-md text-center items-center justify-center">
                        <div>
                            <div className="m-auto w-14 h-14 rounded-full p-4 text-white bg-gradient-to-tr from-indigo-600/80 to-purple-700/80 shadow-md shadow-indigo-500/40">
                                <PlusIcon className="w-6 h-6" />
                            </div>

                            <p className="text-l leading-5 text-gray-400">drag & drop</p>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
)

// TODO: for Marina: I modified styles a bit
export const UploadProgress = ({ file, progress }) => {
    const uploadId = file.upload.id;
    const filename = file.file.name;
    return (
        <div className="rounded-lg h-full">
            {
                <div id={ `upload-${ uploadId }` } className="relative h-full rounded-md bg-gray-100 shadow-inner">
                    <div className={ `motion-safe:animate-pulse transition-all duration-${progressTransitionDuration} ease-linear h-full rounded-md bg-gradient-to-tr from-indigo-600/60 to-purple-700/60` } style={{ width: `${progress * 100}%` }} />
                    <div className="absolute top-1/4 p-6 text-center overflow-hidden w-full">
                        <p className="text-base font-medium text-blue-950">Uploading {filename}...</p>
                    </div>
                </div>
            }
        </div>
    )
}
