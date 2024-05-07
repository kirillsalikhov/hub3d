import { makeObservable, observable, action } from 'mobx';

export class ResourceViewModel {

    hasLinkPassword = false;
    linkAccess = 'view';

    constructor() {
        makeObservable(this, {
            hasLinkPassword: observable,
            setHasLinkPassword: action.bound
        });
    }

    setHasLinkPassword(hasLinkPassword) {
        this.hasLinkPassword = hasLinkPassword
    }
}
