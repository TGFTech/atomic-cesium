import { PropResolver } from './prop-description';

export interface PropsDesc {
    [key: string]: PropResolver;
}

export class ItemDesc {

    private _type: string;
    private _hash: string;
    private _propsDesc: PropsDesc;

    constructor(type: string, hash: string, propsDesc: PropsDesc) {
        this._type = type;
        this._hash = hash;
        this._propsDesc = propsDesc;
    }

    getType(): string {
        return this._type;
    }

    getHash(): string {
        return this._hash;
    }

    getPropsDesc(): PropsDesc {
        return this._propsDesc;
    }

    clone(): ItemDesc {
        return new ItemDesc(this._type, this._hash, this._propsDesc);
    }
}
