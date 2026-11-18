import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

const STATIC_USERS: Record<
  string,
  { id: string; name: string; role: 'USER' | 'DOCTOR' | 'ADMIN'; language: string }
> = {
  'priya@example.com': {
    id: 'priya_sharma_demo',
    name: 'Priya Sharma',
    role: 'USER',
    language: 'en',
  },
  'doctor@example.com': {
    id: 'dr_ananya_sen_demo',
    name: 'Dr. Ananya Sen',
    role: 'DOCTOR',
    language: 'en',
  },
  'admin@example.com': {
    id: 'admin_demo',
    name: 'Course Admin',
    role: 'ADMIN',
    language: 'en',
  },
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null;
        }

        const email = credentials.email.trim().toLowerCase();

        // 1. Instant check against static demo personas (zero DB required)
        if (STATIC_USERS[email]) {
          const u = STATIC_USERS[email];
          return {
            id: u.id,
            email,
            name: u.name,
            role: u.role,
            language: u.language,
          };
        }

        // 2. Try DB if available, fallback gracefully to guest demo user
        try {
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (user) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              language: user.language,
            };
          }
        } catch (_) {
          // Database not connected; continue to guest fallback
        }

        // 3. Fallback: Allow any email to log in for quick demo exploration
        const role = email.includes('doc') ? 'DOCTOR' : email.includes('admin') ? 'ADMIN' : 'USER';
        const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        return {
          id: `guest_${Date.now()}`,
          email,
          name: name || 'Demo User',
          role: role as any,
          language: 'en',
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.language = (user as any).language;
      }
      if (trigger === 'update' && session?.language) {
        token.language = session.language;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).language = token.language;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'pcos_health_super_secret_jwt_key_2026_demo_key_32chars',
};
