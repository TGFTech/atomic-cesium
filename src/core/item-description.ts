export class ItemDesc {

    private _type: string;
    private _hash: string;
    private _propsDesc: object;

    constructor(type: string, hash: string, propsDesc: object) {
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

    getPropsDesc(): object {
        return this._propsDesc;
    }

    clone(): ItemDesc {
        return new ItemDesc(this._type, this._hash, this._propsDesc);
    }
}
