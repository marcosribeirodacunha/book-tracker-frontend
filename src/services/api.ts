import axios, { AxiosError } from "axios";
import { signOut } from "context/AuthContext";
import { GetServerSidePropsContext } from "next";
import { parseCookies } from "nookies";
import { AuthTokenError } from "./errors/AuthTokenError";

type Context = GetServerSidePropsContext | undefined

export function setupAPIClient(ctx: Context = undefined) {
  let cookies = parseCookies(ctx)

  const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL })
  api.defaults.headers.common.authorization = `Bearer ${cookies['booktracker.token']}`

  api.interceptors.response.use(response => {
    return response;
  }, (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Sign out the user
      if (process.browser) signOut()
      else return Promise.reject(new AuthTokenError())
    }

    return Promise.reject(error)
  })

  return api
}