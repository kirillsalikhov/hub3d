import React from 'react';
import { progressTransitionDuration } from '../Progress';

export const UploadProgress = ({ file, progress }) => {
    const uploadId = file.upload.id;
    const filename = file.file.name;
    return (
        <div className="rounded-lg h-full">
            {
                <div id={ `upload-${ uploadId }` } className="relative h-full rounded-md bg-gray-100 shadow-inner">
                    <div className={ `motion-safe:animate-pulse transition-all duration-${progressTransitionDuration} ease-linear h-full rounded-md bg-gradient-to-tr from-indigo-600/60 to-purple-700/60` } style={{ width: `${progress * 100}%` }} />
                    <div className="absolute top-1/4 p-6 text-center overflow-hidden w-full">
                        <p className="text-xl font-medium text-blue-950 truncate">Uploading {filename}...</p>
                        <p className="mt-4 text-sm leading-5 text-blue-950">
                            Uploading may take a while depending on your file size.
                            <span className="font-bold"> Do not close the browser window </span>
                        </p>
                    </div>
                </div>
            }
        </div>
    )
}
