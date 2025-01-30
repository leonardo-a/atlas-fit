import { CookiesHelper } from '@/utils/cookies-helper'
import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://192.168.1.116:3333',
})

api.interceptors.request.use(async (config) => {
  const token = CookiesHelper.getCookie('authToken')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
