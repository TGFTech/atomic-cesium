import { PropDesc } from './prop-description';

export class ComputationCache {

    private _cache: Map<string, any>;

    constructor() {
        this._cache = new Map<string, any>();
    }

    get(key: string, desc: PropDesc, context: Object): any {
        if (this._cache.has(key)) {
            return this._cache.get(key);
        }

        const value = desc.getResolver()(context);
        this._cache.set(desc.getHash(), value);

        return value;
    }

    clear() {
        this._cache.clear();
    }
}
