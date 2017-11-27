import * as hash from 'object-hash';
import { ItemDesc } from './item-description';
import { AcDeveloperError } from 'ac-developer-error';
import { createPropDesc as createProp } from './prop-descriptor';
import { has, isString, isFunction, isObjectLike } from 'lodash';

export function isItemDesc(desc: ItemDesc): boolean {
    if (!(isObjectLike(desc))) {
        return false;
    }

    return desc instanceof ItemDesc;
}

export function validateItemDesc(description: Object) {
    const { type, ...props } = description;
    validateItemPropsDesc(props);

    if (!has(description, 'type')) {
        throw new AcDeveloperError('validateItemDesc', 'item desc must includes type.');
    }

    if (!isString(type)) {
        throw new AcDeveloperError('validateItemDesc', 'item desc type must br string.');
    }
}

function validateItemPropsDesc(description: Object) {
    if (!isObjectLike(description)) {
        throw new AcDeveloperError('validateSubItemDesc', 'item desc must be object of {type: string, ...props}.');
    }

    Object.keys(description).forEach(key => {
        const value = description[key];

        if (isObjectLike(value)) {
            validateItemPropsDesc(value);
        }
        else if (isFunction(value)) {
            throw new AcDeveloperError('validateSubItemDesc', 'item desc property must be object of {type: string, ...props} or function.');
        }
    });
}

export function parseItemDesc(description: Object): ItemDesc {
    validateItemDesc(description);

    const descHash = hash(description);
    const { type, ...props } = description;
    const parsedProps = parseItemPropsDesc(props);

    return new ItemDesc(type, descHash, parsedProps);
}

function parseItemPropsDesc(props: Object): Object {
    const result = {};

    Object.keys(props).forEach(propName => {
        const propValue = props[propName];

        if (isObjectLike(propValue)) {
            result[propName] = parseItemPropsDesc(propValue);
        }
        else {
            result[propName] = createProp(propName, propValue);
        }
    });

    return result;
}
