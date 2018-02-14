import { Drawer } from '../core/drawer';
import { AcItem } from '../core/ac-item';
import { ItemDesc } from '../core/item-description';
import { Props } from '../core/props-operations';
import { AcDeveloperError } from '../core/ac-developer-error';
import {
PrimitiveCollection,
CompositeEntityCollection
} from 'cesium';

export abstract class PrimitiveDrawer<T> implements Drawer {

    private _items: Map<AcItem, object>;
    private _primitiveCollection: T;
    private _exportedCollection: PrimitiveCollection;

    constructor(primitiveType: {new (): T}) {
        this._items = new Map<AcItem, object>();
        this._primitiveCollection = new primitiveType();
        this._exportedCollection = new PrimitiveCollection();
        this._exportedCollection.add(this._primitiveCollection);
    }

    draw(desc: ItemDesc, context: object): AcItem {
        const def = Props.evaluate(desc, context, null);
        const primitive = this._primitiveCollection.add(def);
        const item = new AcItem(desc, this);
        this._items.set(item, primitive);

        return item;
    }

    render(item: AcItem, context: object): AcItem {
        const primitive = this._items.get(item);

        if (!primitive) {
            throw new AcDeveloperError('PrimitiveDrawer', 'drawer not contain this item.');
        }

        Props.execute(item.getDesc(), primitive, context, null);

        return item;
    }

    remove(item: AcItem): void {
        const primitive = this._items.get(item);

        if (!primitive) {
            throw new AcDeveloperError('PrimitiveDrawer', 'drawer not contain this item.');
        }

        this._primitiveCollection.remove(primitive);
        item.destroy();
    }

    getPrimitives(): PrimitiveCollection {
        return this._exportedCollection;
    }

    getEntities(): CompositeEntityCollection {
        return null;
    }

    show() {
        this._exportedCollection.show = true;
    }

    hide() {
        this._exportedCollection.show = false;
    }

    clear() {
        this._items.forEach((primitive, item) => {
            this._primitiveCollection.remove(primitive);
            item.destroy();
        });
    }
}
