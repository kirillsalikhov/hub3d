import { useEffect, useState } from 'react';

// TODO For Marina: I hope for https://github.com/ElMassimo/js_from_routes
// otherwise it's ok to hardcode somewhere
const google_auth_path = '/users/auth/google_oauth2';

// We need to be a real form for two reasons:
//  1.  omniauth don't respect skip_forgery_protection
//      (it works in omniauth_callbacks_controller.rb, but not in deep omniauth controllers)
//  2.  when google redirects to it's auth page, redirect doesn't work inside js
//      (sure for redirects with error due cors, probably for others too)
// P.s. this note can be deleted
export const GoogleButton = ({ url = google_auth_path }) => {
    const [ token, setToken ] = useState<string>('should-be-overridden');

    useEffect(() => {
        const _token = (document.querySelector('[name=csrf-token]') as HTMLMetaElement).content;
        setToken(_token);
    }, []);

    return (
        <form action={ url } method="POST">
            <input type="hidden" name="authenticity_token" value={ token } />
            <button
                type="submit"
                className="mt-4 p-4 w-full rounded bg-indigo-700 hover:bg-indigo-500 text-white text-center">
                Google
            </button>
        </form>
    )
}
