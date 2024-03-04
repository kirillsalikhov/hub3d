import { Popover, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import { Link } from '@inertiajs/react'
import { Logo } from '../Logo';

const navigation = [
]

export const Header = () => (
    <Popover>
        <nav className="relative mx-auto flex max-w-7xl items-center justify-between p-6" aria-label="Global">
            <div className="flex flex-1 items-center">
                <div className="flex w-full items-center justify-between md:w-auto">
                    <Logo/>
                    {/*<div className="-mr-2 flex items-center md:hidden">*/}
                    {/*    <Popover.Button className="relative inline-flex p-2 rounded-full text-blue-950 hover:bg-gray-100/10 focus:outline-none ">*/}
                    {/*        <span className="absolute -inset-0.5" />*/}
                    {/*        <span className="sr-only">Open main menu</span>*/}
                    {/*        <Bars3Icon className="h-6 w-6" aria-hidden="true" />*/}
                    {/*    </Popover.Button>*/}
                    {/*</div>*/}
                </div>
                <div className="hidden space-x-10 md:ml-10 md:flex">
                    {navigation.map((item) => (
                        <Link key={item.name} href={item.href} className="font-medium text-blue-950 hover:text-blue-800">
                            {item.name}
                        </Link>
                    ))}
                </div>
            </div>
            {/*<div className="hidden md:flex">*/}
            {/*    <a*/}
            {/*        href="#"*/}
            {/*        className="inline-flex items-center rounded-full border border-transparent bg-blue-950 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"*/}
            {/*    >*/}
            {/*        Log in*/}
            {/*    </a>*/}
            {/*</div>*/}
        </nav>

        <Transition
            as={Fragment}
            enter="duration-150 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="duration-100 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
        >
            <Popover.Panel
                focus
                className="absolute inset-x-0 top-0 z-10 origin-top-right transform p-2 transition md:hidden"
            >
                <div className="overflow-hidden rounded-lg bg-white shadow-md ">
                    <div className="flex items-center justify-between px-5 pt-4">
                        <div>
                            <img
                                className="h-8 w-auto"
                                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                                alt=""
                            />
                        </div>
                        <div className="-mr-2">
                            <Popover.Button className="relative inline-flex items-center justify-center rounded-full text-gray-400 hover:text-gray-500 bg-white p-2 hover:bg-gray-100 focus:outline-none ">
                                <span className="absolute -inset-0.5" />
                                <span className="sr-only">Close menu</span>
                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </Popover.Button>
                        </div>
                    </div>
                    <div className="space-y-1 px-2 pb-3 pt-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="block rounded-full px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                    <a
                        href="#"
                        className="block w-full bg-gray-50 px-5 py-3 text-center font-medium text-indigo-600 hover:bg-gray-100"
                    >
                        Log in
                    </a>
                </div>
            </Popover.Panel>
        </Transition>
    </Popover>
)
