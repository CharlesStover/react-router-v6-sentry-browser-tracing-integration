import type { RenderHookResult } from '@testing-library/react-hooks';
import type { NavigateFunction } from 'react-router';

export default interface RenderRouterHookResult<Props, State>
  extends RenderHookResult<Props, State> {
  readonly navigate: NavigateFunction;
}
