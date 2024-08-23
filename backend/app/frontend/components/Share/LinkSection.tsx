import { LinkIcon } from '@heroicons/react/20/solid';
import { useCallback, useState, MouseEvent} from 'react';

const Tooltip = () => {
    return (
        <div className="absolute right-2 px-4 py-3 bg-blue-600 text-sm text-white leading-6 shadow-md">
            Link copied!
        </div>
    )
}
export const LinkSection = () => {
    const [ linkCopied, setLinkCopied ] = useState(false)

    const onCopyLinkClick = useCallback(async (e: MouseEvent) => {
        e.preventDefault();
        try {
            await navigator.clipboard.writeText(window.location.href);
            console.log('Content copied to clipboard');
            setLinkCopied(true);
            setTimeout(() => {
                setLinkCopied(false);
            }, 3000);
        } catch (err) {
            console.error('Failed to copy link: ', err);
        }
    }, []);

    return (
        <div className="flex mt-2 items-center">
            <div className="pointer-events-none absolute flex-none items-center">
                <LinkIcon className="h-5 w-5 m-2.5 text-gray-400" aria-hidden="true" />
            </div>
            <input
                type="text"
                className="flex-grow rounded-none rounded-l-md border-0 shadow-inner pl-10 pr-2 py-2 text-sm leading-6 text-gray-900 truncate ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-blue-800  focus:outline-none"
                value={ window.location.href }
                readOnly
            />
            <button
                onClick={ onCopyLinkClick }
                type="button"
                className="flex-none -ml-px items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm leading-6 bg-blue-800 text-white ring-1 ring-inset ring-blue-800 hover:bg-blue-700">
                Copy link
            </button>
            { linkCopied && (<Tooltip />) }
        </div>
    )
}
