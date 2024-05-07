import Layout from '../components/Layout';
import ErrorPage from '../pages/ErrorPage';
import { Root } from '../pages/Root.jsx';

export const routes = [
    {
        path: '/',
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/',
                element: <Root />,
                handle: { page: 'root' }
            }
        ]
    }
]
