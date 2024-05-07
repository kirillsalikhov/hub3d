import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ActionCable from '../util/ActionCable.js';
import { routes } from '../routes/routes';
import { App } from './App';
import './style.css';

const domNode = document.getElementById('app');

const wsProtocol = window.location.protocol.includes('https') ? 'wss' : 'ws';
ActionCable.url = `${wsProtocol}://${window.location.host}/cable`;

const router = createBrowserRouter(routes);
const root = createRoot(domNode, {
    onRecoverableError: (error, errorInfo) => {
        console.error(
            'Caught error',
            error,
            error.cause,
            errorInfo.componentStack
        );
    }
});

root.render(<App><RouterProvider router={router} /></App>);
