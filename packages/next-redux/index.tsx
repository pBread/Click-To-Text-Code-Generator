import { useLayoutEffect, useMemo } from "react";
import type { AnyAction, Store } from "redux";

export function useNextRedux<
  A extends AnyAction,
  S extends Store & Store<{}, A>
>(
  store: S,
  props: {
    pageProps: { pageActions?: A | A[] };
    router: { asPath: string; isSsr: boolean };
  }
) {
  const { pageActions } = props.pageProps;
  const { asPath, isSsr } = props.router;

  const viewedPages = useMemo(() => new Set(), []);

  useLayoutEffect(() => {
    const isFirstVisit = !viewedPages.has(asPath);
    const isFirstClientRender = !isSsr && viewedPages.size === 0;

    const isDispatching = pageActions && isFirstVisit && !isFirstClientRender;

    if (isDispatching) {
      const actions = Array.isArray(pageActions) ? pageActions : [pageActions];
      for (const action of actions) store.dispatch(action);
    }
    viewedPages.add(asPath);
  }, [asPath, isSsr, pageActions, store, viewedPages]);
}
