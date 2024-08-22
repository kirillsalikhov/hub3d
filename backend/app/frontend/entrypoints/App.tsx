import { ModelContext } from '../models/ModelProvider';
import { Model } from '../models';
import './style.css';
import React from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

type AppProps = {
    children: React.ReactNode;
}

export const App = ({children}: AppProps) => {
    const appEl = typeof document !== 'undefined' && document.getElementById('app');
    let model;
    if (appEl) {
        // TODO check, most likely won't need
        const initialPageData = JSON.parse(appEl.dataset.page!);
        model = new Model(initialPageData);
    } else {
        model = new Model({});
    }

    // one instance, should create one instance for ssr
    const [queryClient] = React.useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                    },
                },
            }),
    )

    return (
        <ModelContext.Provider value={model}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </ModelContext.Provider>
    )
}
