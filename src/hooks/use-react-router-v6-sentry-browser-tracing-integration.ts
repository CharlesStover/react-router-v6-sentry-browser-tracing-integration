import type { ReactRouterInstrumentation } from '@sentry/react/dist/types';
import { Integrations } from '@sentry/tracing';
import type {
  Integration,
  Transaction,
  TransactionContext,
} from '@sentry/types';
import type { MutableRefObject } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import type { Location, NavigationType } from 'react-router';
import { useLocation, useNavigationType } from 'react-router';
import TAGS from '../constants/tags';

export default function useReactRouterV6SentryBrowserTracingIntegration(): Integration {
  // Contexts
  const location: Location = useLocation();
  const navigationType: NavigationType = useNavigationType();

  // States
  const activeTransaction: MutableRefObject<Transaction | undefined> = useRef();
  const customStartTransaction: MutableRefObject<
    | ((context: Readonly<TransactionContext>) => Transaction | undefined)
    | undefined
  > = useRef();
  const pathname: MutableRefObject<string> = useRef(location.pathname);
  const startTransactionOnLocationChange: MutableRefObject<boolean> =
    useRef(true);

  // Effects
  useEffect((): void => {
    pathname.current = location.pathname;
  }, [location.pathname]);

  useEffect((): void => {
    if (
      typeof customStartTransaction.current !== 'function' ||
      !startTransactionOnLocationChange.current ||
      (navigationType !== 'POP' && navigationType !== 'PUSH')
    ) {
      return;
    }

    if (activeTransaction.current) {
      activeTransaction.current.finish();
    }

    activeTransaction.current = customStartTransaction.current({
      name: location.pathname,
      op: 'navigation',
      tags: TAGS,
    });
  }, [location.pathname, navigationType]);

  useEffect((): VoidFunction => {
    // Finish the active transaction on unmount.
    return (): void => {
      if (typeof activeTransaction.current === 'undefined') {
        return;
      }
      activeTransaction.current.finish();
    };
  }, []);

  return useMemo((): Integration => {
    const routingInstrumentation: ReactRouterInstrumentation = (
      newCustomStartTransaction: (
        context: Readonly<TransactionContext>,
      ) => Transaction | undefined,
      startTransactionOnPageLoad,
      newStartTransactionOnLocationChange,
    ): void => {
      customStartTransaction.current = newCustomStartTransaction;

      // This default value is defined by `@sentry/react`. Triggering it is not
      //   within the scope of this package.
      // https://github.com/getsentry/sentry-javascript/blob/ac20799d841f57b3d64afc55f5331ab093c1c3c3/packages/react/src/reactrouter.tsx#L83
      // istanbul ignore next
      startTransactionOnLocationChange.current =
        newStartTransactionOnLocationChange ?? true;

      // This default value and branch are defined by `@sentry/react`.
      //   Triggering them  is not within the scope of this package.
      // https://github.com/getsentry/sentry-javascript/blob/ac20799d841f57b3d64afc55f5331ab093c1c3c3/packages/react/src/reactrouter.tsx#L85
      // istanbul ignore if
      if (startTransactionOnPageLoad === false || pathname.current === '') {
        return;
      }

      activeTransaction.current = newCustomStartTransaction({
        name: pathname.current,
        op: 'pageload',
        tags: TAGS,
      });
    };

    return new Integrations.BrowserTracing({
      routingInstrumentation,
    });
  }, []);
}
