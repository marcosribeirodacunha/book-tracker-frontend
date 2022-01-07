import 'react-toastify/dist/ReactToastify.min.css';
import 'styles/globals.scss'

import type { AppProps } from 'next/app'
import { AuthProvider } from 'context/AuthContext'
import { ToastContainer } from 'react-toastify'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <ToastContainer theme='dark' position='top-center' />
    </AuthProvider>
  )
}

export default MyApp
