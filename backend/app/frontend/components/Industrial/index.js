import IndustrialApp from '@wg/industrial-app';
import { dataLoader } from './data-loader';

window.viewer = {
    load: async ({resource, versionContents, domElement}) => {
        const config = {
            integration: {
                enabled: true,
                share: [
                    { title: 'Copy link', value: location.href },
                    { title: 'Copy public embed code', value: `<iframe src="${location.origin + location.pathname}" width="800" height="600" />` }
                ],
                // versionName: 'v' + version.version,
                // versionId: version.id,
                versions: [],
                backLink: '/',
                fileTitle: resource.name
            }
        };

        const industrialApp = window._industrial_app = new IndustrialApp(domElement, config);
        industrialApp._store.iv.setDataLoader(dataLoader(versionContents));

        if (versionContents['manifest.json']) {
            const manifest = await fetch(versionContents['manifest.json'].path).then(response => response.json());
            if (manifest['db']) {
                manifest['db'] = {
                    ...manifest['db'],
                    url: versionContents[manifest['db'].url].path
                }
            }
            industrialApp.set(manifest);
        } else {
            industrialApp.set({ model: { url: 'model.wmd' }});
        }
    }
};
