import { close, init } from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { act, renderHook } from '@testing-library/react-hooks';
import type { MutableRefObject, PropsWithChildren, ReactElement } from 'react';
import type { NavigateFunction } from 'react-router';
import { MemoryRouter, useNavigate } from 'react-router';
import useReactRouterV6SentryBrowserTracingIntegration from '..';

const IMMEDIATELY = 0;

describe('useReactRouterV6SentryBrowserTracingIntegration', (): void => {
  afterEach(async (): Promise<void> => {
    await close(IMMEDIATELY);
  });

  it('should be a BrowserTracing integration', (): void => {
    const { result } = renderHook(
      useReactRouterV6SentryBrowserTracingIntegration,
      {
        wrapper: MemoryRouter,
      },
    );
    expect(result.current).toBeInstanceOf(Integrations.BrowserTracing);
  });

  // validated by coverage
  it('should finish active transactions on navigate', (): void => {
    const navigate: MutableRefObject<NavigateFunction> = {
      current(): void {
        throw new Error('`navigate` has not been initiated.');
      },
    };

    function Init(): null {
      navigate.current = useNavigate();
      return null;
    }

    const { result } = renderHook(
      useReactRouterV6SentryBrowserTracingIntegration,
      {
        wrapper({
          children,
        }: Readonly<PropsWithChildren<unknown>>): ReactElement {
          return (
            <MemoryRouter>
              <Init />
              {children}
            </MemoryRouter>
          );
        },
      },
    );

    act((): void => {
      init({
        dsn: 'https://0123456789abcdef@o01234.ingest.sentry.io/56789',
        integrations: [result.current],
      });
    });

    act((): void => {
      navigate.current('/test-pathname');
    });
  });
});
