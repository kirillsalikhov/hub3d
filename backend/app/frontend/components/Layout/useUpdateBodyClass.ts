import { useMatches } from 'react-router-dom';
import { isBrowser, useEnhancedEffect } from '@/util/isBrowser.ts';
import type {UIMatch} from "@remix-run/router";

export const useUpdateBodyClass = () => {
    interface IHandle {
        className?: string
    }

    const matches = useMatches() as UIMatch<unknown, IHandle>[];
    useEnhancedEffect(() => {
        if (isBrowser() && matches.length > 0) {
            const bodyClasses = matches
                // .filter((match) => match.handle && match.handle['className'])
                .filter((match) => match?.handle?.className)
                .map((match) => `body-page-${match?.handle?.className}`);
            const oldClasses = [...document.body.classList.values()]
                .filter((oldBodyClass) => /body-page-[a-zA-Z\-_]+/.test(oldBodyClass));
            document.body.classList.remove(...oldClasses);
            document.body.classList.add(...bodyClasses);
        }
    }, [matches]);
}
