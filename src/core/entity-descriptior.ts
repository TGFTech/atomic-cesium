import { EntityDesc } from './entity-description';
import { AcDeveloperError } from './ac-developer-error';
import { validateItemDesc, parseItemDesc } from './item-descriptor';

export function validateEntityDesc(description: object[]) {
    if (!Array.isArray(description)) {
        throw new AcDeveloperError('validateEntityDesc', 'entity description must be array.');
    }

    description.forEach(itemDesc => validateItemDesc(itemDesc));
}

export function parseEntityDesc(description: object[]): EntityDesc {
    validateEntityDesc(description);

    const itemsDesc = {};

    description.forEach(desc => {
        const itemDesc = parseItemDesc(desc);

        if (!itemsDesc[itemDesc.getType()]) {
            itemsDesc[itemDesc.getType()] = [];
        }

        itemsDesc[itemDesc.getType()].push(itemDesc);
    });

    const itemsTypes = Object.keys(itemsDesc);

    return new EntityDesc(itemsTypes, itemsDesc);
}
