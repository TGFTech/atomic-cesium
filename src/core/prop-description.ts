export type PropResolver = (context: Object) => any;

export class PropDesc {

    private _name: string;
    private _hash: string;
    private _resolver: PropResolver;

    constructor(name: string, hash: string, resolver: PropResolver) {
        this._name = name;
        this._hash = hash;
        this._resolver = resolver;
    }

    getName(): string {
        return this._name;
    }

    getHash(): string {
        return this._hash;
    }

    getResolver(): PropResolver {
        return this._resolver;
    }

    clone(): PropDesc {
        return new PropDesc(this._name, this._hash, this._resolver);
    }
}
