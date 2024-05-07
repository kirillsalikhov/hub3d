import {
    Link as ReactRouterLink,
    matchRoutes,
    UNSAFE_DataRouterContext,
} from 'react-router-dom';
import { useContext, useMemo } from 'react';

export const Link = ({to, ...props}) => {
    const { router: { routes } } = useContext(UNSAFE_DataRouterContext)
    
    const isExternal = useMemo(() => {
        const matches = matchRoutes(routes, to);
        return !Boolean(matches);
    }, [routes, to]);
    return <ReactRouterLink {...props} to={to} reloadDocument={isExternal} />;
}
