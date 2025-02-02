import { CookiesHelper } from '@/utils/cookies-helper'
import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use(async (config) => {
  const token = CookiesHelper.getCookie('authToken')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
