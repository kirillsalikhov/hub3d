import React from 'react';
import { Progress } from '../Progress';

export const UploadProgress = ({ file, progress }) => {
    const uploadId = file.upload.id;
    const filename = file.file.name;
    return <div id={ `upload-${ uploadId }` } className='py-3 border-b'>
        <div className='py-1'>
            { filename }
        </div>
        <Progress progress={ progress }/>
    </div>
}
