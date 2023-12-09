import { auth } from '../auth.js'

const BASE_URL = 'https://mrnagydavid-nc-api-e8639114c055.herokuapp.com'

export async function get(url) {
  const token = await getToken()

  const response = await fetch(`${BASE_URL}${url}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  return response.json()
}

export async function put(url, body) {
  const token = await getToken()

  const response = await fetch(`${BASE_URL}${url}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  })

  return response.json()
}

async function getToken() {
  const token = await auth.currentUser.getIdToken()
  console.log(token)
  return token
}
