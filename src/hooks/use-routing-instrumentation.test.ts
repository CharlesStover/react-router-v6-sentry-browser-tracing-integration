import { act } from '@testing-library/react-hooks';
import TAGS from '../constants/tags';
import renderRoutingInstrumentation from '../test/utils/render-routing-instrumentation';
import TEST_CUSTOM_START_TRANSACTION from '../test/utils/test-custom-start-transaction';
import TEST_FINISH from '../test/utils/test-finish';

const ONCE = 1;
const TEST_PATHNAME = '/test/pathname';

describe('useRoutingInstrumentation', (): void => {
  it('should ignore navigation before initializing', (): void => {
    const { navigate } = renderRoutingInstrumentation();

    // Expect no errors to be thrown, despite there there being no
    //   `customStartTransaction` function to call.
    act((): void => {
      navigate(TEST_PATHNAME);
    });
  });

  it('should ignore navigation when `startTransactionOnLocationChange` is false', (): void => {
    const { navigate, routingInstrumentation } = renderRoutingInstrumentation();

    act((): void => {
      routingInstrumentation(TEST_CUSTOM_START_TRANSACTION, false, false);
    });

    act((): void => {
      navigate(TEST_PATHNAME);
    });

    expect(TEST_CUSTOM_START_TRANSACTION).not.toHaveBeenCalled();
  });

  it('should ignore navigation when type is Action.Replace', (): void => {
    const { navigate, routingInstrumentation } = renderRoutingInstrumentation();

    act((): void => {
      routingInstrumentation(TEST_CUSTOM_START_TRANSACTION, false);
    });

    act((): void => {
      navigate(TEST_PATHNAME, {
        replace: true,
      });
    });

    expect(TEST_CUSTOM_START_TRANSACTION).not.toHaveBeenCalled();
  });

  it('should finish active transactions on navigation', (): void => {
    const { navigate, routingInstrumentation } = renderRoutingInstrumentation();

    act((): void => {
      routingInstrumentation(TEST_CUSTOM_START_TRANSACTION);
    });

    act((): void => {
      navigate(TEST_PATHNAME);
    });

    expect(TEST_FINISH).toHaveBeenCalledTimes(ONCE);
    expect(TEST_FINISH).toHaveBeenLastCalledWith();
  });

  it('should start a new transaction on navigation', (): void => {
    const { navigate, routingInstrumentation } = renderRoutingInstrumentation();

    act((): void => {
      routingInstrumentation(TEST_CUSTOM_START_TRANSACTION, false, true);
    });

    act((): void => {
      navigate(TEST_PATHNAME);
    });

    expect(TEST_CUSTOM_START_TRANSACTION).toHaveBeenCalledTimes(ONCE);
    expect(TEST_CUSTOM_START_TRANSACTION).toHaveBeenLastCalledWith({
      name: TEST_PATHNAME,
      op: 'navigation',
      tags: TAGS,
    });
  });

  it('should support unmounting without an active transaction', (): void => {
    const { unmount } = renderRoutingInstrumentation();

    // Expect no errors to be thrown, despite there there being no
    //   `customStartTransaction` function to call.
    unmount();
  });

  it('should finish active transactions on unmount', (): void => {
    const { routingInstrumentation, unmount } = renderRoutingInstrumentation();

    act((): void => {
      routingInstrumentation(TEST_CUSTOM_START_TRANSACTION);
    });

    unmount();
    expect(TEST_FINISH).toHaveBeenCalledTimes(ONCE);
    expect(TEST_FINISH).toHaveBeenCalledWith();
  });

  describe('routingInstrumentation', (): void => {
    it('should no-op when `startTransactionOnPageLoad` is false', (): void => {
      const { routingInstrumentation } = renderRoutingInstrumentation();

      act((): void => {
        routingInstrumentation(TEST_CUSTOM_START_TRANSACTION, false);
      });

      expect(TEST_CUSTOM_START_TRANSACTION).not.toHaveBeenCalled();
    });

    it('should emit a `pageload` operation', (): void => {
      const { routingInstrumentation } =
        renderRoutingInstrumentation(TEST_PATHNAME);

      act((): void => {
        routingInstrumentation(TEST_CUSTOM_START_TRANSACTION);
      });

      expect(TEST_CUSTOM_START_TRANSACTION).toHaveBeenCalledTimes(ONCE);
      expect(TEST_CUSTOM_START_TRANSACTION).toHaveBeenLastCalledWith({
        name: TEST_PATHNAME,
        op: 'pageload',
        tags: TAGS,
      });
    });
  });
});
