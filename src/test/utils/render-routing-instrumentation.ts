import type { ReactRouterInstrumentation } from '@sentry/react/dist/types';
import type { Transaction, TransactionContext } from '@sentry/types';
import type { NavigateFunction, To } from 'react-router';
import useRoutingInstrumentation from '../..';
import mapEntryToEntries from './map-entry-to-entries';
import renderRouterHook from './render-router-hook';

interface RoutingInstrumentationResult {
  readonly navigate: NavigateFunction;
  readonly routingInstrumentation: ReactRouterInstrumentation;
  unmount: () => void;
}

export default function renderRoutingInstrumentation(
  initialEntry?: Readonly<To> | undefined,
): RoutingInstrumentationResult {
  const { navigate, result, unmount } = renderRouterHook(
    useRoutingInstrumentation,
    {
      initialEntries: mapEntryToEntries(initialEntry),
    },
  );

  return {
    navigate,
    unmount,

    routingInstrumentation(
      startTransaction: (
        // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
        context: Readonly<TransactionContext>,
      ) => Transaction | undefined,
      startTransactionOnPageLoad?: boolean | undefined,
      startTransactionOnLocationChange?: boolean | undefined,
    ): void {
      result.current(
        startTransaction,
        startTransactionOnPageLoad,
        startTransactionOnLocationChange,
      );
    },
  };
}
