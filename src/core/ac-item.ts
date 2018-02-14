import { Drawer } from './drawer';
import { ItemDesc } from './item-description';

export class AcItem {
    private _desc: ItemDesc;
    private _drawer: Drawer;
    private _cesiumObject: object;

    constructor(desc: ItemDesc, drawer: Drawer, cesiumObject: object) {
        this._desc = desc;
        this._drawer = drawer;
        this._cesiumObject = cesiumObject;
    }

    render(context: object) {
        this._drawer.render(this, context);
    }

    getDesc(): ItemDesc {
        return this._desc;
    }

    getDrawer(): Drawer {
        return this._drawer;
    }

    getCesiumObject(): object {
        return this._cesiumObject;
    }

    destroy() {
        this._desc = null;
        this._drawer = null;
    }
}
