import React, { useCallback, useState } from 'react';
import Client from '../../util/Client';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { Switch } from '@headlessui/react';
import { useField, useForm } from './useForm';
import { LinkSection } from './LinkSection';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function SharePopup({resourceId, shareOptions, onClose}) {
    const { has_link_password: hasLinkPassword = false } = shareOptions;
    const [ passwordEnabled, setPasswordEnabled ] = useState(hasLinkPassword);
    const [ showPassword, setShowPassword ] = useState(!hasLinkPassword);
    const [ passwordIsSet, setPasswordIsSet ] = useState(hasLinkPassword);

    const onSubmit = async (values) => {
        const linkPassword = values['link_password'];
        try {
            await Client.updateShareOptions(resourceId, {link_password: linkPassword})
            setShowPassword(false);
            setPasswordIsSet(true);
        } catch (err) {
            throw err;
        }
    }

    const resetPassword = async () => {
        try {
            await Client.updateShareOptions(resourceId, {link_password: ''});
            setValue('');
            setPasswordIsSet(false);
        } catch (err) {
            throw err;
        }
    }

    const validate = (values) => {
        const linkPassword = values['link_password'];
        return (linkPassword.length > 0);
    }

    const form = useForm({ initialValues: {link_password: ''}, onSubmit, validate });
    const { error, setValue, ...field } = useField(form, {name: 'link_password', type: 'password'})

    const onChangePasswordClick = useCallback(() => {
        setShowPassword(old => !old);
    }, []);

    const onSwitchToggle = useCallback(async (value) => {
        setPasswordEnabled(value);
        setShowPassword(value)
        if (!value) {
            try {
                await resetPassword();
            } catch (err) {
                throw err;
            }
        }
    }, []);

    return (
        <div className="absolute inset-0 flex h-screen p-4 justify-center items-center">
            <div className="absolute inset-0 flex h-screen bg-gray-300/50" onClick={onClose} />
            <div className="relative w-full overflow-hidden rounded-lg bg-white shadow-xl sm:my-8 sm:w-full sm:max-w-lg">

                {/* Card Header */}

                <div className="flex items-center justify-between">
                    <div className="flex-grow pl-4 text-lg font-semibold text-gray-900 truncate">
                        Share project
                    </div>
                    <div className="flex-none">
                        <button
                            type="button"
                            className="flex-none items-center px-3 py-3 rounded-bl-lg text-sm font-semibold text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none "
                            onClick={onClose}
                        >
                            <span className="sr-only">Close</span>
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                <div className="p-4 w-full">


                    {/* Link section */}

                    <LinkSection />

                    {/* Password section */}

                    <div className='flex mt-4 pt-4 border-t items-center justify-between'>
                        <Switch.Group as="div" className="flex items-center justify-between">
                            <Switch
                                checked={passwordEnabled}
                                onChange={onSwitchToggle}
                                className={classNames(
                                    passwordEnabled ? 'bg-blue-800' : 'bg-gray-200',
                                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-none'
                                )}
                            >
                                <span
                                    aria-hidden="true"
                                    className={classNames(
                                        passwordEnabled ? 'translate-x-5' : 'translate-x-0',
                                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                                    )}
                                />
                            </Switch>
                            <Switch.Label as="span" className="flex flex-grow flex-col pl-4 text-sm leading-6">
                                {passwordEnabled ?
                                    <p className="text-gray-900 font-bold">Password protection enabled </p>
                                    :
                                    <p className="text-gray-900">Password protection disabled </p>
                                }
                            </Switch.Label>
                        </Switch.Group>
                        { passwordEnabled && passwordIsSet && <div onClick={onChangePasswordClick} className='text-blue-800 underline hover:no-underline hover:cursor-pointer'>{ showPassword ? 'Cancel' : 'Change password' }</div> }
                    </div>

                    <div className="mt-4">
                        { passwordEnabled && showPassword &&
                            <div>
                                <div className="flex">
                                    <input
                                        id="password"
                                        placeholder='Create password'
                                        {...field}
                                        className="flex-grow rounded-none rounded-l-md border-0 shadow-inner pl-4 py-2 text-sm leading-6 text-gray-900 truncate ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-gray-800 focus:outline-none"
                                    />
                                    <button
                                        onClick={form.submitHandler}
                                        type="button"
                                        disabled={!form.isValid || form.submitting}
                                        className="flex-none -ml-px items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm leading-6 bg-gray-800 text-white ring-1 ring-inset ring-gray-800 hover:bg-gray-700">
                                        Set password
                                    </button>
                                </div>
                                { error && <div className="flex text-base text-red-600 leading-6 pt-2">
                                    { error}
                                </div> }
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
