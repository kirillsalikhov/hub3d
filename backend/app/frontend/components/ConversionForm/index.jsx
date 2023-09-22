import { Dropzone } from '../Dropzone';

const conversionUrl = (conversionId) => `/conversions/${conversionId}`;
export const ConversionForm = ({ uploadsPath }) => {
    const submitForm = (signedId) => {
        const formData = new FormData();
        formData.set('input_file', signedId);
        fetch('/api/v1/op/convert-anonym', {
            method: 'POST',
            body: formData
        }).then((response) => {
            if (response.status === 200) {
                return response.json()
            } else {
                console.log(response);
                throw new Error(`${response.status}`);
            }
        }).then((conversion) => {
            setTimeout(() => {
                window.location.href = conversionUrl(conversion.id);
            }, 1000)
        }).catch(error => {
            console.error(error);
        });
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
