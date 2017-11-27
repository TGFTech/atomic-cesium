import { isPropDesc } from './prop-descriptor';
import { ItemDesc } from './item-description';
import { isItemDesc } from './item-descriptor';
import { ComputationCache } from './computation-cache';
import { AcDeveloperError } from './ac-developer-error';

export type PropsExecutor = (target: Object, context: Object, cache: ComputationCache) => Object;
export type AsyncPropsExecutor = (target: Object, context: Object, cache: ComputationCache) => Promise<Object>;

export function createExecutor(desc: ItemDesc): PropsExecutor {
    if (!isItemDesc(desc)) {
        throw new AcDeveloperError('createEvaluator', 'item desc must be instance of ItemDesc.');
    }

    const evaluatorName = `${desc.getType()}_props_executor`;
    const fnBody = writeExecutorBody(desc.getPropsDesc());

    return new Function(`return function ${evaluatorName}(target, context, desc, cache) { 
        ${fnBody}
         
        return target;
    }`)();
}

function writeExecutorBody(propsDesc: Object, parentProp?: string): string {
    let fnBody = ``;

    Object.keys(propsDesc).forEach(propName => {
        const propDesc = propsDesc[propName];
        const key = parentProp ?  `${parentProp}.${propName}` : propName;

        if (isPropDesc(propDesc)) {
            fnBody += `target.${key} = cache.get(desc.${key}.getHash(), desc.${key}); `;
        }
        else {
            fnBody += `target.${propName} = target.${propName} || {}; `;
            fnBody += writeExecutorBody(propDesc, propName);
        }
    });

    return fnBody;
}

export function createAsyncExecutor(desc: ItemDesc): AsyncPropsExecutor {
    if (!isItemDesc(desc)) {
        throw new AcDeveloperError('createAsyncEvaluator', 'item desc must be instance of ItemDesc.');
    }

    const evaluatorName = `${desc.getType()}_async_props_evaluator`;
    const fnBody = writeAsyncExecutorBody(desc.getPropsDesc());

    return new Function(`return function ${evaluatorName}(target, context, desc, cache) { 
        const tasks = [];
        ${fnBody}
        
        return Promise.all(tasks).then(() => target); 
    }`)();
}

function writeAsyncExecutorBody(propsDesc: Object, parentProp?: string): string {
    let fnBody = ``;

    Object.keys(propsDesc).forEach(propName => {
        const propDesc = propsDesc[propName];
        const key = parentProp ?  `${parentProp}.${propName}` : propName;

        if (isPropDesc(propDesc)) {
            fnBody += `tasks.push(Promise.resolve(cache.get(desc.${key}.getHash(), desc.${key})).then(val => target.${key} = val)); `;
        }
        else {
            fnBody += `target.${propName} = target.${propName} || {}; `;
            fnBody += writeAsyncExecutorBody(propDesc, propName);
        }
    });

    return fnBody;
}
