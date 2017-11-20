import { PropDesc } from './prop-description';
import { ItemDesc } from './item-description';
import { ComputationCache } from './computation-cache';
import { AcDeveloperError } from './ac-developer-error';
import { FunctionsCache } from './functions-cache';

export type PropsExecutor = (target: Object, context: Object, cache: ComputationCache) => Object;
export type AsyncPropsExecutor = (target: Object, context: Object, cache: ComputationCache) => Promise<Object>;

export function execute(desc: ItemDesc, target: Object, context: Object, cache: ComputationCache) {
    let executor = FunctionsCache.getEvaluator(desc.getHash());

    if (!executor) {
        executor = createExecutor(desc);
        evaluate['cache'].set(desc.getHash(), evaluator);
    }

    return evaluator(context, cache);
}

export function executeAsync() {

}

export function createExecutor(desc: ItemDesc): PropsExecutor {
    if (!(desc instanceof ItemDesc)) {
        throw new AcDeveloperError('createEvaluator', 'item desc must be instance of ItemDesc.');
    }

    const evaluatorName = `${desc.getType()}_props_executor`;
    const fnBody = writeExecutorBody(desc.getDesc());

    return new Function(`return function ${evaluatorName}(target, context, desc, cache) { 
        ${fnBody}
         
        return target;
    }`)();
}

function writeExecutorBody(parsedItemDesc: Object, parentProp?: string): string {
    let fnBody = ``;

    Object.keys(parsedItemDesc).forEach(propName => {
        const propDesc = parsedItemDesc[propName];
        const key = parentProp ?  `${parentProp}.${propName}` : propName;

        if (propDesc instanceof PropDesc) {
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
    if (!(desc instanceof ItemDesc)) {
        throw new AcDeveloperError('createAsyncEvaluator', 'item desc must be instance of ItemDesc.');
    }

    const evaluatorName = `${desc.getType()}_async_props_evaluator`;
    const fnBody = writeAsyncExecutorBody(desc.getDesc());

    return new Function(`return function ${evaluatorName}(target, context, desc, cache) { 
        const tasks = [];
        ${fnBody}
        
        return Promise.all(tasks).then(() => target); 
    }`)();
}

function writeAsyncExecutorBody(parsedItemDesc: Object, parentProp?: string): string {
    let fnBody = ``;

    Object.keys(parsedItemDesc).forEach(propName => {
        const propDesc = parsedItemDesc[propName];
        const key = parentProp ?  `${parentProp}.${propName}` : propName;

        if (propDesc instanceof PropDesc) {
            fnBody += `tasks.push(Promise.resolve(cache.get(desc.${key}.getHash(), desc.${key})).then(val => target.${key} = val)); `;
        }
        else {
            fnBody += `target.${propName} = target.${propName} || {}; `;
            fnBody += writeAsyncExecutorBody(propDesc, propName);
        }
    });

    return fnBody;
}
