import {
    Link as ReactRouterLink, LinkProps,
    matchRoutes,
    UNSAFE_DataRouterContext,
} from 'react-router-dom';
import { useContext, useMemo } from 'react';

export const Link = ({to, ...props} : LinkProps) => {
    const routerContext = useContext(UNSAFE_DataRouterContext)
    const routes = routerContext?.router.routes

    const isExternal = useMemo(() => {
        if (routes) {
            const matches = matchRoutes(routes, to);
            return !Boolean(matches);
        }
        return false;
    }, [routes, to]);
    return <ReactRouterLink {...props} to={to} reloadDocument={isExternal} />;
}
