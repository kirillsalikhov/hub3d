import React, { useState } from 'react';
import { LinkIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { Switch } from '@headlessui/react';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function SharePopup({onClose}) {
    const [enabled, setEnabled] = useState(false)
    const [isShown, setIsShown] = useState(false)

    const handleClick = event => {
        setIsShown(true);
        setTimeout(() => {
            setIsShown(false);
        }, 3000);
    };


    const Tooltip = () => {
        return (
            <div className="absolute right-2 px-4 py-3 bg-blue-600 text-sm text-white leading-6 shadow-md">
                Link copied!
            </div>
        )
    }


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

                    <div className="flex mt-2 items-center">
                        <div className="pointer-events-none absolute flex-none items-center">
                            <LinkIcon className="h-5 w-5 m-2.5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            type="text"
                            className="flex-grow rounded-none rounded-l-md border-0 shadow-inner pl-10 pr-2 py-2 text-sm leading-6 text-gray-900 truncate ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-blue-800  focus:outline-none"
                            value={window.location.href}
                            readOnly
                        />
                        <button
                            onClick={handleClick}
                            type="button"
                            className="flex-none -ml-px items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm leading-6 bg-blue-800 text-white ring-1 ring-inset ring-blue-800 hover:bg-blue-700">
                            Copy link
                        </button>
                        {isShown && (<Tooltip />)}
                    </div>


                    {/* Password section */}

                    <Switch.Group as="div" className="flex mt-4 pt-4 border-t items-center justify-between">
                        <Switch
                            checked={enabled}
                            onChange={setEnabled}
                            className={classNames(
                                enabled ? 'bg-blue-800' : 'bg-gray-200',
                                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-none'
                            )}
                        >
                            <span
                                aria-hidden="true"
                                className={classNames(
                                    enabled ? 'translate-x-5' : 'translate-x-0',
                                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                                )}
                            />
                        </Switch>
                        <span className="flex flex-grow flex-col">
                            <Switch.Label as="span" className="pl-4 text-sm leading-6">
                                {enabled ?
                                    <p className="text-gray-900 font-bold">Password protection enabled </p>
                                    :
                                    <p className="text-gray-900">Password protection disabled </p>
                                }
                            </Switch.Label>
                        </span>
                    </Switch.Group>

                    <div className="mt-4">
                        {enabled ?
                            <div className="flex">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder='Create password'
                                    className="flex-grow rounded-none rounded-l-md border-0 shadow-inner pl-4 py-2 text-sm leading-6 text-gray-900 truncate ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-gray-800 focus:outline-none"
                                />
                                <button
                                    onClick={handleClick}
                                    type="button"
                                    className="flex-none -ml-px items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm leading-6 bg-gray-800 text-white ring-1 ring-inset ring-gray-800 hover:bg-gray-700">
                                    Set password
                                </button>
                            </div>
                            : ''}
                    </div>
                </div>
            </div>
        </div>
    )
}
