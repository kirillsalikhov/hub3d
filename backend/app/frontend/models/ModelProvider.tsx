import { createContext, useContext } from 'react'
import { Model } from './index';
export const ModelContext = createContext<Model | undefined>(undefined);
export const useModel = () => {
    const context = useContext(ModelContext);
    if (!context) {
        throw new Error('useModel must be used within a ModelProvider');
    }

    return context;
}
