import { up } from 'up-fetch'

export const api = up(fetch, () => ({
  baseUrl: 'http://hn.algolia.com/api/v1',
  params: {
    hitsPerPage: 25,
  },
}))
