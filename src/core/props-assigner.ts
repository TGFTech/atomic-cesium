import { PropDesc } from './prop-description';
import { ItemDesc } from './item-description';
import { AcDeveloperError } from './ac-developer-error';

type PropsAssigner = (source: Object, target: Object) => Object;

export function createAssigner(desc: ItemDesc): PropsAssigner {
    if (!(desc instanceof ItemDesc)) {
        throw new AcDeveloperError('createAssigner', 'item desc must be instance of ItemDesc.');
    }

    const assignerName = `${desc.getType()}_props_assigner`;
    const fnBody = writeAssignerBody(desc.getDesc());

    return new Function(`return function ${assignerName}(source, target) { ${fnBody} return target; }`)();
}

function writeAssignerBody(parsedItemDesc: Object, parentProp?: string): string {
    let fnBody = ``;

    Object.keys(parsedItemDesc).forEach(propName => {
        const propDesc = parsedItemDesc[propName];
        const key = parentProp ?  `${parentProp}.${propName}` : propName;

        if (propDesc instanceof PropDesc) {
            fnBody += `target.${key} = source.${key}; `;
        }
        else {
            fnBody += `target.${propName} ? {} : target.${propName} = {}; `;
            fnBody += writeAssignerBody(propDesc, propName);
        }
    });

    return fnBody;
}
