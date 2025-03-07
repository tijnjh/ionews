import { formatDistanceToNow } from "date-fns";

function tryCatch<T, E = Error>(
  input: (() => T) | Promise<T>
): Promise<[T | null, E | null]> | [T | null, E | null] {
  if (typeof input === "function") {
    try {
      return [input(), null];
    } catch (error) {
      return [null, error as E];
    }
  } else if (input instanceof Promise) {
    return input

      .then((data): [T, null] => [data, null])

      .catch((error): [null, E] => [null, error as E]);
  } else {
    throw new Error("Input must be a function or a promise.");
  }
}

export function relativify(uts: number) {
  const s1 = uts * 1000;

  const [data, error] = tryCatch(() => new Date(s1));
  if (error) return;

  const s2 = data;
  const s3 = formatDistanceToNow(s2, { addSuffix: true });
  const s4 = s3.replace("about", "");

  return s4;
}

export function formatUrl(url: string) {
  const [data, error] = tryCatch(() => new URL(url));
  if (error) return;

  const s1 = data!.hostname;
  const s2 = !!s1.startsWith("www.") ? s1.replace("www.", "") : s1;

  return s2;
}
