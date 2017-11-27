import { isPropDesc } from './prop-descriptor';
import { ItemDesc } from './item-description';
import { isItemDesc } from './item-descriptor';
import { ComputationCache } from './computation-cache';
import { AcDeveloperError } from './ac-developer-error';

export type PropsEvaluator = (context: Object, cache: ComputationCache) => Object;
export type AsyncPropsEvaluator = (context: Object, cache: ComputationCache) => Promise<Object>;

export function evaluate(desc: ItemDesc, context: Object, cache: ComputationCache): Object {
    let evaluator = evaluate['cache'].get(desc.getHash());

    if (!evaluator) {
        evaluator = createEvaluator(desc);
        evaluate['cache'].set(desc.getHash(), evaluator);
    }

    return evaluator(context, cache);
}

evaluate['cache'] = new Map<string, PropsEvaluator>();

export function evaluateAsync(desc: ItemDesc, context: Object, cache: ComputationCache): Promise<Object> {
    let evaluator = evaluateAsync['cache'].get(desc.getHash());

    if (!evaluator) {
        evaluator = createAsyncEvaluator(desc);
        evaluateAsync['cache'].set(desc.getHash(), evaluator);
    }

    return evaluator(context, cache);
}

evaluateAsync['cache'] = new Map<string, PropsEvaluator>();

export function createEvaluator(desc: ItemDesc): PropsEvaluator {
    if (!isItemDesc(desc)) {
        throw new AcDeveloperError('createEvaluator', 'item desc must be instance of ItemDesc.');
    }

    const evaluatorName = `${desc.getType()}_props_evaluator`;
    const fnBody = writeEvaluatorBody(desc.getPropsDesc());

    return new Function(`return function ${evaluatorName}(context, desc, cache) { 
        const props = {};
        ${fnBody}
         
        return props;
    }`)();
}

function writeEvaluatorBody(propsDesc: Object, parentProp?: string): string {
    let fnBody = ``;

    Object.keys(propsDesc).forEach(propName => {
        const propDesc = propsDesc[propName];
        const key = parentProp ?  `${parentProp}.${propName}` : propName;

        if (isPropDesc(propDesc)) {
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
    if (!isItemDesc(desc)) {
        throw new AcDeveloperError('createAsyncEvaluator', 'item desc must be instance of ItemDesc.');
    }

    const evaluatorName = `${desc.getType()}_async_props_evaluator`;
    const fnBody = writeAsyncEvaluatorBody(desc.getPropsDesc());

    return new Function(`return function ${evaluatorName}(context, desc, cache) { 
        const props = {};
        const tasks = [];
        ${fnBody}
        
        return Promise.all(tasks).then(() => props); 
    }`)();
}

function writeAsyncEvaluatorBody(propsDesc: Object, parentProp?: string): string {
    let fnBody = ``;

    Object.keys(propsDesc).forEach(propName => {
        const propDesc = propsDesc[propName];
        const key = parentProp ?  `${parentProp}.${propName}` : propName;

        if (isPropDesc(propDesc)) {
            fnBody += `tasks.push(Promise.resolve(cache.get(desc.${key}.getHash(), desc.${key})).then(val => props.${key} = val)); `;
        }
        else {
            fnBody += `props.${propName} = {}; `;
            fnBody += writeAsyncEvaluatorBody(propDesc, propName);
        }
    });

    return fnBody;
}
