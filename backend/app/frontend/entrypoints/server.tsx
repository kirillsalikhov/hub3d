import { createStaticHandler, createStaticRouter, StaticRouterProvider, StaticHandlerContext } from 'react-router-dom/server';
import { routes } from '../routes/routes-ssr.tsx';
import { renderToString } from 'react-dom/server';
import { App } from './App';
const handler = createStaticHandler(routes);
export const render = async (fetchRequest) => {
    global['ssrFetchRequest'] = fetchRequest;
    let context = await handler.query(fetchRequest) as StaticHandlerContext;

    let router = createStaticRouter(
        handler.dataRoutes,
        context
    );
    const html = renderToString(
        <App>
            <StaticRouterProvider context={context} router={router} />
        </App>
    )
    return html
}

export const ssrRoutes = routes;
// do not remove! console.log is needed to prevent tree-shaking
console.log(ssrRoutes);
