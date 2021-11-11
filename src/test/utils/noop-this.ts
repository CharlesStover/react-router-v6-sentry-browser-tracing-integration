export default function noopThis<T>(this: T): T {
  return this;
}
