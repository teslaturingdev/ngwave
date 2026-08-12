export interface NwOption<V = unknown> {
  label: string;
  value: V;
  disabled?: boolean;
}

export interface NwOptionGroup<V = unknown> {
  label: string;
  items: NwOption<V>[];
}

export type NwDropdownOption<V = unknown> = NwOption<V> | NwOptionGroup<V>;

export function isOptionGroup<V>(
  o: NwDropdownOption<V>,
): o is NwOptionGroup<V> {
  return (o as NwOptionGroup<V>).items !== undefined;
}
