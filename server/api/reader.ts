import { Readability } from "@mozilla/readability";
import DOMPurify from "isomorphic-dompurify";
import { JSDOM } from "jsdom";

export default defineEventHandler(async (event) => {
  const { url } = getQuery(event);

  if (!url) return;
  if (typeof url !== "string") return;

  const response = await fetch(url);
  const rawHtmlString = await response.text();
  const cleanHtmlString = DOMPurify.sanitize(rawHtmlString);
  const doc = new JSDOM(cleanHtmlString, { url });
  const reader = new Readability(doc.window.document);
  const article = reader.parse();

  return article?.content;
});
