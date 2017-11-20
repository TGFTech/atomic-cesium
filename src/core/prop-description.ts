import * as hash from 'object-hash';
import { AcDeveloperError } from 'ac-developer-error';

export type PropResolver = (context: Object) => any;

export class PropDesc {

    constructor(
        private _name: string,
        private _hash: string,
        private _resolver: PropResolver
    ) {}

    getName(): string {
        return this._name;
    }

    getHash(): string {
        return this._hash;
    }

    getResolver(): PropResolver {
        return this._resolver;
    }
}

export function validatePropDesc(name: any, resolver: any) {
    if (typeof name !== 'string') {
        throw new AcDeveloperError('validatePropDesc', 'prop name must be string.');
    }

    if (typeof resolver !== 'function') {
        throw new AcDeveloperError('validatePropDesc', 'prop resolver must be function.');
    }
}

export function createPropDesc(name: string, resolver: PropResolver): PropDesc {
    validatePropDesc(name, resolver);
    const descHash = hash(`${name}${resolver.toString()}`);

    return new PropDesc(name, descHash, resolver);
}
