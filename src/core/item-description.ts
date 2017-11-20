import { createPropDesc } from 'prop-description';
import { AcDeveloperError } from 'ac-developer-error';

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

export class ItemDesc {

    private _description: Object;

    constructor(description: Object) {
        this._description = parseItemDesc(description);
    }

    getType(): string {
        return this._description['type'];
    }

    getDesc(): Object {
        const { type, ...propsDesc} = this._description;

        return propsDesc;
    }

    evaluateProps(context: Object) {

    }

    assignProps(props: Object, tatget: Object) {

    }

    execute(context: Object, tatget: Object) {

    }
}

export function createItemDesc(description: Object): ItemDesc {
    return new ItemDesc(description);
}
