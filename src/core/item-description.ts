import * as hash from 'object-hash';
import { parseItemDesc } from './descriptions';

export class ItemDesc {

    private _hash: string;
    private _description: Object;

    constructor(description: Object) {
        this._hash = hash(description);
        this._description = parseItemDesc(description);
    }

    getType(): string {
        return this._description['type'];
    }

    getDesc(): Object {
        const { type, ...propsDesc} = this._description;

        return propsDesc;
    }

    getHash(): string {
        return this._hash;
    }

    evaluateProps(context: Object) {

    }

    assignProps(props: Object, tatget: Object) {

    }

    execute(context: Object, tatget: Object) {

    }
}

