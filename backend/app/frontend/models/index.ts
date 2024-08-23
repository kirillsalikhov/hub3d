import { ResourceViewModel } from './ResourceViewModel';
import { action, computed, makeObservable, observable, toJS } from 'mobx';

export interface IPageData {
    uploadsPath?: string
    [key: string]: unknown
}

export class Model {
    resourceViewModel: ResourceViewModel;
    private _pageData: IPageData;
    constructor(initialPageData: IPageData) {
        this.resourceViewModel = new ResourceViewModel();
        this._pageData = initialPageData;
        makeObservable<Model, '_pageData'>(this, {
            _pageData: observable.ref,
            setPageData: action.bound,
            pageData: computed
        })
    }

    setPageData(data: IPageData) {
        this._pageData = data;
    }

    get pageData() {
        return toJS(this._pageData);
    }
}
