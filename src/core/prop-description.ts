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

