import type { Transaction } from '@sentry/types';
import TEST_TRANSACTION from '../constants/test-transaction';
import TEST_FINISH from '../utils/test-finish';

const TEST_CUSTOM_START_TRANSACTION = jest.fn();

beforeEach((): void => {
  TEST_CUSTOM_START_TRANSACTION.mockImplementation(
    (): Transaction => ({
      ...TEST_TRANSACTION,
      finish: TEST_FINISH,
    }),
  );
});

export default TEST_CUSTOM_START_TRANSACTION;
