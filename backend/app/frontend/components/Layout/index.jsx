import { Children } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../Header';
import { useUpdateBodyClass } from './useUpdateBodyClass';
import { useSetPageData } from './useSetPageData';

export default function Layout({children = null}) {
    useUpdateBodyClass();
    useSetPageData();
    return (
        <div className="min-h-full flex flex-col relative bg-front bg-cover">
            <Header/>
            <main className="flex-auto flex flex-col">
                { Children.count(children) === 0 ? <Outlet /> : children }
            </main>
        </div>
    )
}
