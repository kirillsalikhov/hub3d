import { Link } from '@inertiajs/react';
import sign from './sign.svg';
import signColor from './sign-c.svg';

export const LogoSign = () => {
    return (
        <div className="flex justify-center p-8">
            <Link href="/">
                <div className="group relative">
                    <img
                        className="h-8 w-auto group-hover:opacity-0"
                        src={ sign }
                        alt=""
                    />
                    <img
                        className="absolute top-0 left-0 h-8 w-auto opacity-0 group-hover:opacity-100"
                        src={ signColor }
                        alt=""
                    />
                </div>
            </Link>
        </div>
    )
}
