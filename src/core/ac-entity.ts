import { EntityDesc } from './entity-description';

export class AcEntity {
    private _data: object;
    private _entityDesc: EntityDesc;
    private _itemsType: string[];
    private _itemsDesc: {[key: string]: ItemDesc};

    constructor(desc: EntityDesc) {
        this._entityDesc = desc;
    }

    addItem(desc: object) {

    }

    removeItem(key: string) {

    }
}
