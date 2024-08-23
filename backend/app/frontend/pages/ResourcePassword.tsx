import { useCallback } from "react";
import { useParams } from 'react-router-dom';
import { LogoSign } from '@/components/LogoSign';
import { Card } from '@/components/Card';
import { resourceUrl } from '../util/url';
import { useNavigate } from '../routes/useNavigate';
import Client from "../util/_Client";
import {ErrorMessage, Form, Formik, FormikErrors, FormikHelpers} from 'formik';
import { TextField } from '@/forms/TextField';

const authPassword = async (resourceId: string, password: string) => {
    try {
        // no data if match
        await Client.resourceAuthPassword(resourceId, { link_password: password });
        return {};
    } catch (e) {
        const { response } = e;
        if (response?.data && response.status === 422) {
            return response.data;
        }
        throw e;
    }
}

const initialValues = {
    link_password: ''
}

export default function ResourcePassword() {
    const { spaceKey, resourceId } = useParams() as {spaceKey: string, resourceId: string};
    const navigate = useNavigate();

    type PasswordFormValues = {
        link_password: string
    }

    const handleSubmit = useCallback(async (values:PasswordFormValues, bag: FormikHelpers<PasswordFormValues>) => {
        const password = values.link_password;
        const response = await authPassword(resourceId, password);
        if (response['errors']) {
            bag.setErrors(response['errors']);
        } else {
            navigate(resourceUrl(spaceKey, resourceId));
        }
    }, [ spaceKey, resourceId ]);

    const validate = useCallback((values: PasswordFormValues) => {
        const errors: FormikErrors<PasswordFormValues> = {};
        const password = values.link_password;
        if (password.length <= 0) {
            errors.link_password = '';
        }
        return errors;
    }, []);

    return (
        <div className="flex flex-1 h-full p-4 justify-center items-center">
            <div className="w-full justify-center sm:my-8 sm:w-full sm:max-w-lg">
                <LogoSign />
                <Card>
                    <div className="text-2xl pb-8 font-semibold text-gray-900 text-center">
                        Enter the password to&nbsp;open this link
                    </div>
                    <div className="pb-8 w-full">
                        <Formik
                            initialValues={ initialValues }
                            validateOnBlur={ false }
                            validateOnChange={ true }
                            initialErrors={ { link_password: '' } }
                            validate={ validate }
                            onSubmit={ handleSubmit }
                        >
                            { ({ isSubmitting, isValid, errors }) => (
                                <Form>
                                    <div className="flex">
                                        <TextField
                                            className="flex-grow input-group-scnd"
                                            name='link_password'
                                            type='password'
                                            placeholder='Password'
                                            showError={false}
                                        />
                                        <button
                                            type='submit'
                                            disabled={ isSubmitting || !isValid }
                                            className="flex-none button-group-scnd">
                                            &nbsp;&nbsp;→&nbsp;&nbsp;
                                        </button>
                                    </div>
                                    { errors['link_password'] && (
                                        <div className="flex absolute text-base text-red-600 leading-6 pt-2">
                                            <ErrorMessage name={'link_password'} />
                                        </div>
                                    ) }
                                </Form>
                            ) }
                        </Formik>
                    </div>
                </Card>
                <div className="flex text-center text-sm text-blue-950 p-8">
                    Pulse3D&nbsp;is&nbsp;an&nbsp;online viewer that lets you view and&nbsp;easily share CAD&nbsp;models
                    with your team
                </div>
            </div>
        </div>
    )
}
