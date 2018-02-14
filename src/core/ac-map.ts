import {
    Viewer,
    PrimitiveCollection,
    CompositeEntityCollection
} from 'cesium';
import { AcLayer } from './ac-layer';

export class AcMap {

    private _viewer: Viewer;
    private _layers: AcLayer[];
    private _primitivesCollcetion: PrimitiveCollection;
    private _compositeEntitiesCollcetion: CompositeEntityCollection;

    constructor(viewer: Viewer) {
        this._viewer = viewer;
    }

    createEntity() {

    }

    createLayer(): AcLayer {

        return null;
    }
}
