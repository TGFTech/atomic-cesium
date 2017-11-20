import { PropDesc } from './prop-description';
import { ItemDesc } from './item-description';
import { ComputationCache } from './computation-cache';
import { AcDeveloperError } from './ac-developer-error';

export type PropsEvaluator = (context: Object, cache: ComputationCache) => Object;
export type AsyncPropsEvaluator = (context: Object, cache: ComputationCache) => Promise<Object>;

export function createEvaluator(desc: ItemDesc): PropsEvaluator {
    if (!(desc instanceof ItemDesc)) {
        throw new AcDeveloperError('createEvaluator', 'item desc must be instance of ItemDesc.');
    }

    const evaluatorName = `${desc.getType()}_props_evaluator`;
    const fnBody = writeEvaluatorBody(desc.getDesc());

    return new Function(`return function ${evaluatorName}(context, desc, cache) { 
        const props = {};
        ${fnBody}
         
        return props;
    }`)();
}

function writeEvaluatorBody(parsedItemDesc: Object, parentProp?: string): string {
    let fnBody = ``;

    Object.keys(parsedItemDesc).forEach(propName => {
        const propDesc = parsedItemDesc[propName];
        const key = parentProp ?  `${parentProp}.${propName}` : propName;

        if (propDesc instanceof PropDesc) {
            fnBody += `props.${key} = cache.get(desc.${key}.getHash(), desc.${key}); `;
        }
        else {
            fnBody += `props.${propName} = {}; `;
            fnBody += writeEvaluatorBody(propDesc, propName);
        }
    });

    return fnBody;
}

export function createAsyncEvaluator(desc: ItemDesc): AsyncPropsEvaluator {
    if (!(desc instanceof ItemDesc)) {
        throw new AcDeveloperError('createAsyncEvaluator', 'item desc must be instance of ItemDesc.');
    }

    const evaluatorName = `${desc.getType()}_async_props_evaluator`;
    const fnBody = writeEvaluatorBody(desc.getDesc());

    return new Function(`return function ${evaluatorName}(context, desc, cache) { 
        const props = {};
        const tasks = [];
        ${fnBody}
        
        return Promise.all(tasks).then(() => props); 
    }`)();
}

function writeAsyncEvaluatorBody(parsedItemDesc: Object, parentProp?: string): string {
    let fnBody = ``;

    Object.keys(parsedItemDesc).forEach(propName => {
        const propDesc = parsedItemDesc[propName];
        const key = parentProp ?  `${parentProp}.${propName}` : propName;

        if (propDesc instanceof PropDesc) {
            fnBody += `tasks.push(Promise.resolve(cache.get(desc.${key}.getHash(), desc.${key})).then(val => props.${key} = val)); `;
        }
        else {
            fnBody += `props.${propName} = {}; `;
            fnBody += writeAsyncEvaluatorBody(propDesc, propName);
        }
    });

    return fnBody;
}
