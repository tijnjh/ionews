import { query } from '$app/server';
import { Readability } from '@mozilla/readability';
import DOMPurify from 'isomorphic-dompurify';
import { JSDOM } from 'jsdom';
import * as v from 'valibot';

export const getReadableHtml = query(v.string(), async (url) => {
	const response = await fetch(url);
	const rawHtmlString = await response.text();
	const cleanHtmlString = DOMPurify.sanitize(rawHtmlString);
	const doc = new JSDOM(cleanHtmlString, { url });
	const reader = new Readability(doc.window.document);
	const article = reader.parse();
	return article;
});
