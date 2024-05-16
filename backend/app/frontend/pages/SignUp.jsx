import { useCallback, useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import Client from '../util/Client';
import { GoogleButton } from '../components/GoogleButton';
import { TextField } from '../forms/TextField';

const signUp = async (data) => {
    try {
        await Client.signUp(data);
        return {};
    } catch (e) {
        const { response } = e;
        return response.data;
    }
}

const initialValues = {
    email: '',
    password: '',
    password_confirmation: ''
}

const validationSchema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required()
        .min(8, 'Password length must be of minimum 8 characters')
        .max(128, 'Password length must be of maximum 128 characters'),
    password_confirmation: Yup.string()
        .when('password', {
            is: val => val && val.length > 0,
            then: fieldSchema => fieldSchema
                .oneOf([ Yup.ref('password') ], 'Passwords do not match')
        })
        .required()
});

export const SignUp = () => {
    const handleSubmit = useCallback(async (values, bag) => {
        const response = await signUp(values);
        if (response['errors']) {
            bag.setErrors({response: response['errors']});
        } else {
            bag.resetForm();
        }
    }, []);

    return (
        <div className='flex flex-1 h-full justify-center'>
            <div className='m-auto p-4 bg-white rounded'>
                <h1>Sign Up</h1>
                <Formik
                    initialValues={ initialValues }
                    validateOnBlur={ false }
                    validateOnChange={ false }
                    validationSchema={ validationSchema }
                    onSubmit={ handleSubmit }
                >
                    { ({ isSubmitting, errors }) => (
                        <Form>
                            <div className='mt-2'>
                                <TextField
                                    className='input-group-scnd'
                                    name='email' type='email' placeholder='E-mail'
                                />
                            </div>
                            <div className='mt-2'>
                                <TextField
                                    className='input-group-scnd'
                                    name='password' type='password' placeholder='Password'
                                />
                            </div>
                            <div className='mt-2'>
                                <TextField
                                    className='input-group-scnd'
                                    name='password_confirmation' type='password' placeholder='Password confirmation'
                                />
                            </div>
                            <div className='mt-2'>
                                <button
                                    type='submit'
                                    disabled={ isSubmitting }
                                    className='px-4 py-2 w-full rounded text-white bg-sky-700 hover:bg-sky-400'>
                                    Sign up
                                </button>
                            </div>
                            { errors['response'] && (
                                <div className="text-red-500">{ errors['response'] }</div>
                            ) }
                        </Form>
                    ) }
                </Formik>
                <hr className='my-4 ' />
                <GoogleButton />
            </div>
        </div>
    )
}
