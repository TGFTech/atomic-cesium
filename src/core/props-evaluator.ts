import { isPropDesc } from './prop-descriptor';
import { ItemDesc } from './item-description';
import { isItemDesc } from './item-descriptor';
import { ComputationCache } from './computation-cache';
import { AcDeveloperError } from './ac-developer-error';

export type PropsEvaluator = (context: object, desc: ItemDesc, cache: ComputationCache) => object;
export type AsyncPropsEvaluator = (context: object, desc: ItemDesc, cache: ComputationCache) => Promise<object>;

const evaluatorsCache = new Map<string, PropsEvaluator>();
const asyncEvaluatorsCache = new Map<string, AsyncPropsEvaluator>();

export function evaluate(desc: ItemDesc, context: object, cache: ComputationCache): object {
    let evaluator = evaluatorsCache.get(desc.getHash());

    if (!evaluator) {
        evaluator = createEvaluator(desc);
        evaluatorsCache.set(desc.getHash(), evaluator);
    }

    return evaluator(context, desc, cache);
}

export function evaluateAsync(desc: ItemDesc, context: object, cache: ComputationCache): Promise<object> {
    let evaluator = asyncEvaluatorsCache.get(desc.getHash());

    if (!evaluator) {
        evaluator = createAsyncEvaluator(desc);
        asyncEvaluatorsCache.set(desc.getHash(), evaluator);
    }

    return evaluator(context, desc, cache);
}


export function createEvaluator(desc: ItemDesc): PropsEvaluator {
    if (!isItemDesc(desc)) {
        throw new AcDeveloperError('createEvaluator', 'item desc must be instance of ItemDesc.');
    }

    const evaluatorName = `${desc.getType()}_props_evaluator`;
    const fnBody = writeEvaluatorBody(desc.getPropsDesc());

    return new Function(`return function ${evaluatorName}(context, desc, cache) { 
        const props = {};
        const propsDesc = desc.getPropsDesc();
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
            fnBody += `props.${key} = cache.get(propsDesc.${key}.getHash(), propsDesc.${key}, context); `;
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
        const propsDesc = desc.getPropsDesc();
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
            fnBody += `tasks.push(Promise.resolve(cache.get(propsDesc.${key}.getHash(), propsDesc.${key}, context))
                .then(val => props.${key} = val)); `;
        }
        else {
            fnBody += `props.${propName} = {}; `;
            fnBody += writeAsyncEvaluatorBody(propDesc, propName);
        }
    });

    return fnBody;
}
