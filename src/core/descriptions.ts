import * as hash from 'object-hash';
import { ItemDesc } from './item-description';
import { AcDeveloperError } from 'ac-developer-error';
import { PropDesc, PropResolver } from './prop-description';

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

export function validateItemDesc(description: Object) {
    const { type, ...props} = description;
    validateSubItemDesc(props);

    if (!description.hasOwnProperty('type')) {
        throw new AcDeveloperError('validateItemDesc', 'item desc must includes type.');
    }

    if (typeof type !== 'string') {
        throw new AcDeveloperError('validateItemDesc', 'item desc type must br string.');
    }
}

function validateSubItemDesc(description: Object) {
    if (typeof description !== 'object') {
        throw new AcDeveloperError('validateSubItemDesc', 'item desc must be object of {type: string, ...props}.');
    }

    Object.keys(description).forEach(key => {
        const value = description[key];

        if (typeof value === 'object') {
            validateSubItemDesc(value);
        }
        else if (typeof value !== 'function') {
            throw new AcDeveloperError('validateSubItemDesc', 'item desc property must be object of {type: string, ...props} or function.');
        }
    });
}

export function parseItemDesc(description: Object): Object {
    const result = {};
    validateItemDesc(description);

    Object.keys(description).forEach(propName => {
        const propResolver = description[propName];

        if (propName === 'type') {
            result[propName] = propResolver;
        }
        else if (typeof propResolver === 'object') {
            result[propName] = parseItemDesc(propResolver);
        }
        else {
            result[propName] = createPropDesc(propName, propResolver);
        }
    });

    return result;
}

export function createItemDesc(description: Object): ItemDesc {
    return new ItemDesc(description);
}
