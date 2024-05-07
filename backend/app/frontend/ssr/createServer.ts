import express from 'express';
import { createServer as createViteServer } from 'vite'
import { createFetchRequest } from './request';

const isProd = process.env.NODE_ENV === 'production';
export default async (port?: number): Promise<void> => {
    const _port = port || 13714
    const app = express();
    let vite;
    if (!isProd) {
        vite = await createViteServer({
            server: { middlewareMode: true },
            appType: 'custom'
        })
        app.use(vite.middlewares)
    }
    app.use('*', async (req, res) => {
        let render;
        if (!isProd) {
            console.log('ssr load module for development');
            const serverEntrypoint = vite.config.viteRuby.entrypoints.find(([relativePath]) => relativePath === 'entrypoints/server.tsx');
            if (!serverEntrypoint || !serverEntrypoint?.[1]) { throw 'no entrypoint with name server.tsx found' }
            const serverEntrypointUrl = serverEntrypoint[1];
            render = (await vite.ssrLoadModule(serverEntrypointUrl)).render;
        } else {
            render = (await import('../entrypoints/server')).render;
        }

        const fetchRequest = createFetchRequest(req, res);

        try {
            const html = await render(fetchRequest);
            res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
        } catch (e) {
            console.error(e)
        }
        console.log('response ended')
    })

    app.listen(_port)
    console.log(`Starting SSR server on port ${_port}...`)
}
