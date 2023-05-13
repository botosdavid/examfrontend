import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../../prisma/lib/prismadb";
import bcrypt from 'bcrypt';

export const authOptions =  {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      
      credentials: {
        neptun: { label: 'neptun', type: 'text', required: true },
        password: {label: 'password', type: 'password', required: true},
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const { neptun, password } = credentials;

        const user = await prisma.user.findFirst({ where: { neptun: neptun }});
        if(!user) return null;

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) return null;

        return user // Any object returned will be saved in `user` property of the JWT
      }

    })
  ],
  
  secret: process.env.JWT_SECRET,
  callbacks: {
    
    async session({ session, token, user }) {
      console.log('Session');
      session.user = token.user;
      return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log('JWT');
      if (user) token.user = user;
      return token
    }

  }
}

export default NextAuth(authOptions);