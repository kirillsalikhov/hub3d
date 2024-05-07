import { Children, useEffect } from 'react';
import { Outlet, useLocation, useMatches } from 'react-router-dom';
import { Header } from '../Header';
import { useModel } from '../../models/ModelProvider';
import { isBrowser, useEnhancedEffect } from '../../util/isBrowser';

export default function Layout({children}) {
    const model = useModel();
    const location = useLocation();
    const matches = useMatches();
    useEnhancedEffect(() => {
        if (isBrowser() && matches.length > 0) {
            const bodyClasses = matches
                .filter((match) => typeof(match.handle?.page) !== 'undefined')
                .map((match) => `body-page-${match.handle?.page}`);
            const oldClasses = [...document.body.classList.values()]
                .filter((oldBodyClass) => /body-page-[a-zA-Z\-_]+/.test(oldBodyClass));
            document.body.classList.remove(...oldClasses);
            document.body.classList.add(...bodyClasses);
        }
    }, [matches]);
    useEffect(() => {
        const app = document.getElementById('app');
        model.setPageData(JSON.parse(app.dataset.page));
    }, [location]);
    return (
        <div className="min-h-full flex flex-col relative bg-front bg-cover">
            <Header/>
            <main className="flex-auto flex flex-col">
                { Children.count(children) === 0 ? <Outlet /> : children }
            </main>
        </div>
    )
}
