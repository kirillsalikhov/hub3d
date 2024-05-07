import createServer from './createServer';

createServer()
    .catch((err) => {
        console.error('error starting SSR server: ', err);
    });

