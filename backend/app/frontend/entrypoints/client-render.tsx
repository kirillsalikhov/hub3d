import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ActionCable from '../util/ActionCable.js';
import { routes } from '../routes/routes';
import { App } from './App';
import './style.css';
import {useQueryClient} from "@tanstack/react-query";
import {useMemo} from "react";

const domNode = document.getElementById('app');

const wsProtocol = window.location.protocol.includes('https') ? 'wss' : 'ws';
ActionCable.url = `${wsProtocol}://${window.location.host}/cable`;

// TODO make consistent with ssr
const AppRouter = () => {
    const queryClient = useQueryClient();

    const router = useMemo(() => {
        return createBrowserRouter(routes(queryClient));
    }, [queryClient]);

    return <RouterProvider router={router} />;
};

const root = createRoot(domNode, {
    onRecoverableError: (error, errorInfo) => {
        console.error(
            'Caught error',
            error,
            error['cause'],
            errorInfo.componentStack
        );
    }
});

root.render(<App><AppRouter /></App>);
