import { useCallback, useEffect, useState } from 'react';

export const useForm = ({initialValues, onSubmit, validate = (values) => true}) => {
    const [ values, setValues ] = useState(initialValues);
    const [ errors, setErrors ] = useState({});
    const [ submitting, setSubmitting ] = useState(false);
    const [ isValid, setIsValid ] = useState(true);

    const setFieldValue = useCallback((fieldName, value) => {
        setValues((oldValues) => ({...oldValues, [fieldName]: value }));
    }, []);

    const submitHandler = useCallback(async () => {
        setSubmitting(true);
        try {
            await onSubmit(values);
            setValues(initialValues);
            setSubmitting(false);
        } catch (err) {
            setSubmitting(false);
            console.log(err);
            const { errors } = err?.response?.data;
            if (errors) {
                setErrors(errors);
            } else {
                throw err;
            }
        }
    }, [onSubmit]);

    useEffect(() => {
        setIsValid(validate(values));
    }, [values])

    const onChange = useCallback((name, value) => {
        setFieldValue(name, value)
        setErrors({});
    }, []);

    return {
        values,
        errors,
        setFieldValue,
        submitHandler,
        submitting,
        isValid,
        onChange
    }
}

export const useField = (form, { name, type }) => {

    const onChange = useCallback((e) => {
        form.onChange(name, e.target.value);
    }, [name]);

    const setValue = useCallback((value) => {
        form.setFieldValue(name, value);
    }, [name]);

    return {
        value: form.values[name],
        onChange,
        name,
        type,
        setValue,
        error: form.errors[name]
    }
}
