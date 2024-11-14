export const substrReplace = (str: string, replace: string, start: number, length?: number): string => {
  if (start < 0) {
    start += str.length;
  }

  length = length ?? str.length;
  if (length < 0) {
    length = length + str.length - start;
  }

  return [
    str.slice(0, start),
    replace.slice(0, Math.max(0, length)),
    replace.slice(length),
    str.slice(start + length),
  ].join('');
};
