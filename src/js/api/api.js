import { auth } from '../auth.js'

export async function get(url) {
  const token = await getToken()

  const response = await fetch(url, {
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

  const response = await fetch(url, {
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
