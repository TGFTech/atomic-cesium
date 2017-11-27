import { ItemDesc } from './item-description';

export class EntityDesc {

    private _itemsType: string[];
    private _itemsDesc: {[key: string]: ItemDesc[]};

    constructor(itemsTypes: string[], itemsDec: {[key: string]: ItemDesc[]}) {
        this._itemsType = itemsTypes;
        this._itemsDesc = itemsDec;
    }

    getItemsTypes(): string[] {
        return this._itemsType;
    }

    getItemsDesc(): {[key: string]: ItemDesc[]} {
        return this._itemsDesc;
    }
}
