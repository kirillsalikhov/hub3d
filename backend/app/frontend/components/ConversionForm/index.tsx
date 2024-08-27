import React from 'react';
import Client from '../../util/Client.ts';
import { Dropzone } from '../Dropzone';
import { MobileUploadForm } from '../MobileUploadForm';
import { progressTransitionDuration } from '../Progress';
import { useUploader } from '../Uploader/useUploader';
import { useNavigate } from '@/routes/useNavigate.ts';
import { isBrowser } from '@/util/isBrowser.ts';
import { conversionUrl } from '@/util/url.ts';

export const ConversionForm = () => {
    const navigate = useNavigate();
    const submitForm = async (signedId: string) => {
        const { data: conversion } = await Client.convertAnonym({ 'input_file': signedId })
        setTimeout(() => {
            if (isBrowser()) {
                navigate(conversionUrl(conversion.space_key, conversion.id));
            }
        }, progressTransitionDuration);
    }

    const { uploadFile, file, progress } = useUploader({ upload: submitForm })

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
