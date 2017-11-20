import { PropsAssigner } from './props-assigner';
import { AsyncPropsEvaluator, PropsEvaluator } from './props-evaluator';
import { AsyncPropsExecutor, PropsExecutor } from './props-executor';

export class FunctionsCache {
    private static _assigners = new Map<string, PropsAssigner>();
    private static _evaluators = new Map<string, PropsEvaluator>();
    private static _asyncEvaluators = new Map<string, AsyncPropsEvaluator>();
    private static _executors = new Map<string, PropsExecutor>();
    private static _asyncExecutors = new Map<string, AsyncPropsExecutor>();

    static getAssigner(descHash: string): PropsAssigner {
        return FunctionsCache._assigners.get(descHash);
    }

    static getEvaluator(descHash: string): PropsEvaluator {
        return FunctionsCache._evaluators.get(descHash);
    }

    static getAsyncEvaluator(descHash: string): AsyncPropsEvaluator {
        return FunctionsCache._asyncEvaluators.get(descHash);
    }

    static getExecutor(descHash: string): PropsExecutor {
        return FunctionsCache._executors.get(descHash);
    }

    static getAsyncExecutor(descHash: string): AsyncPropsExecutor {
        return FunctionsCache._asyncExecutors.get(descHash);
    }
}
