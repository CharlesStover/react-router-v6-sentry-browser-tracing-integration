import type { To } from 'react-router';

export default function mapEntryToEntries(
  entry?: Readonly<To> | undefined,
): To[] | undefined {
  if (typeof entry === 'undefined') {
    return;
  }
  return [entry];
}
