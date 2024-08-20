import Layout from '../components/Layout';
import ErrorPage from '../pages/ErrorPage';
import Conversion from '../pages/Conversion.jsx';
import { SignIn } from '../pages/SignIn.jsx';
import { SignUp } from '../pages/SignUp.jsx';
import { Resource } from '../pages/Resource.jsx';
import ResourcePassword from '../pages/ResourcePassword.jsx';
import { Dashboard } from '../pages/Dashboard.jsx';
import {getConversionPageData, getDashboardPageData, getResourcePageData} from './loaderHelper';
import {QueryClient} from "@tanstack/react-query";

export const routes = (queryClient: QueryClient) => [
    {
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/s/:spaceKey',
                children: [
                    {
                        path: '',
                        element: <Dashboard />,
                        loader: () => getDashboardPageData(queryClient)(),
                        handle: { className: 'space-dashboard' }
                    },
                    {
                        path: 'conversions/:conversionId',
                        element: <Conversion />,
                        loader: ({ params }) => getConversionPageData(params.conversionId),
                        handle: { className: 'conversion' }
                    },
                    {
                        path: 'resources/:resourceId',
                        element: <Resource />,
                        loader: ({ params }) => getResourcePageData(params.resourceId),
                        handle: { className: 'resource' }
                    },
                    {
                        path: 'resources/:resourceId/auth-password',
                        element: <ResourcePassword />,
                        handle: { className: 'resource-auth' }
                    },
                ]
            },
            {
                path: '/users/sign_in',
                element: <SignIn />,
                handle: { className: 'sign-in' }
            },
            {
                path: '/users/sign_up',
                element: <SignUp />,
                handle: { className: 'sign-up' }
            }
        ]
    }
]
