import React from 'react';
import Client from '../../util/Client';
import { Dropzone } from '../Dropzone';
import { MobileUploadForm } from '../MobileUploadForm';
import { progressTransitionDuration } from '../Progress';
import { useUploader } from '../Uploader/useUploader';

const conversionUrl = (conversionId) => `/conversions/${conversionId}`;
export const ConversionForm = ({ uploadsPath }) => {
    const submitForm = async (signedId) => {
        const { data: conversion } = await Client.convertAnonym({ 'input_file': signedId })
        setTimeout(() => {
            window.location.href = conversionUrl(conversion.id);
        }, progressTransitionDuration);
    }

    const { uploadFile, file, progress } = useUploader({ uploadsPath, upload: submitForm })

    return (
        <>
            <div className="mt-16 sm:mt-24 lg:col-span-6 lg:mt-0 hidden sm:block">
                <Dropzone uploadFile={ uploadFile } file={ file } progress={ progress } />
            </div>
            <div className="mt-16 sm:mt-24 lg:col-span-6 lg:mt-0 sm:hidden">
                <MobileUploadForm uploadFile={ uploadFile } file={ file } progress={ progress } />
            </div>
        </>
    )
}
