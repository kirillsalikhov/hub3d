import { useCallback } from 'react';
import {Form, Formik, FormikHelpers} from 'formik';
import Client from '../util/_Client';
import { GoogleButton } from '@/components/GoogleButton';
import { TextField } from '@/forms/TextField';
import {SignInRequest} from "@/util/api-client";

const login = async (data: SignInRequest) => {
    try {
        await Client.signIn(data);
        return {};
    } catch (e) {
        // TODO Maybe catch in callback ?
        const { response } = e;
        if (response.data && response.status === 401) {
            // TODO Marina, returns is {errors: "not authenticated"}
            // can change to other shape
            return response.data;
        }
        throw e;
    }
}

export const SignIn = () => {
    const initialValues = {
        email: '',
        password: ''
    }
    type FormValues = typeof initialValues;

    const handleSubmit = useCallback(async (values: FormValues, bag: FormikHelpers<FormValues>) => {
        const response = await login(values);
        if (response['errors']) {
            bag.setErrors({response: response['errors']});
        } else {
            bag.resetForm();
        }
    }, []);

    return (
        <div className="flex flex-1 h-full justify-center">
            <div className="m-auto p-4 bg-white rounded">
                <h1>Sign In</h1>
                <Formik
                    initialValues={ initialValues }
                    validateOnBlur={ false }
                    validateOnChange={ false }
                    onSubmit={ handleSubmit }
                >
                    { ({ isSubmitting, errors }) => (
                        <Form>
                            <div className="mt-2">
                                <TextField
                                    className='input-group-scnd'
                                    name='email' placeholder='E-mail' type='email'
                                />
                            </div>
                            <div className="mt-2">
                                <TextField
                                    className='input-group-scnd'
                                    name='password' placeholder='Password' type='password'
                                />
                            </div>
                            <div className="mt-2">
                                <button
                                    type="submit"
                                    disabled={ isSubmitting }
                                    className="px-4 py-2 w-full rounded text-white bg-sky-700 hover:bg-sky-400">
                                    Log in
                                </button>
                            </div>
                            { errors['response'] && (
                                <div className="text-red-500">{ errors['response'] }</div>
                            ) }
                        </Form>
                    ) }
                </Formik>
                <hr className="my-4" />
                <GoogleButton />
            </div>
        </div>
    )
}
