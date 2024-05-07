import {
    matchRoutes,
    UNSAFE_DataRouterContext,
    useNavigate as useReactNavigate
} from 'react-router-dom';
import { useContext, useMemo } from 'react';

export const useNavigate = () => {
    const navigate = useReactNavigate();
    const { router: { routes } } = useContext(UNSAFE_DataRouterContext)

    const isExternal = useMemo(() => (url) => {
        const matches = matchRoutes(routes, url);
        return !Boolean(matches);
    }, [routes]);
    
    return (url) => {
        isExternal(url) ?
            window.location.href = url :
            navigate(url)
    }
}
