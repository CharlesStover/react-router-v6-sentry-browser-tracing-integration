import type { TransactionContext } from '@sentry/types';

export default function toContext(): TransactionContext {
  return {
    name: 'test-name',
  };
}
