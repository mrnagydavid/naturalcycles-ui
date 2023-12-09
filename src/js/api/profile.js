import { get, put } from './api.js'

export async function fetchProfile() {
  const { data } = await get('/profile')
  return data
}

export async function updateProfile(params) {
  const response = await put('/profile', params)
  return response
}
