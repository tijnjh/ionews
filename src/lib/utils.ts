export function formatUrl(url: string) {
  const parsedUrl = URL.parse(url)

  if (!parsedUrl) {
    throw new Error('something went wrong when trying to parse a story url')
  }

  const hostname = parsedUrl?.hostname
  return hostname?.startsWith('www.') ? hostname.replace('www.', '') : hostname
}

export function preprocessHtml(html: string): string {
  return html.replaceAll(/<a /g, '<a target="_blank" rel="noopener noreferrer" ')
}
