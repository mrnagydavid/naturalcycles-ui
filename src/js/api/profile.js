import { get, put } from './api.js'

const BASE_URL = 'http://localhost:3000'

export async function fetchProfile() {
  const { data } = await get(`${BASE_URL}/profile`)
  return data
}

export async function updateProfile(params) {
  const response = await put(`${BASE_URL}/profile`, params)
  return response
}
