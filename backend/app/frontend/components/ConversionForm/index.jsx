import { Dropzone } from '../Dropzone';
import Client from '../../util/Client';

const conversionUrl = (conversionId) => `/conversions/${conversionId}`;
export const ConversionForm = ({ uploadsPath }) => {
    const submitForm = async (signedId) => {
        const { data: conversion } = await Client.convertAnonym({ 'input_file': signedId })
        setTimeout(() => {
            window.location.href = conversionUrl(conversion.id);
        }, 1000);
    }

    return (
        <form>
            <div className="col-span-full">
                <Dropzone uploadsPath={ uploadsPath } filesUploaded={ submitForm }/>
            </div>
        </form>
    )
}
