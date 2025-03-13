import { StrapiErrorT } from '@/types/strapi/StrapiError';
import { StrapiLoginResponseT } from '@/types/strapi/User';
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getUserRole } from '@/lib/services/auth';
import { verifyTurnstileToken, isTurnstileEnabled } from '@/lib/services/turnstile';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    CredentialsProvider({
      name: 'email and password',
      credentials: {
        identifier: {
          label: 'Email or username *',
          type: 'text',
        },
        password: { label: 'Password *', type: 'password' },
        turnstileToken: { label: 'Turnstile Token', type: 'text' },
      },
      async authorize(credentials, req) {
        // Check if required credentials are provided
        if (!credentials || !credentials.identifier || !credentials.password) {
          return null;
        }
        
        // Only validate Turnstile token if it's enabled
        if (await isTurnstileEnabled()) {
          if (!credentials.turnstileToken) {
            return null;
          }
          
          const isTurnstileValid = await verifyTurnstileToken(credentials.turnstileToken);
          if (!isTurnstileValid) {
            throw new Error('Turnstile verification failed. Please try again.');
          }
        }
        
        console.log('user and password authorize =>', credentials);
        try {
          const strapiResponse = await fetch(
            `${process.env.STRAPI_BACKEND_URL}/api/auth/local`,
            {
              method: 'POST',
              headers: {
                'Content-type': 'application/json',
              },
              body: JSON.stringify({
                identifier: credentials!.identifier,
                password: credentials!.password,
              }),
            }
          );

          if (!strapiResponse.ok) {
            // return error to signIn callback
            const contentType = strapiResponse.headers.get('content-type');
            if (contentType === 'application/json; charset=utf-8') {
              const data: StrapiErrorT = await strapiResponse.json();
              throw new Error(data.error.message);
            } else {
              throw new Error(strapiResponse.statusText);
            }
          }

          // success
          const data: StrapiLoginResponseT = await strapiResponse.json();
          return {
            name: data.user.username,
            email: data.user.email,
            id: data.user.id.toString(),
            strapiUserId: data.user.id,
            blocked: data.user.blocked,
            strapiToken: data.jwt,
          };
        } catch (error) {
          // Catch errors in try but also f.e. connection fails
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
//      console.log('singIn callback', { account, profile, user });
      if (
        account &&
        account.provider === 'google' &&
        profile &&
        'email_verified' in profile
      ) {
        if (!profile.email_verified) return false;
      }

      // set user role name into user data
      const userRole = await getUserRole(`${user.strapiUserId}`);
      user.roleName = userRole;
      return true;
    },

    async jwt({ token, trigger, account, user, session }) {
//      console.log('jwt callback', {
//        token,
//        trigger,
//        account,
//        user,
//        session,
//      });

      // change username update
      if (trigger === 'update' && session?.username) {
        token.name = session.username;
      }

      // change password update
      if (trigger === 'update' && session?.strapiToken) {
        token.strapiToken = session.strapiToken;
      }

      if (account) {
        if (account.provider === 'google') {
          // we now know we are doing a sign in using GoogleProvider
          try {
console.log("************** login with google ", `${process.env.STRAPI_BACKEND_URL}/api/auth/${account.provider}/callback?access_token=${account.access_token}`);
            const strapiResponse = await fetch(
              `${process.env.STRAPI_BACKEND_URL}/api/auth/${account.provider}/callback?access_token=${account.access_token}`,
              { cache: 'no-cache' }
            );
console.log("************** login with google backend response ", strapiResponse);
            if (!strapiResponse.ok) {
              const strapiError: StrapiErrorT = await strapiResponse.json();
              // console.log('strapiError', strapiError);
              throw new Error(strapiError.error.message);
            }
            const strapiLoginResponse: StrapiLoginResponseT =
              await strapiResponse.json();
            // customize token
            // name and email will already be on here
            token.strapiToken = strapiLoginResponse.jwt;
            token.strapiUserId = strapiLoginResponse.user.id;
            token.provider = account.provider;
            token.blocked = strapiLoginResponse.user.blocked;
          } catch (error) {
            throw error;
          }
        }
        if (account.provider === 'credentials') {
          // for credentials, not google provider
          // name and email are taken care of by next-auth or authorize
          token.strapiToken = user.strapiToken;
          token.strapiUserId = user.strapiUserId;
          token.provider = account.provider;
          token.blocked = user.blocked;
        }
        token.roleName = user.roleName;
      }
      return token;
    },
    async session({ token, session }) {
//      console.log('session callback', {
//        token,
//        session,
//      });
      session.strapiToken = token.strapiToken;
      session.provider = token.provider;
      session.user.strapiUserId = token.strapiUserId;
      session.user.blocked = token.blocked;
      session.user.roleName = token.roleName;

      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/signin',
    error: '/auth-error',
  },
};
