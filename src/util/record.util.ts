/* eslint-disable no-param-reassign */
export function mapRecord<V, O>(input: Record<string, V>, converter: (value: V) => O): Record<string, O>;
export function mapRecord<V, O>(input: undefined, converter: (value: V) => O): undefined;
export function mapRecord<V, O>(
  input: Record<string, V> | undefined,
  converter: (value: V) => O
): Record<string, O> | undefined;
export function mapRecord<V, O>(
  input: Record<string, V> | undefined,
  converter: (value: V) => O
): Record<string, O> | undefined {
  if (!input) {
    return undefined;
  }

  return Object.keys(input).reduce(
    (map, key) => {
      map[key] = converter(input[key]);
      return map;
    },
    {} as Record<string, O>
  );
}
