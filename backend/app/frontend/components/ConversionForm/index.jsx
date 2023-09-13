import { Dropzone } from '../Dropzone';

export const ConversionForm = ({ uploadsPath }) => {
    const submitForm = (signedId) => {
        const formData = new FormData();
        formData.set('input_file', signedId);
        fetch('/api/v1/op/convert-anonym', {
            method: 'POST',
            body: formData
        }).then((response) => {
            console.log(response);
        }).catch(error => {
            console.error(error);
        });
    }

    return (
        <main>
            <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                <div className="col-span-full">
                    <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                        Your model
                    </label>
                    <form className='relative'>
                        <Dropzone uploadsPath={ uploadsPath } filesUploaded={ submitForm }/>
                    </form>
                </div>
            </div>
        </main>
    )
}
