import Layout from '../components/Layout';
import ErrorPage from '../pages/ErrorPage';
import Conversion from '../pages/Conversion.jsx';
import { Resource } from '../pages/Resource.jsx';
import ResourcePassword from '../pages/ResourcePassword.jsx';
import { getConversionPageData, getResourcePageData } from './loaderHelper';

export const routes = [
    {
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/conversions/:conversionId',
                element: <Conversion />,
                loader: ({ params }) => getConversionPageData(params.conversionId),
                handle: { page: 'conversion' }
            },
            {
                path: '/resources/:resourceId',
                element: <Resource />,
                loader: ({ params }) => getResourcePageData(params.resourceId),
                handle: { page: 'resource' }
            },
            {
                path: '/resources/:resourceId/auth-password',
                element: <ResourcePassword />,
                handle: { page: 'resource-auth' }
            }
        ]
    }
]
