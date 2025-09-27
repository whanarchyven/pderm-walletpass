export const matchTyped = <T extends readonly (string | "root")[]>(
  str: string,
  startsWith: T
): Record<T[number], string | null> => {
  let hasPocket = false;
  const match = startsWith.map((prefix) => {
    const matched = str.match(new RegExp(`^${prefix}(.*)`));
    if (matched) hasPocket = true;
    const pocket =
      matched && matched[1] !== undefined ? matched[1] || prefix : null;

    return [prefix, pocket] as [T[number], string | null];
  });
  if (!hasPocket) return { root: str } as Record<T[number], string | null>;

  return Object.fromEntries(match) as Record<T[number], string | null>;
};
