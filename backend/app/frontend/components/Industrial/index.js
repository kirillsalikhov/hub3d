import IndustrialApp, { presets } from '@wg/industrial-app';
import { dataLoader } from './data-loader';

const parkingIndex = presets.findIndex(preset => preset.name === 'Parking');
const [ parkingPreset ] = presets.splice(parkingIndex, 1);
const rearrangedPresets = [ parkingPreset, ...presets ];

window.viewer = {
    load: async ({ resource, versionContents, domElement, shareComponent }) => {
        const config = {
            presets: rearrangedPresets,
            integration: {
                enabled: true,
                shareComponent,
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
            industrialApp.set({ model: { url: 'model.wmd' } });
        }
    }
};
