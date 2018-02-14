import { isPropDesc } from './prop-descriptor';
import { ItemDesc } from './item-description';
import { isItemDesc } from './item-descriptor';
import { AcDeveloperError } from './ac-developer-error';

export type PropsAssigner = (target: object, source: object) => object;

const assignersCache = new Map<string, PropsAssigner>();

export function assign(desc: ItemDesc, target: object, source: object): object {
    let assigner = assignersCache.get(desc.getHash());

    if (!assigner) {
        assigner = createAssigner(desc);
        assignersCache.set(desc.getHash(), assigner);
    }

    return assigner(target, source);
}

export function createAssigner(desc: ItemDesc): PropsAssigner {
    if (!isItemDesc(desc)) {
        throw new AcDeveloperError('createAssigner', 'item desc must be instance of ItemDesc.');
    }

    const assignerName = `${desc.getType()}_props_assigner`;
    const fnBody = writeAssignerBody(desc.getPropsDesc());

    return new Function(`return function ${assignerName}(target, source) { ${fnBody} return target; }`)();
}

function writeAssignerBody(parsedItemDesc: object, parentProp?: string): string {
    let fnBody = ``;

    Object.keys(parsedItemDesc).forEach(propName => {
        const propDesc = parsedItemDesc[propName];
        const key = parentProp ?  `${parentProp}.${propName}` : propName;

        if (isPropDesc(propDesc)) {
            fnBody += `target.${key} = source.${key}; `;
        }
        else {
            fnBody += `target.${propName} ? {} : target.${propName} = {}; `;
            fnBody += writeAssignerBody(propDesc, propName);
        }
    });

    return fnBody;
}
