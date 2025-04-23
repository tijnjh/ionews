import { formatDistanceToNow } from "date-fns";

import { toast, tryCatch } from "tsuite";

export function relativify(uts: number) {
  const timestamp = uts * 1000;
  const date = new Date(timestamp);
  const formatted = formatDistanceToNow(date, { addSuffix: true });
  return formatted.replace("about", "");
}

export function formatUrl(url: string) {
  const [urlObj, err] = tryCatch(() => new URL(url));
  if (!err) {
    const hostname = urlObj?.hostname;
    return hostname?.startsWith("www.")
      ? hostname.replace("www.", "")
      : hostname;
  } else {
    toast(`something went wrong when trying to parse a story url: ${err}`);
  }
}
