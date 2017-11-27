import { ItemDesc } from './item-description';
import { ComputationCache } from './computation-cache';
import { createAssigner, PropsAssigner } from './props-assigner';
import {createEvaluator, PropsEvaluator, AsyncPropsEvaluator, createAsyncEvaluator} from './props-evaluator';
import {createExecutor, PropsExecutor, AsyncPropsExecutor, createAsyncExecutor} from './props-executor';

export class Props {

    private static _assigners = new Map<string, PropsAssigner>();
    private static _evaluators = new Map<string, PropsEvaluator>();
    private static _asyncEvaluators = new Map<string, AsyncPropsEvaluator>();
    private static _executors = new Map<string, PropsExecutor>();
    private static _asyncExecutors = new Map<string, AsyncPropsExecutor>();

    static assign(desc: ItemDesc, target: Object, source: Object): Object {
        let assigner = Props._assigners.get(desc.getHash());

        if (!assigner) {
            assigner = createAssigner(desc);
            Props._assigners.set(desc.getHash(), assigner);
        }

        return assigner(target, source);
    }

    static evalute(desc: ItemDesc, context: Object, cache: ComputationCache): Object {
        let evaluator = Props._evaluators.get(desc.getHash());

        if (!evaluator) {
            evaluator = createEvaluator(desc);
            Props._evaluators.set(desc.getHash(), evaluator);
        }

        return evaluator(context, cache);
    }

    static evaluteAsync(desc: ItemDesc, context: Object, cache: ComputationCache): Promise<Object> {
        let asyncEvaluator = Props._asyncEvaluators.get(desc.getHash());

        if (!asyncEvaluator) {
            asyncEvaluator = createAsyncEvaluator(desc);
            Props._asyncEvaluators.set(desc.getHash(), asyncEvaluator);
        }

        return asyncEvaluator(context, cache);
    }

    static execute(desc: ItemDesc, target: Object, context: Object, cache: ComputationCache): Object {
        let executor = Props._executors.get(desc.getHash());

        if (!executor) {
            executor = createExecutor(desc);
            Props._executors.set(desc.getHash(), executor);
        }

        return executor(target, context, cache);
    }

    static executeAsync(desc: ItemDesc, target: Object, context: Object, cache: ComputationCache): Promise<Object> {
        let asyncExecutor = Props._asyncExecutors.get(desc.getHash());

        if (!asyncExecutor) {
            asyncExecutor = createAsyncExecutor(desc);
            Props._asyncExecutors.set(desc.getHash(), asyncExecutor);
        }

        return asyncExecutor(target, context, cache);
    }
}
