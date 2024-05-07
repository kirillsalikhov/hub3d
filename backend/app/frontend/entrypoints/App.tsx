import { ModelContext } from '../models/ModelProvider';
import { Model } from '../models';
import './style.css';

export const App = ({children}) => {
    const appEl = typeof document !== 'undefined' && document.getElementById('app');
    let model;
    if (appEl) {
        const initialPageData = JSON.parse(appEl.dataset.page);
        model = new Model(initialPageData);
    } else {
        model = new Model({});
    }
    return (
        <ModelContext.Provider value={model}>
            {children}
        </ModelContext.Provider>
    )
}
