import * as ActiveStorage from '@rails/activestorage'
import {initInertia} from "~/util/init-inertia";

import "./style.css"


// TODO move somewhere where it's needed ?
ActiveStorage.start()

import {fooBarFunc} from "~/dummy/dummy-module";

console.log('Vite ⚡️ Rails')
fooBarFunc();

console.log('Visit the guide for more information: ', 'https://vite-ruby.netlify.app/guide/rails');

(async () => initInertia())();

// Example: Load Rails libraries in Vite.
//
// import * as Turbo from '@hotwired/turbo'
// Turbo.start()
//

// // Import all channels.
// const channels = import.meta.globEager('./**/*_channel.js')

// Example: Import a stylesheet in app/frontend/index.css
// import '~/index.css'
