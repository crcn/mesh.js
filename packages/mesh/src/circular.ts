import { proxy } from "./proxy";
import { createDeferredPromise } from "./deferred-promise";

export const circular = <TTarget extends (...args) => any>(create: (upstream: (...args) => any) => (downstream: (...args) => any) => TTarget) => (downstream: (...args) => any): TTarget => {
  const { promise: upstreamPromise, resolve: resolveUpstreamDispatcher } = createDeferredPromise<TTarget>();
  const top = create(proxy(() => upstreamPromise) as any)(downstream);
  resolveUpstreamDispatcher(top);
  return top as TTarget;
}


