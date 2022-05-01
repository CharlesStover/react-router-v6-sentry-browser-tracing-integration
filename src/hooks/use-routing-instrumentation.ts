import type { ReactRouterInstrumentation } from '@sentry/react/dist/types';
import type { Transaction, TransactionContext } from '@sentry/types';
import type { MutableRefObject } from 'react';
import { useCallback, useEffect, useRef } from 'react';
import type { Location, NavigationType } from 'react-router';
import { useLocation, useNavigationType } from 'react-router';
import TAGS from '../constants/tags';

export default function useRoutingInstrumentation(): ReactRouterInstrumentation {
  // Contexts
  const { pathname }: Location = useLocation();
  const navigationType: NavigationType = useNavigationType();

  // States
  const activeTransaction: MutableRefObject<Transaction | undefined> = useRef();
  const pathnameRef: MutableRefObject<string> = useRef(pathname);
  const customStartTransaction: MutableRefObject<
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    | ((context: Readonly<TransactionContext>) => Transaction | undefined)
    | undefined
  > = useRef();
  const startTransactionOnLocationChange: MutableRefObject<boolean> =
    useRef(true);

  // Effects
  const isIgnoredNavigationType: boolean =
    navigationType !== 'POP' && navigationType !== 'PUSH';
  useEffect((): void => {
    if (
      typeof customStartTransaction.current !== 'function' ||
      !startTransactionOnLocationChange.current ||
      isIgnoredNavigationType
    ) {
      return;
    }

    // The active transaction needs to be finished prior to starting a new one,
    //   instead of as a cleanup step, because the `pageload` transaction may
    //   still be in flight.
    // This requires that the `navigation` transaction be finished on unmount.
    if (activeTransaction.current) {
      activeTransaction.current.finish();
    }

    activeTransaction.current = customStartTransaction.current({
      name: pathname,
      op: 'navigation',
      tags: TAGS,
    });
  }, [isIgnoredNavigationType, pathname]);

  useEffect((): VoidFunction => {
    // Finish the active transaction on unmount.
    return (): void => {
      if (typeof activeTransaction.current === 'undefined') {
        return;
      }
      activeTransaction.current.finish();
    };
  }, []);

  // Reference the current pathname via a `MutableRefObject` so that the
  //   `routingInstrumentation` function does not change reference each time the
  //   `location` object or `pathname` string change.
  pathnameRef.current = pathname;
  return useCallback(
    (
      newCustomStartTransaction: (
        // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
        context: Readonly<TransactionContext>,
      ) => Transaction | undefined,
      startTransactionOnPageLoad = true,
      newStartTransactionOnLocationChange = true,
    ): void => {
      customStartTransaction.current = newCustomStartTransaction;
      startTransactionOnLocationChange.current =
        newStartTransactionOnLocationChange;

      if (!startTransactionOnPageLoad) {
        return;
      }

      activeTransaction.current = newCustomStartTransaction({
        name: pathnameRef.current,
        op: 'pageload',
        tags: TAGS,
      });
    },
    [],
  );
}
