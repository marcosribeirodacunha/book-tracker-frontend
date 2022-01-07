import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { parseCookies, destroyCookie } from 'nookies';

import { AuthTokenError } from '../services/errors/AuthTokenError';

// Allow access only to authenticated users
export function withSSRAuth<P>(fn: GetServerSideProps<P>): GetServerSideProps {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx)
    const token = cookies['booktracker.token'];

    // If the user is not authenticated redirect to the login page
    if (!token)
      return {
        redirect: {
          destination: '/login',
          permanent: false
        }
      }

    try {
      // Try to execute the operations in the backend
      return await fn(ctx)
    } catch (error) {
      // If a request operation throws an non authorized error (401)
      // also redirects the user to the login page
      if (error instanceof AuthTokenError) {
        destroyCookie(ctx, 'booktracker.token');

        return {
          redirect: {
            destination: '/login',
            permanent: false,
          }
        }
      }

      return new Promise(() => { props: {} })
    }
  }
}