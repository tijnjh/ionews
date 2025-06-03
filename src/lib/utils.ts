import { formatDistanceToNow } from "date-fns";
import { tryCatch } from "typecatch";
import { haptic } from "ios-haptics";

export function relativify(uts: number) {
  const timestamp = uts * 1000;
  const date = new Date(timestamp);
  const formatted = formatDistanceToNow(date, { addSuffix: true });
  return formatted.replace("about", "");
}

export function formatUrl(url: string) {
  const { data: urlObj, error } = tryCatch(() => new URL(url));
  if (!error) {
    const hostname = urlObj?.hostname;
    return hostname?.startsWith("www.")
      ? hostname.replace("www.", "")
      : hostname;
  } else {
    haptic.error();
    console.error(
      `something went wrong when trying to parse a story url: ${error.message}`,
    );
  }
}
