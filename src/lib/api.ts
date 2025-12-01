import { up } from 'up-fetch'

export const api = up(fetch, () => ({
  baseUrl: 'https://node-hnapi.herokuapp.com',
}))
