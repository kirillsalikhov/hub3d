const createRequest = (path) => {
    let origin = `https://pulse3d.io`;
    const url = new URL(path, origin);
    url.search = ''
    url.hash = ''
    url.pathname = path

    let init = {
        method: 'GET',
        headers: new Headers()
    };

    return new Request(url.href, init)
}

async function routesToPaths(routes) {
    const pathToEntry = []

    if (!routes || routes.length === 0)
        return pathToEntry

    const getRoutePath = (prefix, path) => {
        if (!path && !prefix) { return path; }
        if (!prefix || path.startsWith('/')) { return path; }
        if (!path) { return prefix; }
        return `${ prefix }/${ path }`;
    }

    const getPaths = (routes, prefix = '') => {
        prefix = prefix.replace(/\/$/g, '')
        for (const route of routes) {
            const path = getRoutePath(prefix, route.path);
            if (route.handle?.page)
                pathToEntry.push({ fileName: `${route.handle?.page}.html`, requestUrl: path });
            if (Array.isArray(route.children))
                getPaths(route.children, path)
        }
    }
    getPaths(routes)
    return pathToEntry;
}


const prerender = async () => {
    const fs = await import('node:fs/promises');
    const path = await import('node:path');

    const ROOT = path.join(__dirname, '../../..');
    const SSR_PATH = 'public/vite-ssr';
    const ASSETS_PATH = `${ SSR_PATH }/assets`;
    const ABSOLUTE_ASSETS_PATH = `${ ROOT }/${ ASSETS_PATH }`

    const assets = await fs.readdir(ABSOLUTE_ASSETS_PATH);
    const serverFile = assets.find(x => /server-([a-zA-Z0-9\-_]+)\.mjs$/.test(x));
    const serverUrl = path.relative(__dirname, ABSOLUTE_ASSETS_PATH);
    const server = await import(`${ serverUrl }/${ serverFile }`);
    const { ssrRoutes, render } = server;
    const routes = await routesToPaths(ssrRoutes);
    for (const { fileName, requestUrl } of routes) {
        const fetchRequest = createRequest(requestUrl);
        const appHtml = await render(fetchRequest);
        const filePath = `${ SSR_PATH }/${ fileName }`
        await fs.writeFile(filePath, appHtml);
    }
}

prerender().catch((err) => {
    console.log(err);
    throw err;
});

