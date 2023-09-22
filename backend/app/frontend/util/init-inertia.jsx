import {createInertiaApp} from "@inertiajs/react";
import {createRoot} from "react-dom/client";
import ActionCable from './ActionCable';

export async function initInertia() {
    return createInertiaApp({
        resolve: name => {
            const pages = import.meta.glob('~/pages/**/*.jsx', {eager: true});
            // Yes, it's without ~
            return pages[`/pages/${name}.jsx`];
        },
        setup({el, App, props}) {
            createRoot(el).render(<App {...props} />);
            ActionCable.url = `ws://${window.location.host}/cable`;
        },
    });
}
