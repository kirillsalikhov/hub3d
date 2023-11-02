import React from 'react';
import Client from '../../util/Client';
import { Dropzone } from '../Dropzone';
import { MobileUploadForm } from '../MobileUploadForm';
import { progressTransitionDuration } from '../Progress';

const conversionUrl = (conversionId) => `/conversions/${conversionId}`;
export const ConversionForm = ({ uploadsPath }) => {

    const submitForm = async (signedId) => {
        const { data: conversion } = await Client.convertAnonym({ 'input_file': signedId })
        setTimeout(() => {
            window.location.href = conversionUrl(conversion.id);
        }, progressTransitionDuration);
    }

    return (
        <>
            <div className="mt-16 sm:mt-24 lg:col-span-6 lg:mt-0 hidden sm:block">
                <Dropzone uploadsPath={ uploadsPath } filesUploaded={ submitForm } />
            </div>
            <div className="mt-16 sm:mt-24 lg:col-span-6 lg:mt-0 sm:hidden">
                <MobileUploadForm uploadsPath={ uploadsPath } submitForm={ submitForm }/>
            </div>
        </>
    )
}
