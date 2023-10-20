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
        <div className="col-span-full">
            <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                Your model
            </label>
            <form className='relative'>
                <Dropzone uploadsPath={ uploadsPath } filesUploaded={ submitForm }/>
            </form>
        </div>
    )
}
