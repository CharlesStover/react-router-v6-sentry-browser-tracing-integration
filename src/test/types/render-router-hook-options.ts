import type { RenderHookOptions } from '@testing-library/react-hooks';
import type { To } from 'react-router';

export default interface RenderRouterHookOptions<Props>
  extends RenderHookOptions<Props> {
  readonly initialEntries?: To[] | undefined;
}
