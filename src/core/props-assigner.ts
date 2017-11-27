import { isPropDesc } from './prop-descriptor';
import { ItemDesc } from './item-description';
import { isItemDesc } from './item-descriptor';
import { AcDeveloperError } from './ac-developer-error';

export type PropsAssigner = (source: Object, target: Object) => Object;

export function assign(desc: ItemDesc, source: Object, target: Object): Object {
    let assigner = assign['cache'].get(desc.getHash());

    if (!assigner) {
        assigner = createAssigner(desc);
        assign['cache'].set(desc.getHash(), assigner);
    }

    return assigner(source, target);
}

assign['cache'] = new Map<string, PropsAssigner>();

export function createAssigner(desc: ItemDesc): PropsAssigner {
    if (!isItemDesc(desc)) {
        throw new AcDeveloperError('createAssigner', 'item desc must be instance of ItemDesc.');
    }

    const assignerName = `${desc.getType()}_props_assigner`;
    const fnBody = writeAssignerBody(desc.getPropsDesc());

    return new Function(`return function ${assignerName}(source, target) { ${fnBody} return target; }`)();
}

function writeAssignerBody(parsedItemDesc: Object, parentProp?: string): string {
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
