import type { Transaction } from '@sentry/types';
import noopThis from '../utils/noop-this';
import noopVoid from '../utils/noop-void';
import toContext from '../utils/to-context';

const TEST_TRANSACTION: Transaction = {
  child: noopThis,
  data: {},
  finish: noopVoid,
  getTraceContext: noopThis,
  metadata: {},
  name: 'test-name',
  setData: noopThis,
  setName: noopVoid,
  setHttpStatus: noopThis,
  setStatus: noopThis,
  setTag: noopThis,
  spanId: 'test-span-id',
  startChild: noopThis,
  startTimestamp: Date.now(),
  tags: {},
  toContext,
  toJSON: noopThis,
  traceId: 'test-trace-id',
  updateWithContext: noopThis,
  isSuccess(): boolean {
    return true;
  },
  toTraceparent(): string {
    return 'test-trace-parent';
  },
};

export default TEST_TRANSACTION;
