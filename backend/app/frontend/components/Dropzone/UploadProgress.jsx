import React from 'react';
import { Progress } from '../Progress';

export const UploadProgress = ({ file, progress }) => {
    const uploadId = file.upload.id;
    const filename = file.file.name;
    return (
        <div id={ `upload-${ uploadId }` } className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white/40 shadow-2xl shadow-indigo-500">
            <div className="px-6 py-5 sm:p-6">
                <div>
                    <h4 className="sr-only">Status</h4>
                    <p className="font-medium text-blue-950">Uploading { filename }...</p>
                    <div className="mt-6" aria-hidden="true">
                        <Progress progress={ progress }/>
                    </div>
                </div>
            </div>
        </div>
    )
}
