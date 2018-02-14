import { AcItem } from './ac-item';
import { ItemDesc } from './item-description';
import {
    PrimitiveCollection,
    CompositeEntityCollection
} from 'cesium';

export interface Drawer {
    draw(desc: ItemDesc, context: object): AcItem;
    render(item: AcItem, context: object): AcItem;
    remove(item: AcItem): void;
    getPrimitives(): PrimitiveCollection;
    getEntities(): CompositeEntityCollection;
    show();
    hide();
    clear();
}
