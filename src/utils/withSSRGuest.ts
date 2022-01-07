import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { parseCookies } from 'nookies';

// Allow access only to non authenticated users
// Checks if the user has a token. If there is a token we can redirect the user
// to a private page
export function withSSRGuest<P>(fn: GetServerSideProps<P>): GetServerSideProps {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx)

    if (cookies['booktracker.token'])
      return {
        redirect: {
          destination: '/books',
          permanent: false
        }
      }

    return fn(ctx)
  }
}