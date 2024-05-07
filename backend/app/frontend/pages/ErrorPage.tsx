import React from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import Layout from '../components/Layout';

const ErrorPage = () => {
    const error = useRouteError();

    let message = 'Something went wrong';

    if (error.message && error.message.includes('Failed to fetch')) {
        message = 'No internet connection';
    }

    if (isRouteErrorResponse(error)) {
        if (error.status === 404) {
            message = 'Page not found';
        }

        if (error.status === 401) {
            message = 'Authenticate to view this page';
        }

        if (error.status === 403) {
            message = 'You are not authorized to view this page';
        }

        if (error.status === 503) {
            message = 'Server error';
        }
    }

    return (
        <Layout>
            <div>{error.status}</div>
            <div>{message}</div>
        </Layout>
    )
};

export default ErrorPage;
