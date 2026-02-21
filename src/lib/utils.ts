export function preprocessHtml(html: string): string {
	return html.replaceAll(/<a /g, '<a target="_blank" rel="noopener noreferrer" ');
}
