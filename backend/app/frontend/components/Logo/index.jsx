import { Link } from '../../routes/Link';
import logo from './logo.svg';
import logoColor from './logo-c.svg';

export const Logo = () => {
    return (
        <Link to="/">
            <div className="group relative">
                <img
                    className="h-6 sm:h-8 w-auto group-hover:opacity-0"
                    src={logo}
                    alt=""
                />
                <img
                    className="absolute top-0 left-0 h-8 w-auto opacity-0 group-hover:opacity-100"
                    src={logoColor}
                    alt=""
                />
            </div>
        </Link>
    )
}
