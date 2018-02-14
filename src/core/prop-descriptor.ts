import * as hash from 'object-hash';
import { PropDesc, PropResolver } from './prop-description';
import { AcDeveloperError } from './ac-developer-error';
import { isString, isFunction, isObjectLike } from 'lodash';

export function isPropDesc(desc: PropDesc): boolean {
    if (!(isObjectLike(desc))) {
        return false;
    }

    return desc instanceof PropDesc;
}

export function validatePropDesc(name: any, resolver: any) {
    if (!isString(name)) {
        throw new AcDeveloperError('validatePropDesc', 'prop name must be string.');
    }

    if (!isFunction(resolver)) {
        throw new AcDeveloperError('validatePropDesc', 'prop resolver must be function.');
    }
}

export function createPropDesc(name: string, resolver: PropResolver): PropDesc {
    validatePropDesc(name, resolver);
    const descHash = hash(`${name}${resolver.toString()}`);

    return new PropDesc(name, descHash, resolver);
}
