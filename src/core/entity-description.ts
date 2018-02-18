import { ItemDesc } from './item-description';

export class EntityDesc {

    private _itemsType: string[];
    private _itemsDesc: {[key: string]: ItemDesc[]};

    constructor(itemsTypes: string[], itemsDesc: {[key: string]: ItemDesc[]}) {
        this._itemsType = itemsTypes;
        this._itemsDesc = itemsDesc;
    }

    getItemsTypes(): string[] {
        return this._itemsType;
    }

    getItemsDesc(): {[key: string]: ItemDesc[]} {
        return this._itemsDesc;
    }
}
