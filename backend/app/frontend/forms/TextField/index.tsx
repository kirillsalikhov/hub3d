import { FormEvent, InputHTMLAttributes, memo } from 'react';
import { ErrorMessage, useField, useFormikContext } from 'formik';

interface ITextField extends InputHTMLAttributes<HTMLInputElement> {
    name: string,
    showError: boolean;
}

export const TextField = memo<ITextField>(({ name, showError = true, ...props }) => {
    const [ field ] = useField(name);
    const { setErrors } = useFormikContext();
    const handleChange = (e: FormEvent) => {
        field.onChange(e);
        setErrors({});
    }
    return (
        <>
            <input className='block input-group-scnd' { ...field } { ...props } onChange={ handleChange } />
            { showError && <div className='text-red-500'>
                <ErrorMessage name={ name } />
            </div> }
        </>
    )
});
