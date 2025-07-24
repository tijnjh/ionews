import { formatDistanceToNow } from 'date-fns'

export function relativify(uts: number) {
  const timestamp = uts * 1000
  const date = new Date(timestamp)
  const formatted = formatDistanceToNow(date, { addSuffix: true })
  return formatted.replace('about', '')
}

export function formatUrl(url: string) {
  const parsedUrl = URL.parse(url)

  if (!parsedUrl) {
    throw new Error('something went wrong when trying to parse a story url')
  }

  const hostname = parsedUrl?.hostname
  return hostname?.startsWith('www.') ? hostname.replace('www.', '') : hostname
}
